/*
 *   install-os - a tool to build configured raw disk images
 *
 *   Copyright (C) 2018  Alistair Thomas <opensource @ astavale.co.uk>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

init
	Intl.setlocale()
	Logging.set_up()

	var cli = new CommandLineInterface( args.copy(), new CommandBuilderList( new PackageManagers.NoPackageManager()))
	if cli.command != CommandLineInterface.Command.INSTALL do return

	var parameters = new Base.Parameters()
	if cli.base_file != "" do parameters.base_file = cli.base_file
	if cli.root_path != "" do parameters.root_path = cli.root_path
	parameters.script_paths.concat( cli.script_paths.copy_deep(strdup) )
	if cli.boot_device != "" do parameters.boot_device = cli.boot_device
	if cli.image_size != "" do parameters.image_size = cli.image_size
	if not BaseFile.parse( ref parameters ) do return

	if not Devices.use_device( parameters, ref parameters.device ) do return

	root_filesystem:RootFilesystem
	try
		root_filesystem = new RootFilesystem( parameters )
	except error:RootFilesystemSetUpError
		message( error.message )
		return
	package_manager:PackageManager
	if not PackageManagers.use_package_manager( parameters, root_filesystem, out package_manager ) do return
	var commands = new CommandBuilderList( package_manager )

	var scripts = new List of Script()
	for script_path in parameters.script_paths
		var script = new Script( script_path, commands )
		if not script.validate() do return
		scripts.append( script )

	if root_filesystem.empty_at_start
		if not install_base( parameters, root_filesystem, package_manager ) do return
	else
		message( "Root filesystem at %s not empty at start of install. Install of base skipped.", root_filesystem.path_on_host )

	for script in scripts
		if not script.run() do return


def install_base( parameters:Base.Parameters,
				filesystem:RootFilesystem,
				package_manager:PackageManager
				):bool
	if not install_root( parameters.root_packages, package_manager ) do return false
	kernel_package:array of string = { "kernel", "--disableplugin=presto" }
	if not install_kernel( kernel_package, package_manager, parameters, filesystem ) do return false

	boot_loader:BootLoader = new BootLoaders.NoBootLoader()
	if not BootLoaders.use_boot_loader( parameters, filesystem, package_manager, ref boot_loader ) do return false
	if not boot_loader.install() do return false
	if not boot_loader.create_menu() do return false
	if not write_fstab( parameters, filesystem ) do return false
	if not selinux_autorelabel( filesystem ) do return false
	if not set_root_password( filesystem ) do return false
	return true
