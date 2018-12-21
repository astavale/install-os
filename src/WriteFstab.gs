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

def write_fstab( config:Configuration.Config,
				filesystem:RootFilesystem
				):bool
	if config.device.root_uuid == ""
		message( "/etc/fstab not written because root filesystem UUID is blank" )
		return true
	try
		_template_resource:Bytes = resources_lookup_data( "/templates/boot/fstab.mustache", ResourceLookupFlags.NONE )
		_template:string = (string)_template_resource.get_data()
		var _hash = new dict of string, string
		_hash[ "boot_uuid" ] = config.device.boot_uuid
		_hash[ "root_uuid" ] = config.device.root_uuid
		_grub_config:string = GMustache.render( _template, _hash )
		var _file = File.new_for_path( filesystem.path_on_host + "/etc/fstab" )
		var _output = _file.create( FileCreateFlags.NONE )
		_bytes_written:size_t
		_output.write_all( _grub_config.data, out _bytes_written )
		message( "/etc/fstab written:\n%s", _grub_config )
	except
		message( "Creating or writing /etc/fstab file failed" )
		return false
	return true
