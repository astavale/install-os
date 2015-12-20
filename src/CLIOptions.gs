namespace CLI_Options

	def parse( ref args:unowned array of string, 
				ref config:Configuration.Config
				):bool
		var cli = new OptionContext( "<base> [<script>]" )
		cli.set_summary( """Builds an operating system image
  <base>                   Filename of basic configuration file
  <script>                 Filename of an optional script to customize the image""" )
		var commands = new CommandList( config, new PackageManagers.NoPackageManager() )
		cli.set_description( "Script Commands:\n" + commands.get_help() )
		cli.set_help_enabled( false )

		help_message:bool = false
		root_device:string = ""
		filesize:string = ""
		boot_device:string = ""

		options:OptionEntry[6]
		options[0] = { "help", 'h', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[1] = { "?", '?', OptionFlags.HIDDEN, OptionArg.NONE, ref help_message, "help", null }
		options[2] = { "root", 0, 0, OptionArg.STRING, ref root_device, "Block device, disk image or directory to install OS in to", "filename" }
		options[3] = { "filesize", 0, 0, OptionArg.STRING, ref filesize, "Number of gigabytes for a disk image file", "gigabytes" }
		options[4] = { "boot", 0, 0, OptionArg.STRING, ref boot_device, "Block device to install bootloader in to", "device" }
		options[5] = { null }
		cli.add_main_entries( options, null )
		try
			cli.parse( ref args )
		except error:OptionError
			print "%s", error.message
			print "Use '%s --help' to see a full list of command line options", args[ 0 ]
			return false

		if help_message
			print cli.get_help( true, null )
			return false

		if root_device != ""
			config.root_path = root_device

		if boot_device != ""
			config.boot_device = boot_device

		if filesize != ""
			config.filesize = filesize

		return true
