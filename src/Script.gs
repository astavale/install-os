uses
	ConfigurationScriptCommands

namespace Script

	def find_if_given( args:array of string, ref config:Configuration.Config ):bool
		if args.length < 3
			return true
		var file = File.new_for_path( args[2] )
		if not file.query_exists()
			message( "Script, %s, does not exist", args[2] )
			return false
		config.script_path = args[2]
		return true

	def load( commands:CommandList, ref config:Configuration.Config ):bool
		original_cwd:string = Environment.get_current_dir()
		Environment.set_current_dir( Path.get_dirname( config.script_path ) )
		var script = new Json.Array
		command:Include = (Include)commands.get_command( "include" )
		script = _load_script( command, Path.get_basename( config.script_path ) )
		config.script.set_array( script )
		Environment.set_current_dir( original_cwd )
		message( "Script %s loaded", config.script_path )
		return true

	def _load_script( command:Include, script_path:string ):Json.Array
		var script = new Json.Array
		if not command.load_script( script_path, ref script )
			message( "Failed to load script %s", script_path )
			script.add_null_element()
			return script
		var result = new Json.Array
		elements:List of Json.Node = script.get_elements()
		for var element in elements
			if not (element.get_node_type() == Json.NodeType.OBJECT)
				message( "Element of script array in %s is not an object", script_path )
				result.add_null_element()
				return result
			object:Json.Object = element.get_object()
			if object.get_size() != 1
				message( "There should only be one member for each object in the script %s", script_path )
				result.add_null_element()
				return result
			if object.has_member( command.name )
				include_result:Json.Array = _load_script( command, object.get_string_member( command.name ) )
				for var item in include_result.get_elements()
					result.add_element( item )
			else
				result.add_element( element )
		return result

	def validate( commands:CommandList, ref config:Configuration.Config ):bool
		result:bool = false
		for element:Json.Node in config.script.get_array().get_elements()
			command:string = element.get_object().get_members().first().data
			if command in commands
				action:ScriptCommand = commands.get_command( command )
				data:Json.Node = element.get_object().get_member( command )
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

