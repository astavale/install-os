namespace ScriptCommands

	class Packages:Object implements ScriptCommand

		prop readonly name:string = "packages"
		prop readonly short_description:string = "Install listed packages"
		prop readonly long_description:string = ""

		_package_manager:PackageManager

		construct( package_manager:PackageManager )
			_package_manager = package_manager

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

		def run( package_list:Variant ):bool
			var iterator = package_list.iterator()
			value:Variant? = iterator.next_value()
			result:bool = false
			packages:array of string = new array of string[ package_list.n_children() ]
			count:int = 0
			while ( value != null )
				if value.get_child_value(0).is_of_type( VariantType.STRING )
					packages[ count ] = value.get_child_value(0).get_string()
					count ++
					result = true
				else
					result = false
					break
				value = iterator.next_value()
			if result
				_package_manager.install_packages( packages )
			return result

