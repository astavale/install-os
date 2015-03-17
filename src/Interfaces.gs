interface Device:Object
	prop abstract bios_partition:string
	prop abstract efi_partition:string
	prop abstract root_partition:string
	prop abstract other_partitions:array of string

