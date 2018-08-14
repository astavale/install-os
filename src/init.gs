uses
	Configuration

init
	Intl.setlocale()
	Logging.set_up()

	var cli = new CommandLineInterface( args.copy(), new CommandBuilderList( new PackageManagers.NoPackageManager()))
	if cli.command != CommandLineInterface.Command.INSTALL do return

	var config = new Config()
	if cli.base_file != "" do config.base_file = cli.base_file
	if cli.root_path != "" do config.root_path = cli.root_path
	if cli.script_path != "" do config.script_path = cli.script_path
	if cli.boot_device != "" do config.boot_device = cli.boot_device
	if cli.image_size != "" do config.image_size = cli.image_size
	if not BaseFile.parse( ref config ) do return

	if not Devices.use_device( config, ref config.device ) do return

	root_filesystem:RootFilesystem
	try
		root_filesystem = new RootFilesystem( config )
	except error:RootFilesystemSetUpError
		message( error.message )
		return
	package_manager:PackageManager
	if not PackageManagers.use_package_manager( config, root_filesystem, out package_manager ) do return
	var commands = new CommandBuilderList( package_manager )

	var script = new Script( config.script_path, commands )
	if not script.load() do return
	if not script.validate() do return

	if root_filesystem.empty_at_start
		if not install_base( config, root_filesystem, package_manager ) do return
	else
		message( "Root filesystem at %s not empty at start of install. Install of base skipped.", root_filesystem.path_on_host )

	if not script.run() do return


def install_base( config:Config, filesystem:RootFilesystem, package_manager:PackageManager ):bool
	if not install_root( config.root_packages, package_manager ) do return false
	kernel_package:array of string = { "kernel", "--disableplugin=presto" }
	if not install_kernel( kernel_package, package_manager, config, filesystem ) do return false

	boot_loader:BootLoader = new BootLoaders.NoBootLoader()
	if not BootLoaders.use_boot_loader( config, filesystem, package_manager, ref boot_loader ) do return false
	if not boot_loader.install() do return false
	if not boot_loader.create_menu() do return false
	if not write_fstab( config, filesystem ) do return false
	if not selinux_autorelabel( config, filesystem ) do return false
	if not set_root_password( config, filesystem ) do return false
	return true

