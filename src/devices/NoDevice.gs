namespace Devices

	class NoDevice:Object implements Device
		prop raw_partition:string = ""
		prop boot_partition:string = ""
		prop root_partition:string = ""
		prop other_partitions:array of string = {""}

