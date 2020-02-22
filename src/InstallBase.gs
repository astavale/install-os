/*
 *   install-os - a tool to build configured raw disk images
 *
 *   Copyright (C) 2020  Alistair Thomas <opensource @ astavale.co.uk>
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
