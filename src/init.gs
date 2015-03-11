uses Configuration

init
	Intl.setlocale( LocaleCategory.ALL, "" )
	var config = new Config()
	if not CLI_Options.parse( args, ref config ) do return
	device:Device
	if not DeviceFactory.use_device( config.device_string, out device ) do return
