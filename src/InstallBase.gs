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

	interim:EnumValue? = ((EnumClass)typeof(PackageManagers.ConfiguredBy).class_ref()).get_value_by_name( @"PACKAGE_MANAGERS_CONFIGURED_BY_$(parameters.repository_configured_by)" )
	if interim == null
		message( @"configured_by base parameter is '$(parameters.repository_configured_by)' and is not a value in PackageManagers.ConfiguredBy" )
		return false
	configured_by:PackageManagers.ConfiguredBy = (PackageManagers.ConfiguredBy)interim.value

	if not install_root( package_manager, configured_by, parameters.repository_configuration_source_location, parameters.repository_public_key_location, parameters.root_packages ) do return false
	if not install_kernel( package_manager, parameters, filesystem ) do return false

	boot_loader:BootLoader = new BootLoaders.NoBootLoader()
	if not BootLoaders.use_boot_loader( parameters, filesystem, package_manager, ref boot_loader ) do return false
	if not boot_loader.install() do return false
	if not boot_loader.create_menu() do return false
	if not write_fstab( parameters, filesystem ) do return false
	if not selinux_autorelabel( filesystem ) do return false
	if not set_root_password( filesystem ) do return false
	return true
