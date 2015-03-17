uses Configuration

init
	Intl.setlocale( LocaleCategory.ALL, "" )
	var config = new Config()
	if not CLI_Options.parse( args, ref config ) do return
	if not Devices.use_device( config.device_string, out config.device ) do return
