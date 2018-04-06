namespace RootPath

	def parse( args: array of string, ref config:Configuration.Config ):bool
		if not ( args.length > 3 )
			print """A root path parameter is needed.

Use '%s --help' to see command line syntax""", args[ 0 ]
			return false

		message( "Root path: %s", args[ 3 ] )
		config.root_path = args[ 3 ]
		return true

