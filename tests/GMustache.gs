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

uses GMustache

namespace UnitTests.GMustache

	def run( args:array of string? ):void
		Test.init( ref args )
		register()
		Test.run()
		Posix._exit( 0 )

	def register()
		Test.add_func( "/GMustache/Simple", simple_test  )
		Test.add_func( "/GMustache/Multiline", multiline_test  )

	def simple_test()
		template:string = "this is a {{& variable }}"
		var hash = new dict of string,string
		hash[ "variable" ] = "test"
		result:string = render( template, hash )
		assert( result == "this is a test" )

	def multiline_test()
		template:string = """line {{& a }}
	line {{& b }}
	{{&variable }} {{&c}}"""
		var hash = new dict of string,string
		hash[ "a" ] = "one"
		hash[ "b" ] = "two"
		hash[ "c" ] = "three"
		hash[ "variable" ] = "line"
		result:string = render( template, hash )
		assert( result == """line one
	line two
	line three""" )
