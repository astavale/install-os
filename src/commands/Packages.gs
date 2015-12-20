namespace ConfigurationScriptCommands

	class Packages:Object implements ScriptCommand

		prop readonly name:string = "packages"
		prop readonly description:string = "Install listed packages"

		def validate( package_list:Variant ):bool
			if not package_list.is_of_type( VariantType.ARRAY )
				return false
			var iterator = package_list.iterator()
			value:Variant? = iterator.next_value()
			result:bool = false
			while ( value != null )
				if value.get_child_value(0).is_of_type( VariantType.STRING )
					result = true
				else
					result = false
					break
				value = iterator.next_value()
			return result

		def run( filename:Variant ):bool
			return false

