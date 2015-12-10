uses
	ConfigurationScriptCommands
	Gee

class CommandList

	_list:ArrayList of ScriptCommand

	construct()
		_list = new ArrayList of ScriptCommand()
		// Add commands available to configuration scripts below
		_list.add( new Include() )

	def get_help( command:string = "" ):string
		message:string = ""
		if command == ""
			eol:string = "\n"
			size:int = _list.size
			for var script_command in _list
				size--
				if size == 0 do eol = ""
				message += "  %-25s%-s%s".printf( script_command.get_command(), 
											script_command.get_description(),
											eol
											)
		return message

