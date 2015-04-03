namespace Devices

	class FileAsDevice:Object implements Device
		prop bios_partition:string = ""
		prop efi_partition:string = ""
		prop root_partition:string = ""
		prop other_partitions:array of string = {""}
		
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

		def _create_image( device_string:string, filesize:string ) raises DeviceSetUpError
			_status:int = 1
			_output:string
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
		
		final
			pass
