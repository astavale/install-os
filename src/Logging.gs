namespace Logging

	def set_up()
		Log.set_handler( null, LogLevelFlags.LEVEL_MESSAGE, handler )
	
	def handler( domain:string?, level:LogLevelFlags, message:string )
		var time = new DateTime.now_local().format( "%Y-%m-%d %H:%M:%S" )
		print "[%s] %s", time, message
