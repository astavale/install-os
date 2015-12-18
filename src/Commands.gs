uses
	ConfigurationScriptCommands
	Gee

class CommandList

	_list:TreeMap of string, ScriptCommand

	construct()
		var temp = new ArrayList of ScriptCommand
		// Add commands available to configuration scripts below
		temp.add( new Include() )

		_list = new TreeMap of string, ScriptCommand
		for var command in temp
			_list.set( command.name, command )

	def get_help( command:string = "" ):string
		message:string = ""
		if command == ""
			eol:string = "\n"
			var iterator = _list.map_iterator()
			while iterator.has_next()
				iterator.next()
				script_command:ScriptCommand = iterator.get_value()
				if !iterator.has_next() do eol = ""
				message += "  %-25s%-s%s".printf( script_command.name, 
											script_command.description,
											eol
											)
		return message

	def get_command( command:string ):ScriptCommand
		return _list.get( command )
