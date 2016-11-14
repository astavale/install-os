namespace CLI_Options

	def parse( ref args:unowned array of string, 
				ref config:Configuration.Config
				):bool
		var cli = new OptionContext( "<command> [<args>]" )
		cli.set_summary( """A tool to build configured operating system images

Commands:
  build <base> [<script>]  Build image from <base> with optional customization
  help [<script command>]  Show this help message or help for a script command
  list                     Show a list of script commands
  mount [<mount point>]    Mount disk image at tmp or specified <mount point>
                           The image will be unmounted when SIGTERM is received

Commands args:
  <base>                   Filename of base configuration file
  <script>                 Filename of an optional script to customize the image""" )
		cli.set_help_enabled( false )

		help_message:bool = false
		root_device:string = ""
		filesize:string = ""
		boot_device:string = ""

		options:OptionEntry[6]
		options[0] = { "help", 'h', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[1] = { "?", '?', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[2] = { "boot", 0, 0, OptionArg.STRING, ref boot_device, "Block device to install bootloader in to", "device" }
		options[3] = { "filesize", 0, 0, OptionArg.STRING, ref filesize, "Number of gigabytes for a disk image file", "gigabytes" }
		options[4] = { "root", 0, 0, OptionArg.STRING, ref root_device, "Block device, disk image or directory to install to", "filename" }
		options[5] = { null }
		cli.add_main_entries( options, null )
		try
			cli.parse( ref args )
		except error:OptionError
			print "%s", error.message
			print "Use '%s --help' to see a full list of command line options", args[ 0 ]
			return false

		if ( args[1] == "help" )
			help_message = true
		if help_message and args.length < 3
			print cli.get_help( true, null )
			return false

		var commands = new CommandBuilderList( config,
										new PackageManagers.NoPackageManager()
										)

		if help_message and args.length >=3
			print( commands.get_help( args[2] ))
			return false

		if ( args[1] == "list" )
			print( "Script Commands:\n" + commands.get_help () )

		if root_device != ""
			config.root_path = root_device

		if boot_device != ""
			config.boot_device = boot_device

		if filesize != ""
			config.filesize = filesize

		return true
