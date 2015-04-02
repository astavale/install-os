uses Configuration

init
	Intl.setlocale( LocaleCategory.ALL, "" )
	Logging.set_up()
	var config = new Config()
	if not CLI_Options.parse( args, ref config ) do return
	if not Devices.use_device( config, out config.device ) do return
