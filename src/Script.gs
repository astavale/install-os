uses
	ScriptCommands
	Gee

namespace Script

	def load( commands:CommandBuilderList, ref config:Configuration.Config ):bool
		if config.script_path == "" do return true
		var file = File.new_for_path( config.script_path )
		if not file.query_exists()
			message( "Script, %s, does not exist", config.script_path )
			return false
		original_cwd:string = Environment.get_current_dir()
		Environment.set_current_dir( Path.get_dirname( config.script_path ) )
		var script = _load_script( commands, Path.get_basename( config.script_path ) )
		config.script.add_all( script )
		Environment.set_current_dir( original_cwd )
		message( "Script %s loaded", config.script_path )
		return true

	def _load_script( commands:CommandBuilderList,
						script_path:string
						):ArrayList of ScriptCommand
		command_builder:IncludeBuilder = (IncludeBuilder)commands.get_builder( "include" )
		command:Include = (Include)command_builder.get_command_with_data(
											new Variant.string( script_path )
											)
		command.validate()
		loaded:bool = command.run()
		if !loaded
			message( "Failed to load script %s", script_path )
			return new ArrayList of ScriptCommand
		return _expand_includes( commands,
								command.get_script().get_elements()
								)

	def _expand_includes( commands:CommandBuilderList,
							elements:GLib.List of Json.Node
							):ArrayList of ScriptCommand
		var script_without_includes = new ArrayList of ScriptCommand
		include_builder:IncludeBuilder = (IncludeBuilder)commands.get_builder( "include" )
		for var element in elements
			if not (element.get_node_type() == Json.NodeType.OBJECT)
				message( "Element of script array is not an object" )
				return script_without_includes
			object:Json.Object = element.get_object()
			if object.get_size() != 1
				message( "There should only be one member for each object in the script" )
				return script_without_includes
			if object.has_member( include_builder.name )
				include_result:ArrayList of ScriptCommand = _load_script( commands,
						object.get_string_member( include_builder.name )
						)
				script_without_includes.add_all( include_result )
			else
				command_builder:ScriptCommandBuilder = commands.get_builder( element.get_object().get_members().first().data )
				data:Json.Node = element.get_object().get_member( command_builder.name )
				try
					data_variant:Variant = Json.gvariant_deserialize( data, null )
					var command = command_builder.get_command_with_data ( data_variant )
					script_without_includes.add( command )
				except
					pass
		return script_without_includes

	def validate( ref config:Configuration.Config ):bool
		result:bool = true
		for command in config.script
			result = command.validate()
			if not result
				message( "Command '%s' failed to validate data",
						command.get_type().name()
						)
				break
		return result

	def run( ref config:Configuration.Config ):bool
		result:bool = false
		for command in config.script
			result = command.run()
			if not result
				message( "Command '%s' failed to run", command.get_type().name() )
				break
		return result

	def print_script( script:Json.Node )
		print "about to create JSON generator"
		var test = new Json.Generator
		test.set_pretty( true )
		print "about to create root node"
		var root = new Json.Node( Json.NodeType.OBJECT )
		print "about to create script object"
		var script_object = new Json.Object
		print "about to set script member"
		script_object.set_member( "script", script )
		print "about to add script object to root node"
		root.set_object( script_object )
		print "about to set root"
		test.set_root( root )
		length:size_t
		print "about to print JSON"
		print test.to_data( out length )

