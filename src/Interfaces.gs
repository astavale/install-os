interface Device:Object
	prop abstract raw_partition:string
	prop abstract boot_partition:string
	prop abstract root_partition:string
	prop abstract other_partitions:array of string

