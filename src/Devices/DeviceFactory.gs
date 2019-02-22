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

namespace Devices

	exception DeviceSetUpError
		FILE_ERROR

	def use_device( parameters:Base.Parameters, ref device:Device ):bool
		if parameters.root_path == ""
			if not (device isa NoDevice)
				device = new NoDevice()
			return true

		// Test if root_path does not exist
		var _file = File.new_for_path( parameters.root_path )
		if not _file.query_exists()
			try
				device = new FileAsDevice( parameters )
				return true
			except error:DeviceSetUpError
				return false

		try
			_result:Posix.Stat
			if Posix.stat( parameters.root_path, out _result ) == -1
				message( "Unable to stat file " + parameters.root_path )
				raise new DeviceSetUpError.FILE_ERROR( "Unable to stat file under root path" )

			// Test if root_path is a directory
			if ( _result.st_mode & Posix.S_IFMT ) == Posix.S_IFDIR
				if not (device isa NoDevice)
					device = new NoDevice()
				return true

			// Test if root_path is a block device
			else if ( _result.st_mode & Posix.S_IFMT ) == Posix.S_IFBLK
				message( "Root device is a block device. Handling block devices not implemented." )
				return false

			// Test if root_path is a regular file
			else if ( _result.st_mode & Posix.S_IFMT ) == Posix.S_IFREG
				device = new FileAsDevice( parameters )
				return true

		except error:DeviceSetUpError
			pass

		return false
