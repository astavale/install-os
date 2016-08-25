namespace ScriptCommands

	class Include:Object implements ScriptCommand

		prop readonly name:string = "include"
		prop readonly short_description:string = "Reads another script"
		prop readonly long_description:string = ""

		def validate( filename:Variant ):bool
			result:bool = false
			if filename.is_of_type( VariantType.STRING )
				result = true
			return result

		def run( filename:Variant ):bool
			message( "'include' command is the exception, use 'load_script' method instead of 'run'" )
			return true

		def load_script( filename:Variant, ref script:Json.Array ):bool
			if not filename.is_of_type( VariantType.STRING )
				return false
			var parser = new Json.Parser
			try 
				parser.load_from_file( filename.get_string() )
			except error:Error
				message( "Unable to load JSON file %s: %s", filename.get_string(), error.message )
				return false
			var root = parser.get_root()
			if root == null
				message( "No root node for %s", filename.get_string() )
				return false
			if not ( root.get_node_type() == Json.NodeType.OBJECT )
				message( "Root node is not an object in %s", filename.get_string() )
				return false
			var root_object = root.get_object()
			if not root_object.has_member( "script" )
				message( "Root node does not contain a \"script\" in %s", filename.get_string() )
				return false
			var script_array = root_object.get_member( "script" )
			if not (script_array.get_node_type() == Json.NodeType.ARRAY)
				message( "\"script\" in %s does not contain an array", filename.get_string() )
				return false
			script = script_array.get_array().ref()
			return true
