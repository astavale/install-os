namespace ScriptCommands

	class IncludeBuilder:Object implements ScriptCommandBuilder
		prop readonly name:string = "include"
		prop readonly short_description:string = "Reads another script"
		prop readonly long_description:string = """"include" - include an additional configuration script

The additional script's filename is relative to the main script's file path.
The include command allows scripts to be split and re-used.

An example:
{ "script" : [
  { "include" : "server/monitoring.json" }
]}"""

		construct()
			pass

		def get_command_with_data( data:Variant ):ScriptCommand
			return new Include( data )

	class Include:Object implements ScriptCommand

		_data:Variant
		_filename:string = ""
		_script:Json.Array = new Json.Array()

		construct( data:Variant )
			_data = data

		def validate():bool
			result:bool = false
			if _data.is_of_type( VariantType.STRING )
				_filename = _data.get_string()
				result = true
			if result == false
				message( "Include command failed to validate" )
			return result

		def run():bool
			if not validate()
				return false
			var parser = new Json.Parser
			try 
				parser.load_from_file( _filename )
			except error:Error
				message( "Unable to load JSON file %s: %s", _filename, error.message )
				return false
			var root = parser.get_root()
			if root == null
				message( "No root node for %s", _filename )
				return false
			if not ( root.get_node_type() == Json.NodeType.OBJECT )
				message( "Root node is not an object in %s", _filename )
				return false
			var root_object = root.get_object()
			if not root_object.has_member( "script" )
				message( "Root node does not contain a \"script\" in %s", _filename )
				return false
			var script_array = root_object.get_member( "script" )
			if not (script_array.get_node_type() == Json.NodeType.ARRAY)
				message( "\"script\" in %s does not contain an array", _filename )
				return false
			_script = script_array.get_array().ref()
			return true

		def get_script():Json.Array
			return _script
