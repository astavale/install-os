namespace CLI_Options

	def parse( args:array of string, ref config:Configuration.Config ):bool
		var cli = new OptionContext( "<base>" )
		cli.set_summary( "Builds an OS (Operating System) image" )
		// cli.set_description( "More to follow" )
		cli.set_help_enabled( false )
		
		help_message:bool = false
		device_string:string = ""
		filesize:string = ""
		boot:string = ""
		
		options:OptionEntry[6]
		options[0] = { "help", 'h', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[1] = { "?", '?', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[2] = { "root", 0, 0, OptionArg.STRING, ref device_string, "Block device, disk image or directory to install OS on", "filename" }
		options[3] = { "filesize", 0, 0, OptionArg.STRING, ref filesize, "Number of gigabytes for the disk image file", "gigabytes" }
		options[4] = { "boot", 0, 0, OptionArg.STRING, ref boot, "Device file to use as boot partition", "device" }
		options[5] = { null }
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

		if device_string != ""
			config.device_string = device_string
		
		if filesize != ""
			config.filesize = filesize

		return true
