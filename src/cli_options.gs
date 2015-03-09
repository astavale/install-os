namespace cli_options

	def parse( args:array of string ):bool
		var cli = new OptionContext( "<base>" )
		cli.set_summary( "Builds an Operating System image" )
		// cli.set_description( "More to follow" )
		cli.set_help_enabled( false )
		
		help_message:bool = false
		
		options:OptionEntry[3]
		options[0] = { "help", 'h', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[1] = { "?", '?', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[2] = { null }
		cli.add_main_entries( options, null )
		
		try
			cli.parse( ref args )
		except error:OptionError
			print "%s", error.message
			print "Use '%s --help' to see a full list of command line options", args[ 0 ]
			return false
							
		if help_message
			print cli.get_help( true, null )
			return false

		return true
