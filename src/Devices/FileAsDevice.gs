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

	class FileAsDevice:Object implements Device
		prop raw_partition:string = ""
		prop boot_partition:string = ""
		prop boot_uuid:string = ""
		prop readonly boot_is_mountable:bool
			get
				return _boot_is_mountable
		prop root_partition:string = ""
		prop root_uuid:string = ""
		prop readonly root_is_mountable:bool
			get
				return _root_is_mountable
		prop other_partitions:array of string = {""}

		_boot_is_mountable:bool = false
		_root_is_mountable:bool = false

		_status:int = 1
		_output:string = ""
		_loop_device:string = ""

		construct( parameters:Base.Parameters ) raises DeviceSetUpError
			var file = File.new_for_path( parameters.root_path )
			if ( /\/$/.match( parameters.root_path ))
				msg:string = "Failed: " + parameters.root_path + " is a directory, image must be created as a file"
				message( msg )
				raise new DeviceSetUpError.FILE_ERROR( msg )

			try
				if file.query_exists()
					_set_up_loopback( parameters.root_path )
					_root_is_mountable = true
					_boot_is_mountable = true
				else
					_create_image( parameters.root_path, parameters.image_size )
					_add_partitions( parameters.root_path )
					_set_up_loopback( parameters.root_path )
					_format_partitions( )
			except error:DeviceSetUpError
				raise error
			if parameters.boot_device != ""
				message( "Command line --boot = %s option ignored", parameters.boot_device )
			parameters.boot_device = _loop_device


		def _create_image( device_string:string, filesize:string ) raises DeviceSetUpError
			if filesize == ""
				filesize = "2.0"
			_size:int = (int)(double.parse( filesize ) * 1024)
			message( "Creating blank sparse disk image of size " + _size.to_string() + "MiB" )
			try
				Process.spawn_command_line_sync(
					"dd if=/dev/zero of=" + device_string + " oflag=direct bs=1M seek=" + _size.to_string() + " count=1",
					null,
					out _output,
					out _status )
			except
				pass
			if _status != 0
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Creation of blank sparse disk image failed" )
			message( "...done\n" + _output )


		def _add_partitions( device_string:string ) raises DeviceSetUpError
			message( "Adding GPT partition table to disk image" )
			try
				Process.spawn_command_line_sync(
					"parted --script " + device_string + " mktable gpt",
					null,
					out _output,
					out _status )
			except
				pass
			if _status != 0
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to add GPT partition table" )
			message( "...done\n" + _output )

			message( "Creating GRUB BIOS boot partition" )
			try
				Process.spawn_command_line_sync(
					"parted --script " + device_string + " mkpart primary 17KiB 1 set 1 bios_grub on name 1 GRUB_BIOS",
					null,
					out _output,
					out _status )
			except
				pass
			if _status != 0
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create GRUB BIOS partition" )
			message( "...done\n" + _output )

			message( "Creating EFI system boot partition" )
			try
				Process.spawn_command_line_sync(
					"parted --script " + device_string + " mkpart primary fat32 1 100 set 2 boot on name 2 EFI_System",
					null,
					out _output,
					out _status )
			except
				pass
			if _status != 0
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create EFI system boot partition" )
			message( "...done\n" + _output )

			message( "Creating root partition" )
			try
				Process.spawn_command_line_sync(
					"parted --script " + device_string + " mkpart primary ext4 100 100% name 3 root",
					null,
					out _output,
					out _status )
			except
				pass
			if _status != 0
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create root partition" )
			message( "...done\n" + _output )

		def _set_up_loopback( device_string:string ) raises DeviceSetUpError
			message( "Creating loopback device" )
			try
				Process.spawn_command_line_sync(
					"partx --verbose --add " + device_string,
					out _output,
					null,
					out _status )
			except
				pass
			if _status != 0
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create loopback device" )
			// extract loop device allocated from partx output
			r:Regex = /(?<device>.*):.*$/
			_results:MatchInfo?
			if r.match( _output, 0, out _results )
				_loop_device = _results.fetch_named( "device" )
			raw_partition = _loop_device + "p1"
			boot_partition = _loop_device + "p2"
			root_partition = _loop_device + "p3"
			message( "...done\n" + _output )


		def _format_partitions( ) raises DeviceSetUpError
			if boot_partition != ""
				message( "Formatting boot partition" )
				try
					Process.spawn_command_line_sync(
						"mkfs -t vfat -F 32 -s 1 " + boot_partition,
						null,
						out _output,
						out _status )
				except
					pass
				if _status != 0
					message( "...failed\n" + _output )
					raise new DeviceSetUpError.FILE_ERROR( "Failed to add filesystem to boot partition" )
				_boot_is_mountable = true
				message( "...done\n" + _output )
				boot_uuid = _get_uuid( boot_partition )

			if root_partition != ""
				message( "Formatting root partition" )
				try
					Process.spawn_command_line_sync(
						"mkfs -t ext4 " + root_partition,
						null,
						out _output,
						out _status )
				except
					pass
				Posix.sleep( 1 )
				if _status != 0
					message( "...failed\n" + _output )
					raise new DeviceSetUpError.FILE_ERROR( "Failed to add filesystem to root partition" )
				_root_is_mountable = true
				message( "...done\n" + _output )
				root_uuid = _get_uuid( root_partition )


		def _get_uuid( device:string ):string raises DeviceSetUpError
			try
				Process.spawn_command_line_sync(
					"lsblk --output UUID --noheadings " + device,
					out _output,
					null,
					out _status )
			except
				pass
			if _status != 0
				message( "Failed to find UUID for %s\n" + _output, device )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to find UUID of %s", device )
			uuid:string = _output.chomp()
			message ( "UUID %s found for %s", uuid, device )
			return uuid


		final
			if _loop_device == ""
				return
			try
				Process.spawn_command_line_sync(
					"partx --delete " + _loop_device,
					out _output,
					null,
					out _status )
			except
				pass
			if _status != 0
				message( "Failed to remove loopback device " + _loop_device + "\n" + _output )
			message( "Removed loopback device " + _loop_device )
