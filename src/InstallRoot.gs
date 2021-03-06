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

def install_root( package_manager:PackageManager, configured_by:PackageManagers.ConfiguredBy, configuration_source_location:string, public_key_location:string, package_list:array of string ):bool
	result:bool = false
	message( "Installing root filesystem..." )
	try
		package_manager.install_repository_configuration( configured_by, configuration_source_location )
		package_manager.install_repository_public_key( public_key_location )
	except error:PackageManagers.PackageManagerSetUpError
		message( @"...failed. $(error.message)" )
		return false
	result = package_manager.install_packages( package_list )
	if result
		message( "...done. Root filesystem install complete" )
	else
		message( "...failed. Install of root filesystem failed" )
	return result
