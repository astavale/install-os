namespace Script

	def find_if_given( args: array of string, ref config:Configuration.Config ):bool
		if args.length < 3
			return true
		var file = File.new_for_path( args[2] )
		if not file.query_exists()
			message( "Script, %s, does not exist", args[2] )
			return false
		config.script_path = args[2]
		return true
