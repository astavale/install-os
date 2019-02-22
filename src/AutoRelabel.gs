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

def selinux_autorelabel( filesystem:RootFilesystem ):bool
	try
		_template:string = ""
		var _file = File.new_for_path( filesystem.path_on_host + "/.autorelabel" )
		var _output = _file.create( FileCreateFlags.NONE )
		_bytes_written:size_t
		_output.write_all( _template.data, out _bytes_written )
		message( "SELinux autorelabel written\n" )
	except
		message( "Writing SELinux autorelabel failed" )
		return false
	return true
