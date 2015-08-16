interface Device:Object
	prop abstract raw_partition:string
	prop abstract boot_partition:string
	prop abstract readonly boot_is_mountable:bool
	prop abstract root_partition:string
	prop abstract readonly root_is_mountable:bool
	prop abstract other_partitions:array of string

interface PackageManager:Object
	def abstract install_packages( package_list:array of string ):bool

interface BootLoader:Object
	def abstract install():bool
	def abstract create_menu():bool
