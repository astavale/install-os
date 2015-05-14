uses Configuration

init
	Intl.setlocale( LocaleCategory.ALL, "" )
	Logging.set_up()
	var config = new Config()
	if not CLI_Options.parse( ref args, ref config ) do return
	if not BaseFile.parse( args, ref config ) do return
	if not Devices.use_device( config, ref config.device ) do return

	filesystem:Filesystem.Filesystem
	try
		filesystem = new Filesystem.Filesystem( config )
	except error:Filesystem.FilesystemSetUpError
		return
	
	package_manager:PackageManager
	if not PackageManagers.use_package_manager( filesystem, config, out package_manager ) do return
	if not install_root( config.root_packages, package_manager ) do return
