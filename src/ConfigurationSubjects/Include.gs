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

namespace ConfigurationDeclarations

	class ConfigurationBuilder:Object implements ConfigurationDeclarationBuilder
		prop readonly name:string = "configuration"
		prop readonly title:string = "Reads another script"
		prop readonly description:string = """"configuration" - include an additional configuration file

The additional configuration's filename is relative to the main configuration's file path.
The configuration declaration allows configurations to be split and re-used.

An example:
{ "configuration" : [
  { "configuration" : "server/monitoring.json" }
]}"""

		construct()
			pass

		def get_declaration( data:Variant ):ConfigurationDeclaration
			return new Configuration( data )

	class Configuration:Object implements ConfigurationDeclaration

		_data:Variant
		_filename:string = ""
		_configuration:Json.Array = new Json.Array()

		construct( data:Variant )
			_data = data


		def check():bool
			result:bool = false
			if _data.is_of_type( VariantType.STRING )
				_filename = _data.get_string()
				result = true
			if result == false
				message( "Include command failed to validate" )
			return result


		def apply():bool
			if not check()
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
			if not root_object.has_member( "configuration" )
				message( "Root node does not contain a \"configuration\" in %s", _filename )
				return false
			var configuration_array = root_object.get_member( "configuration" )
			if not (configuration_array.get_node_type() == Json.NodeType.ARRAY)
				message( "\"configuration\" in %s does not contain an array", _filename )
				return false
			_configuration = configuration_array.get_array().ref()
			return true


		def get_parsed_configuration():Json.Array
			return _configuration
