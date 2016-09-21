uses
	ScriptCommands

namespace Script

	def find_from_cli_argument( args:array of string,
								ref config:Configuration.Config
								):bool
		if args.length < 3
			return true
		var file = File.new_for_path( args[2] )
		if not file.query_exists()
			message( "Script, %s, does not exist", args[2] )
			return false
		config.script_path = args[2]
		return true

	def load( commands:CommandBuilderList, ref config:Configuration.Config ):bool
		if config.script_path == "" do return true
		original_cwd:string = Environment.get_current_dir()
		Environment.set_current_dir( Path.get_dirname( config.script_path ) )
		var script = new Json.Array
		command:IncludeBuilder = (IncludeBuilder)commands.get_builder( "include" )
		script = _load_script( command, Path.get_basename( config.script_path ) )
		config.script.set_array( script )
		Environment.set_current_dir( original_cwd )
		message( "Script %s loaded", config.script_path )
		return true

	def _load_script( command_builder:IncludeBuilder, script_path:string ):Json.Array
		command:Include = (Include)command_builder.get_command_with_data( script_path )
		command.validate()
		failed_to_load:bool = command.run()
		if failed_to_load
			message( "Failed to load script %s", script_path )
			var empty_script = new Json.Array
			empty_script.add_null_element()
			return empty_script
		return _expand_includes( command_builder,
								command.get_script().get_elements()
								)

	def _expand_includes( command_builder:IncludeBuilder,
							elements:List of Json.Node
							):Json.Array
		var script_without_includes = new Json.Array
		for var element in elements
			if not (element.get_node_type() == Json.NodeType.OBJECT)
				message( "Element of script array is not an object" )
				script_without_includes.add_null_element()
				return script_without_includes
			object:Json.Object = element.get_object()
			if object.get_size() != 1
				message( "There should only be one member for each object in the script" )
				script_without_includes.add_null_element()
				return script_without_includes
			if object.has_member( command_builder.name )
				include_result:Json.Array = _load_script( command_builder, object.get_string_member( command_builder.name ) )
				for var item in include_result.get_elements()
					script_without_includes.add_element( item )
			else
				script_without_includes.add_element( element )
		return script_without_includes

	def validate( commands:CommandBuilderList, ref config:Configuration.Config ):bool
		result:bool = true
		for element:Json.Node in config.script.get_array().get_elements()
			command:string = element.get_object().get_members().first().data
			if command in commands
				data:Json.Node = element.get_object().get_member( command )
				action:ScriptCommand = commands.get_builder( command ).get_command_with_data( data )
				try
					data_variant:Variant = Json.gvariant_deserialize( data, null )
					result = action.validate( data_variant )
				except
					pass
				if not result
					message( "Command '%s' failed to validate data", command )
					break
			else
				message( "Command '%s' not found", command )
				result = false
				break
		return result

	def run( commands:CommandBuilderList, ref config:Configuration.Config ):bool
		result:bool = false
		for element:Json.Node in config.script.get_array().get_elements()
			command:string = element.get_object().get_members().first().data
			action:ScriptCommandBuilder = commands.get_builder( command )
			data:Json.Node = element.get_object().get_member( command )
			try
				data_variant:Variant = Json.gvariant_deserialize( data, null )
				result = action.run( data_variant )
			except
				pass
			if not result
				message( "Command '%s' failed to run", command )
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

