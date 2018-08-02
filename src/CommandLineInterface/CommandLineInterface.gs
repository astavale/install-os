class CommandLineInterface
	enum Command
		NONE
		ERROR
		UNKNOWN
		HELP
		INSTALL
		COMMAND_HELP
		LIST
		MOUNT

	prop readonly command:Command = Command.NONE
	prop readonly base_file:string = ""
	prop readonly root_path:string = ""
	prop readonly script_path:string = ""
	prop readonly boot_device:string = ""
	prop readonly image_size:string = ""

	description:private string = "A tool to build configured operating system images"
	syntax_description:private string = "<command> [<args>]"
	syntax_help:private string = """<command> can be one of:
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
  <script command>          A command available to use in a configuration script"""
	help_message:private string = ""

	_args:unowned array of string

	construct( args:array of string, commands:CommandBuilderList )
		_args = args
		if not this.parse_options() do return
		this.parse_command()

		case command
			when Command.HELP, Command.NONE
				this.show_help()
			when Command.COMMAND_HELP
				print( commands.get_help( _args[2] ))
			when Command.LIST
				print( "Script Commands:\n" + commands.get_help () )
			when Command.UNKNOWN
				print( "Unknown command: %s", _args[1] )
				this.show_help()


	def private parse_options():bool
		var cli = new OptionContext( this.syntax_description )
		cli.set_summary( this.description + "\n\n" + this.syntax_help )
		cli.set_help_enabled( false )

		help_message:bool = false

		options:OptionEntry[5]
		options[0] = { "help", 'h', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[1] = { "?", '?', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[2] = { "boot", 0, 0, OptionArg.STRING, ref _boot_device, "Block device to install bootloader in to", "device" }
		options[3] = { "imagesize", 0, 0, OptionArg.STRING, ref _image_size, "File size for a new raw disk image, default is 2.0GiB", "gigabytes" }
		options[4] = { null }
		cli.add_main_entries( options, null )
		try
			cli.parse( ref _args )
		except error:OptionError
			print( "%s", error.message )
			print( "Use '%s --help' to see a full list of command line options", _args[ 0 ] )
			return false

		this.help_message = cli.get_help( true, null )

		if _args.length == 1
			help_message = true

		if help_message and _args.length < 3
			this.show_help ()
			return false

		return true


	def private parse_command()
		if _args.length == 1
			_command = Command.NONE
			return
		arg:string = _args[1].down()
		case arg
			when "install"
				_command = Command.INSTALL
				parse_install_command()
			when "help"
				if _args.length > 2
					_command = Command.COMMAND_HELP
				else
					_command = Command.HELP
			when "list"
				_command = Command.LIST
			when "mount"
				_command = Command.MOUNT
			default
				_command = Command.UNKNOWN
		return


	def private parse_install_command()
		if not ( _args.length > 2 )
			print """A base file parameter is needed.

Use '%s --help' to see command line syntax""", _args[ 0 ]
			_command = Command.ERROR
			return
		_base_file = _args[ 2 ]

		if not ( _args.length > 3 )
			print """A root path parameter is needed.

Use '%s --help' to see command line syntax""", _args[ 0 ]
			_command = Command.ERROR
			return
		_root_path = _args[ 3 ]

		if _args.length >= 4
			_script_path = _args[ 4 ]

	def show_help()
		print( this.help_message )

