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

	var cli = new CommandLineInterface( args.copy(), new ConfigurationSubjectList( new PackageManagers.NoPackageManager()))
	if cli.command != CommandLineInterface.Command.INSTALL do return

	var parameters = new Base.Parameters()
	if cli.base_file != ""
		if not parameters.parse_file( cli.base_file ) do return
	if cli.root_path != "" do parameters.root_path = cli.root_path
	parameters.configuration_paths.concat( cli.configuration_paths.copy_deep(strdup) )
	if cli.boot_device != "" do parameters.boot_device = cli.boot_device
	if cli.image_size != "" do parameters.image_size = cli.image_size

	if not Devices.use_device( parameters, ref parameters.device ) do return

	root_filesystem:RootFilesystem
	try
		root_filesystem = new RootFilesystem( parameters )
	except error:RootFilesystemSetUpError
		message( error.message )
		return
	package_manager:PackageManager
	if not PackageManagers.use_package_manager( parameters, root_filesystem, out package_manager ) do return
	var subjects = new ConfigurationSubjectList( package_manager )

	var configurations = new List of Configuration()
	for path in parameters.configuration_paths
		try
			var configuration = new Configuration( path, subjects )
			if not configuration.check() do return
			configurations.append( configuration )
		except error:ConfigurationCheckError
			message( error.message )
			return

	var loop = new MainLoop()

	quit:SourceFunc = def()
		loop.quit()
		return Source.REMOVE

	setup_install.begin( parameters, root_filesystem, configurations, package_manager, quit )
	loop.run()


def async setup_install( parameters:Base.Parameters,
						root_filesystem:RootFilesystem,
						configurations:List of (Configuration),
						package_manager:PackageManager,
						quit:SourceFunc )
	Timeout.add( 0, setup_install.callback )
	yield
	if root_filesystem.empty_at_start
		if not install_base( parameters, root_filesystem, package_manager ) do quit()
	else
		message( "Root filesystem at %s not empty at start of install. Install of base skipped.", root_filesystem.path_on_host )

	for configuration in configurations
		if not configuration.apply() do quit()

	quit()
