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

uses
	ConfigurationDeclarations
	Gee

exception ConfigurationCheckError
	FILE
	JSON
	DECLARATION

class Configuration

	configuration_path:private string = ""
	configuration:private ArrayList of ConfigurationDeclaration = new ArrayList of ConfigurationDeclaration()
	subjects:private ConfigurationSubjectList


	construct( configuration_path:string, subjects:ConfigurationSubjectList ) raises ConfigurationCheckError
		if configuration_path == "" do return
		this.configuration_path = configuration_path
		this.subjects = subjects
		this.load()


	def private load() raises ConfigurationCheckError
		var file = File.new_for_path( this.configuration_path )
		if not file.query_exists()
			raise new ConfigurationCheckError.FILE( "Configuration, %s, does not exist", this.configuration_path )
		original_cwd:string = Environment.get_current_dir()
		Environment.set_current_dir( Path.get_dirname( this.configuration_path ) )
		var temp_configuration = _load_configuration( Path.get_basename( this.configuration_path ) )
		configuration.add_all( temp_configuration )
		Environment.set_current_dir( original_cwd )
		message( "Configuration %s loaded", this.configuration_path )


	def private _load_configuration( configuration_path:string ):ArrayList of ConfigurationDeclaration raises ConfigurationCheckError
		declaration_builder:ConfigurationBuilder = (ConfigurationBuilder)this.subjects.get_builder( "configuration" )
		declaration:ConfigurationDeclarations.Configuration = (ConfigurationDeclarations.Configuration)declaration_builder.get_declaration(
											new Variant.string( configuration_path )
											)
		declaration.check()
		loaded:bool = declaration.apply()
		if !loaded
			message( "Failed to load configuration %s", configuration_path )
			return new ArrayList of ConfigurationDeclaration
		return _expand_configurations( declaration.get_parsed_configuration().get_elements() )


	def private _expand_configurations( elements:GLib.List of unowned Json.Node ):ArrayList of ConfigurationDeclaration raises ConfigurationCheckError
		var flattened_configuration = new ArrayList of ConfigurationDeclaration
		configuration_builder:ConfigurationBuilder = (ConfigurationBuilder)this.subjects.get_builder( "configuration" )
		for var element in elements
			if not (element.get_node_type() == Json.NodeType.OBJECT)
				message( "Element of configuration array is not an object" )
				return flattened_configuration
			object:Json.Object = element.get_object()
			if object.get_size() != 1
				message( "There should only be one member for each object in the configuration" )
				return flattened_configuration
			if object.has_member( configuration_builder.name )
				configuration_result:ArrayList of ConfigurationDeclaration = _load_configuration(
						object.get_string_member( configuration_builder.name )
						)
				flattened_configuration.add_all( configuration_result )
			else
				declaration_builder:ConfigurationDeclarationBuilder = this.subjects.get_builder( element.get_object().get_members().first().data )
				data:Json.Node = element.get_object().get_member( declaration_builder.name )
				try
					data_variant:Variant = Json.gvariant_deserialize( data, null )
					var declaration = declaration_builder.get_declaration ( data_variant )
					flattened_configuration.add( declaration )
				except
					pass
		return flattened_configuration


	def check():bool
		result:bool = true
		for declaration in configuration
			result = declaration.check()
			if not result
				message( "Declaration '%s' failed to validate data",
						declaration.get_type().name()
						)
				break
		return result


	def apply():bool
		result:bool = false
		for declaration in configuration
			result = declaration.apply()
			if not result
				message( "Declaration '%s' failed to apply", declaration.get_type().name() )
				break
		return result


	def print_configuration( configuration:Json.Node )
		print "about to create JSON generator"
		var test = new Json.Generator
		test.set_pretty( true )
		print "about to create root node"
		var root = new Json.Node( Json.NodeType.OBJECT )
		print "about to create configuration object"
		var configuration_object = new Json.Object
		print "about to set configuration member"
		configuration_object.set_member( "configuration", configuration )
		print "about to add configuration object to root node"
		root.set_object( configuration_object )
		print "about to set root"
		test.set_root( root )
		length:size_t
		print "about to print JSON"
		print test.to_data( out length )
