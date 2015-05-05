uses Configuration

init
	Intl.setlocale( LocaleCategory.ALL, "" )
	Logging.set_up()
	var config = new Config()
	if not CLI_Options.parse( args, ref config ) do return
	if not Devices.use_device( config, ref config.device ) do return

	try
		var filesystem = new Filesystem.Filesystem( config )
	except error:Filesystem.FilesystemSetUpError
		return
