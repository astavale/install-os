namespace CLICommands

	def parse( ref args:unowned array of string	):CLI.Command
		if args.length == 1
			return CLI.Command.NONE
		command:CLI.Command = CLI.Command.NONE
		arg:string = args[1].down()
		case arg
			when "install"
				command = CLI.Command.INSTALL
			when "help"
				if args.length > 2
					command = CLI.Command.COMMAND_HELP
				else
					command = CLI.Command.HELP
			when "list"
				command = CLI.Command.LIST
			when "mount"
				command = CLI.Command.MOUNT
			default
				command = CLI.Command.UNKNOWN
		return command

	def show_help( args:array of string )
		print( "CLICommands.show_help called" )
