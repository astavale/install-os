namespace Devices

	class FileAsDevice:Object implements Device
		prop bios_partition:string = ""
		prop efi_partition:string = ""
		prop root_partition:string = ""
		prop other_partitions:array of string = {""}
		
		construct( device_string:string ) raises DeviceSetUpError
			var file = File.new_for_path( device_string )
			if file.query_exists()
				msg:string = "Failed because " + device_string + " already exists, the program will not overwrite an existing file"
				message( msg )
				raise new DeviceSetUpError.FILE_ERROR( msg )
		
		final
			pass
