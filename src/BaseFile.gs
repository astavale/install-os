namespace BaseFile
 
	def parse( args: array of string, ref config:Configuration.Config ):bool
		if not ( args.length > 1 )
			print """A base file parameter is needed.

Use '%s --help' to see command line syntax""", args[ 0 ]
			return false
		
		var keyfile = new KeyFile()
		try
			keyfile.load_from_file( args[ 1 ], KeyFileFlags.NONE )

			if keyfile.has_group( "Repository" )
				if keyfile.has_key( "Repository", "format" )
					config.repository_format = keyfile.get_string( "Repository", "format" )
				if keyfile.has_key( "Repository", "distribution" )
					config.repository_distribution = keyfile.get_string( "Repository", "distribution" )
			if keyfile.has_group( "Target" )
				if keyfile.has_key( "Target", "version" )
					config.target_version = keyfile.get_string( "Target", "version" )
				if keyfile.has_key( "Target", "architecture" )
					config.target_architecture = keyfile.get_string( "Target", "architecture" )
		except
			return false
		
		return true