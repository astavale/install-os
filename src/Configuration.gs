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

class Script

	script_path:private string = ""
	script:private ArrayList of ConfigurationDeclaration = new ArrayList of ConfigurationDeclaration()
	commands:private CommandBuilderList


	construct( script_path:string, commands:CommandBuilderList )
		if script_path == "" do return
		this.script_path = script_path
		this.commands = commands
		this.load()


	def private load():bool
		var file = File.new_for_path( this.script_path )
		if not file.query_exists()
			message( "Script, %s, does not exist", this.script_path )
			return false
		original_cwd:string = Environment.get_current_dir()
		Environment.set_current_dir( Path.get_dirname( this.script_path ) )
		var temp_script = _load_script( Path.get_basename( this.script_path ) )
		script.add_all( temp_script )
		Environment.set_current_dir( original_cwd )
		message( "Script %s loaded", this.script_path )
		return true


	def private _load_script( script_path:string ):ArrayList of ConfigurationDeclaration
		command_builder:IncludeBuilder = (IncludeBuilder)this.commands.get_builder( "include" )
		declaration:Include = (Include)command_builder.get_declaration(
											new Variant.string( script_path )
											)
		declaration.check()
		loaded:bool = declaration.apply()
		if !loaded
			message( "Failed to load script %s", script_path )
			return new ArrayList of ConfigurationDeclaration
		return _expand_includes( declaration.get_script().get_elements() )


	def private _expand_includes( elements:GLib.List of unowned Json.Node ):ArrayList of ConfigurationDeclaration
		var script_without_includes = new ArrayList of ConfigurationDeclaration
		include_builder:IncludeBuilder = (IncludeBuilder)this.commands.get_builder( "include" )
		for var element in elements
			if not (element.get_node_type() == Json.NodeType.OBJECT)
				message( "Element of script array is not an object" )
				return script_without_includes
			object:Json.Object = element.get_object()
			if object.get_size() != 1
				message( "There should only be one member for each object in the script" )
				return script_without_includes
			if object.has_member( include_builder.name )
				include_result:ArrayList of ConfigurationDeclaration = _load_script(
						object.get_string_member( include_builder.name )
						)
				script_without_includes.add_all( include_result )
			else
				command_builder:ConfigurationDeclarationBuilder = this.commands.get_builder( element.get_object().get_members().first().data )
				data:Json.Node = element.get_object().get_member( command_builder.name )
				try
					data_variant:Variant = Json.gvariant_deserialize( data, null )
					var declaration = command_builder.get_declaration ( data_variant )
					script_without_includes.add( declaration )
				except
					pass
		return script_without_includes


	def check():bool
		result:bool = true
		for declaration in script
			result = declaration.check()
			if not result
				message( "Declaration '%s' failed to validate data",
						declaration.get_type().name()
						)
				break
		return result


	def apply():bool
		result:bool = false
		for declaration in script
			result = declaration.apply()
			if not result
				message( "Declaration '%s' failed to apply", declaration.get_type().name() )
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
