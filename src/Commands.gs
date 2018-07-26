uses
	ScriptCommands
	Gee
	Configuration

class CommandBuilderList

	_list:TreeMap of string, ScriptCommandBuilder
	_package_manager:PackageManager

	construct( package_manager:PackageManager )
		_package_manager = package_manager

		var temp = new ArrayList of ScriptCommandBuilder
		// Add commands available to configuration scripts below
		temp.add( new IncludeBuilder() )
		temp.add( new PackagesBuilder( _package_manager ) )

		_list = new TreeMap of string, ScriptCommandBuilder
		for var command in temp
			_list.set( command.name, command )

	def get_help( command:string = "" ):string
		message:string = ""
		if _list.has_key( command )
			message = _list.get( command ).long_description
		else if command == ""
			eol:string = "\n"
			var iterator = _list.map_iterator()
			while iterator.has_next()
				iterator.next()
				script_command:ScriptCommandBuilder = iterator.get_value()
				if !iterator.has_next()
					eol = ""
				message += "  %-25s%-s%s".printf( script_command.name, 
											script_command.short_description,
											eol
											)
		else
			message = "Unknown command: %s".printf( command )
		return message

	def get_builder( command:string ):ScriptCommandBuilder
		return _list.get( command )

	def contains( command:string ):bool
		result:bool = false
		if _list.has_key( command )
			result = true
		return result
