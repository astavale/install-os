namespace CLICommands

	enum Command
		NONE
		BUILD
		HELP
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
			when "build"
				command = Command.BUILD
			when "help"
				if args.length > 2
					command = Command.COMMAND_HELP
				else
					command = Command.HELP
			when "list"
				command = Command.LIST
			when "mount"
				command = Command.MOUNT
		if command != Command.NONE
			args = args[2:args.length]
		return command

	def show_help( args:array of string )
		print( "CLICommands.show_help called" )
