namespace Devices

	class NoDevice:Object implements Device
		prop raw_partition:string = ""
		prop boot_partition:string = ""
		prop readonly boot_is_mountable:bool
			get
				return false
		prop root_partition:string = ""
		prop readonly root_is_mountable:bool
			get
				return false
		prop other_partitions:array of string = {""}

