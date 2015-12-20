uses Configuration

init
	Intl.setlocale( LocaleCategory.ALL, "" )
	Logging.set_up()
	var commands = new CommandList()
	var config = new Config()
	if not CLI_Options.parse( ref args, ref config, commands.get_help() ) do return
	if not BaseFile.parse( args, ref config ) do return
	if not Script.find_if_given( args, ref config ) do return
	if not Script.load( commands, ref config ) do return
	if not Script.validate( commands, ref config ) do return

	if not Devices.use_device( config, ref config.device ) do return
	target_filesystem:Filesystem.Filesystem
	try
		target_filesystem = new Filesystem.Filesystem( config )
	except error:Filesystem.FilesystemSetUpError
		return
	package_manager:PackageManager
	if not PackageManagers.use_package_manager( config, target_filesystem, out package_manager ) do return

	if target_filesystem.root_is_empty
		if not install_base( config, target_filesystem, package_manager ) do return
	else
		message( "Root directory, %s, not empty. Install of base skipped.", target_filesystem.root_dir )


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

