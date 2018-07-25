class CLI
	enum Command
		NONE
		UNKNOWN
		HELP
		INSTALL
		COMMAND_HELP
		LIST
		MOUNT

	_command:Command = Command.NONE
	prop command:Command
		get
			return _command
		set
			_command = value

	def parse_options( ref args:unowned array of string,
				ref config:Configuration.Config
				):bool
		var cli = new OptionContext( "<command> [<args>]" )
		cli.set_summary( """A tool to build configured operating system images

<command> can be one of:
  install <base> <root> [<script>] Use <base> configuration to install to <root>
  help [<script command>]          Show this message or a script command's help
  list                             Show a list of script commands
  mount <root> [<mount point>]     Mount raw disk image at /tmp or <mount point>
                                   The image will be unmounted when SIGTERM is received

<command> arguments:
  <base>                    Filename of basic options, e.g. package manager
  <mount point>             Directory or filename to mount disk image at
  <root>                    Block device, disk image or directory to install to
  <script>                  Filename of an optional script to customize the image
  <script command>          A command available to use in a configuration script""" )
		cli.set_help_enabled( false )

		help_message:bool = false
		imagesize:string = ""
		boot_device:string = ""

		options:OptionEntry[5]
		options[0] = { "help", 'h', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[1] = { "?", '?', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[2] = { "boot", 0, 0, OptionArg.STRING, ref boot_device, "Block device to install bootloader in to", "device" }
		options[3] = { "imagesize", 0, 0, OptionArg.STRING, ref imagesize, "File size for a new raw disk image, default is 2.0GiB", "gigabytes" }
		options[4] = { null }
		cli.add_main_entries( options, null )
		try
			cli.parse( ref args )
		except error:OptionError
			print( "%s", error.message )
			print( "Use '%s --help' to see a full list of command line options", args[ 0 ] )
			return false

		if args.length == 1
			help_message = true

		if help_message and args.length < 3
			print( cli.get_help( true, null ))
			return false

		if boot_device != ""
			config.boot_device = boot_device

		if imagesize != ""
			config.imagesize = imagesize

		return true

	def parse_command( ref args:unowned array of string ):Command
		if args.length == 1
			return Command.NONE
		command:Command = Command.NONE
		arg:string = args[1].down()
		case arg
			when "install"
				command = Command.INSTALL
			when "help"
				if args.length > 2
					command = Command.COMMAND_HELP
				else
					command = Command.HELP
			when "list"
				command = Command.LIST
			when "mount"
				command = Command.MOUNT
			default
				command = Command.UNKNOWN
		return command


