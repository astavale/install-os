/*
 *   install-os - a tool to build configured raw disk images
 *
 *   Copyright (C) 2018  Alistair Thomas <opensource @ astavale.co.uk>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

class CommandLineInterface
	enum Command
		NONE
		ERROR
		UNKNOWN
		HELP_ON_COMMAND_LINE_INTERFACE
		INSTALL
		HELP_ON_CONFIGURATION_SUBJECT
		LIST_CONFIGURATION_SUBJECTS
		MOUNT_RAW_IMAGE

	prop readonly command:Command = Command.NONE
	prop readonly base_file:string = ""
	prop readonly root_path:string = ""
	prop readonly configuration_paths:List of string = new List of string()
	prop readonly boot_device:string = ""
	prop readonly image_size:string = ""

	description:private string = "A tool to build configured operating system images"
	syntax_description:private string = "<command> [<args>]"
	syntax_help:private string = """<command> can be one of:
  install <base> <root> [<configs>] Use parameters from <base> file and install to <root>
  help                              Show this message
  list                              Show a list of configuration subjects
  help <subject>                    Show help on a configuration subject
  mount <root> [<mount point>]      Mount raw disk image at /tmp or <mount point>
                                    The image will be unmounted when SIGTERM is received

<command> arguments:
  <base>                    Filename of basic parameters file
  <configs>                 Filename(s) of configuration(s) to customize the image
  <mount point>             Directory or filename to mount disk image at
  <root>                    A block device, disk image or directory to install to
  <subject>                 A subject used in a declarative JSON configuration file"""
	help_message:private string = ""

	_args:unowned array of string

	construct( args:array of string, commands:ConfigurationSubjectList )
		_args = args
		if not this.parse_options() do return
		this.parse_command()

		case command
			when Command.HELP_ON_COMMAND_LINE_INTERFACE, Command.NONE
				this.show_help()
			when Command.HELP_ON_CONFIGURATION_SUBJECT
				print( commands.get_help( _args[2] ))
			when Command.LIST_CONFIGURATION_SUBJECTS
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
					_command = Command.HELP_ON_CONFIGURATION_SUBJECT
				else
					_command = Command.HELP_ON_COMMAND_LINE_INTERFACE
			when "list"
				_command = Command.LIST_CONFIGURATION_SUBJECTS
			when "mount"
				_command = Command.MOUNT_RAW_IMAGE
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

		position:int = 4
		while position < _args.length
			_configuration_paths.append( _args[ position ] )
			position++


	def show_help()
		print( this.help_message )
