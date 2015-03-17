namespace Devices

	class FileAsDevice:Object implements Device
		prop bios_partition:string = ""
		prop efi_partition:string = ""
		prop root_partition:string = ""
		prop other_partitions:array of string = {""}
		
		construct( device_string:string ) raises DeviceSetUpError
			pass
		
		final
			pass
