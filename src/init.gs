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
	if not PackageManagers.use_package_manager( config, filesystem, out package_manager ) do return
	if not install_root( config.root_packages, package_manager ) do return
	kernel_package:array of string = { "kernel", "--disableplugin=presto" }
	if not install_kernel( kernel_package, package_manager, config, filesystem ) do return

	boot_loader:BootLoader = new BootLoaders.NoBootLoader()
	if not BootLoaders.use_boot_loader( config, filesystem, package_manager, ref boot_loader ) do return
	if not boot_loader.install() do return
	if not boot_loader.create_menu() do return
	if not write_fstab( config, filesystem ) do return

