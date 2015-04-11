namespace Devices

	class FileAsDevice:Object implements Device
		prop raw_partition:string = ""
		prop boot_partition:string = ""
		prop root_partition:string = ""
		prop other_partitions:array of string = {""}
		
		_status:int = 1
		_output:string = ""
		_loop_device:string = ""
		
		construct( config:Configuration.Config ) raises DeviceSetUpError
			var file = File.new_for_path( config.device_string )
			if file.query_exists()
				msg:string = "Failed: " + config.device_string + " exists, will not overwrite an existing file"
				message( msg )
				raise new DeviceSetUpError.FILE_ERROR( msg )
			try
				_create_image( config.device_string, config.filesize )
			except error:DeviceSetUpError
				raise error
			try
				_add_partitions( config.device_string )
			except error:DeviceSetUpError
				raise error
			try
				_set_up_loopback( config.device_string )
			except error:DeviceSetUpError
				raise error

		def _create_image( device_string:string, filesize:string ) raises DeviceSetUpError
			if filesize == ""
				filesize = "4.0"
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
			if _status == 0
				message( "...done\n" + _output )
			else
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Creation of blank sparse disk image failed" )

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
			if _status == 0
				message( "...done\n" + _output )
			else
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to add GPT partition table" )

			message( "Creating GRUB BIOS boot partition" )
			try
				Process.spawn_command_line_sync( 
					"parted --script " + device_string + " mkpart primary 17KiB 1 set 1 bios_grub on name 1 GRUB_BIOS",
					null,
					out _output,
					out _status )
			except
				pass
			if _status == 0
				message( "...done\n" + _output )
			else
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create GRUB BIOS partition" )

			message( "Creating EFI system boot partition" )
			try
				Process.spawn_command_line_sync( 
					"parted --script " + device_string + " mkpart primary fat32 1 100 set 2 boot on name 2 EFI_System",
					null,
					out _output,
					out _status )
			except
				pass
			if _status == 0
				message( "...done\n" + _output )
			else
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create EFI system boot partition" )

			message( "Creating root partition" )
			try
				Process.spawn_command_line_sync( 
					"parted --script " + device_string + " mkpart primary ext4 100 100% name 3 root",
					null,
					out _output,
					out _status )
			except
				pass
			if _status == 0
				message( "...done\n" + _output )
			else
				message( "...failed\n" + _output )
				raise new DeviceSetUpError.FILE_ERROR( "Failed to create root partition" )

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

		final
			if _loop_device == ""
				return
			message( "Removing loopback device " + _loop_device )
			try
				Process.spawn_command_line_sync( 
					"partx --delete " + _loop_device,
					out _output,
					null,
					out _status )
			except
				pass
			if _status == 0
				message( "...done\n" + _output )
			else
				message( "...failed\n" + _output )

				
