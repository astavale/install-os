class CLI
	enum Command
		NONE
		UNKNOWN
		HELP
		INSTALL
		COMMAND_HELP
		LIST
		MOUNT

	_command:Command = Command.NONE
	prop command:Command
		get
			return _command
		set
			_command = value
