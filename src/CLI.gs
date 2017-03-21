uses
	CLICommands

class CLI
	_command:Command = Command.NONE
	prop command:Command
		get
			return _command
		set
			_command = value
