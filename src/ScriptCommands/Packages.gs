namespace ScriptCommands

	class PackagesBuilder:Object implements ScriptCommandBuilder
		prop readonly name:string = "packages"
		prop readonly short_description:string = "Install listed packages"
		prop readonly long_description:string = """"packages" - install a list of packages

The package manager specified in the base configuration file is used to install
the packages.

An example:
{ "script" : [
  { "packages" : [
      "vala",
      "vala-devel"
  ]}
]}"""

		_package_manager:PackageManager

		construct( package_manager:PackageManager )
			_package_manager = package_manager

		def get_command_with_data( data:Variant ):ScriptCommand
			return new Packages( data, _package_manager )

	class Packages:Object implements ScriptCommand

		_package_list:Variant
		_package_manager:PackageManager

		construct( data:Variant,
					package_manager:PackageManager
					)
			_package_list = data
			_package_manager = package_manager

		def validate():bool
			if not _package_list.is_of_type( VariantType.ARRAY )
				return false
			var iterator = _package_list.iterator()
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

		def run():bool
			var iterator = _package_list.iterator()
			value:Variant? = iterator.next_value()
			result:bool = false
			packages:array of string = new array of string[ _package_list.n_children() ]
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

