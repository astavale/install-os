namespace CLICommands

	enum Command
		NONE
		UNKNOWN
		HELP
		INSTALL
		COMMAND_HELP
		LIST
		MOUNT

	def parse( ref args:unowned array of string,
				ref config:Configuration.Config
				):Command
		if args.length == 1
			return Command.NONE
		command:Command = Command.NONE
		arg:string = args[1].down()
		case arg
			when "install"
				command = Command.INSTALL
			when "help"
				if args.length > 2
					command = Command.COMMAND_HELP
				else
					command = Command.HELP
			when "list"
				command = Command.LIST
			when "mount"
				command = Command.MOUNT
			default
				command = Command.UNKNOWN
		return command

	def show_help( args:array of string )
		print( "CLICommands.show_help called" )
