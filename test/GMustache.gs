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
