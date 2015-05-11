interface Device:Object
	prop abstract raw_partition:string
	prop abstract boot_partition:string
	prop abstract root_partition:string
	prop abstract other_partitions:array of string

interface PackageManager:Object
	def abstract install_packages( package_list:array of string ):bool
