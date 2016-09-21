interface Device:Object
	prop abstract raw_partition:string
	prop abstract boot_partition:string
	prop abstract boot_uuid:string
	prop abstract readonly boot_is_mountable:bool
	prop abstract root_partition:string
	prop abstract root_uuid:string
	prop abstract readonly root_is_mountable:bool
	prop abstract other_partitions:array of string

interface PackageManager:Object
	def abstract install_packages( package_list:array of string ):bool

interface BootLoader:Object
	def abstract install():bool
	def abstract create_menu():bool

interface ScriptCommandBuilder:Object
	prop abstract readonly name:string
	prop abstract readonly short_description:string
	prop abstract readonly long_description:string
	def abstract get_command_with_data( data:Variant ):ScriptCommand

interface ScriptCommand:Object
	def abstract validate():bool
	def abstract run():bool

