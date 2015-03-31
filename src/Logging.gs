namespace Logging

	def set_up()
		Log.set_handler( null, LogLevelFlags.LEVEL_MESSAGE, handler )
	
	def handler( domain:string?, level:LogLevelFlags, message:string )
		// Regex to remove debugging details, e.g. filename.gs:1:, from start of message
		r:Regex = /^.*:[0-9]*: /
		result:string = ""
		try
			result = r.replace( message, -1, 0, "" )
		except
			pass
		var time = new DateTime.now_local().format( "%Y-%m-%d %H:%M:%S" )
		print "[%s] %s", time, result
