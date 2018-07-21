uses
	Configuration
	CLICommands

init
	Intl.setlocale()
	Logging.set_up()
	var config = new Config()

	var cli = new CLI()
	if not CLI_Options.parse( ref args, ref config ) do return
	cli.command = CLICommands.parse( ref args, ref config )

	var commands = new CommandBuilderList( config, new PackageManagers.NoPackageManager() )

	case cli.command
		when CLI.Command.HELP, CLI.Command.NONE
			CLICommands.show_help( args )
		when CLI.Command.COMMAND_HELP
			print( commands.get_help( args[2] ))
		when CLI.Command.LIST
			print( "Script Commands:\n" + commands.get_help () )
		when CLI.Command.UNKNOWN
			print( "Unknown command: %s", args[1] )
			CLICommands.show_help( args )

	if ( cli.command == CLI.Command.HELP |
		cli.command == CLI.Command.COMMAND_HELP |
		cli.command == CLI.Command.LIST |
		cli.command == CLI.Command.NONE |
		cli.command == CLI.Command.UNKNOWN
		)
		return

	if not BaseFile.parse( args, ref config ) do return
	if not RootPath.parse( args, ref config ) do return
	if not Script.find_from_cli_argument( args, ref config ) do return

	if not Devices.use_device( config, ref config.device ) do return

	target_filesystem:Filesystem.Filesystem
	try
		target_filesystem = new Filesystem.Filesystem( config )
	except error:Filesystem.FilesystemSetUpError
		return
	package_manager:PackageManager
	if not PackageManagers.use_package_manager( config, target_filesystem, out package_manager ) do return
	commands = new CommandBuilderList( config, package_manager )

	if not Script.load( commands, ref config ) do return
	if not Script.validate( ref config ) do return

	if target_filesystem.root_is_empty
		if not install_base( config, target_filesystem, package_manager ) do return
	else
		message( "Root directory, %s, not empty. Install of base skipped.", target_filesystem.root_dir )

	if not Script.run( ref config ) do return


def install_base( config:Config, filesystem:Filesystem.Filesystem, package_manager:PackageManager ):bool
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

