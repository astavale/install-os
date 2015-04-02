namespace Devices

	class FileAsDevice:Object implements Device
		prop bios_partition:string = ""
		prop efi_partition:string = ""
		prop root_partition:string = ""
		prop other_partitions:array of string = {""}
		
		construct( config:Configuration.Config ) raises DeviceSetUpError
			var file = File.new_for_path( config.device_string )
			if file.query_exists()
				msg:string = "Failed because " + config.device_string + " already exists, the program will not overwrite an existing file"
				message( msg )
				raise new DeviceSetUpError.FILE_ERROR( msg )
		
		final
			pass
