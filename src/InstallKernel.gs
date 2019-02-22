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

def install_kernel( package_list:array of string,
					package_manager:PackageManager,
					parameters:Base.Parameters,
					filesystem:RootFilesystem
					):bool
	result:bool = false
	message( "Installing kernel..." )
	result = package_manager.install_packages( package_list )
	if result
		message( "...done. Kernel install complete" )
	else
		message( "...failed. Install of kernel failed" )

	_boot:Dir
	try
		_boot = Dir.open( filesystem.path_on_host + "/boot" )
	except error:FileError
		message( "Unable to read boot directory. \"" + error.message + "\"" )
		return false
	entry:string? = _boot.read_name()
	match:MatchInfo
	while entry != null
		if (/^vmlinuz.*x86_64$/.match( entry, 0, out match ))
			parameters.boot_kernel_named = "/boot/" + match.fetch( 0 )
		if (/^initramfs-0.*\.img$/.match( entry, 0, out match ))
			parameters.boot_initrd_named = "/boot/" + match.fetch( 0 )
		entry = _boot.read_name()
	return result
