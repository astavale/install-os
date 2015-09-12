def test_main( args:array of string? ):void
	Test.init( ref args )
	Test.add_func( "/GMustache/Simple", simple_test  )
	Test.add_func( "/GMustache/Multiline", multiline_test  )
	Test.run()
	Posix._exit( 0 )

def simple_test()
	template:string = "this is a {{& variable }}"
	var hash = new dict of string,string
	hash[ "variable" ] = "test"
	result:string = GMustache.render( template, hash )
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
	result:string = GMustache.render( template, hash )
	assert( result == """line one
line two
line three""" )
