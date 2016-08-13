namespace UnitTests.SetShadowPassword

	def run(args:array of string?)
		Test.init(ref args)
		var suite = new TestSuite( "ShadowFileShould" )
		TestSuite.get_root ().add_suite (suite)
		fixture:AugeasShadowFixture = new AugeasShadowFixture()
		suite.add( new TestCase( "HaveRootUserPasswordSet",
								fixture.set_up,
								(TestFixtureFunc)test_set_root_password,
								fixture.tear_down )
								)
		suite.add( new TestCase( "HaveRootUserPasswordSetWhenNoSaltArgumentIsGiven",
								fixture.set_up,
								(TestFixtureFunc)test_set_root_password_without_salt_argument,
								fixture.tear_down )
								)
		Test.run()
		Posix._exit( 0 )

	def test_set_root_password( fixture:AugeasShadowFixture )
		file:string = fixture.tmp_file
		user:string = "root"
		password:string = "test"
		salt:string = "$6$9TU1MV9JMWTtKlnI"

		set_password_in_shadow_formatted_file( file, user, password, salt )

		try
			var expected = new Regex( """^root:""" + Regex.escape_string( Posix.crypt( password, salt )) + """:0:0:99999:7:::(\s)*""" )
			result:bool = expected.match( fixture.get_contents() )
			if (not result)
				Test.fail()
				Test.message( "Test match failed\n#Pattern: %s\n#Did not match: %s", expected.get_pattern(), fixture.get_contents() )
		except error:Error
			print error.message

	def test_set_root_password_without_salt_argument( fixture:AugeasShadowFixture )
		file:string = fixture.tmp_file
		user:string = "root"
		password:string = "test"
		salt:string = ""
		contents:string = ""
		
		set_password_in_shadow_formatted_file( file, user, password )

		contents = fixture.get_contents()
		try
			extract_salt:Regex = new Regex( "^" + user + """:(?<salt>\$6\$[a-zA-Z0-9\.\/]*)\$""" )
			found:MatchInfo?
			if extract_salt.match( contents, 0, out found )
				salt = found.fetch_named( "salt" )
			else
				assert_not_reached()
			var expected = new Regex( "^" + user + ":" + Regex.escape_string( Posix.crypt( password, salt )) + """:0:0:99999:7:::(\s)*""" )
			result:bool = expected.match( fixture.get_contents() )
			if (not result)
				Test.fail()
				Test.message( "Test match failed\n#Pattern: %s\n#Did not match: %s", expected.get_pattern(), fixture.get_contents() )
		except error:Error
			print error.message

	class AugeasShadowFixture
		tmp_file:string = ""
	
		_file:File
		_iostream:FileIOStream

		def set_up()
			try
				_file = File.new_tmp ("install_os_test-shadow-XXXXXX", out _iostream)
				tmp_file = _file.get_path ()
				ostream:OutputStream = _iostream.output_stream
				dostream:DataOutputStream = new DataOutputStream (ostream)
				dostream.put_string ("root:*:0:0:99999:7:::")
			except error:Error
				print error.message

		def tear_down()
			try
				_file.delete()
			except error:Error
				print error.message

		def get_contents():string
			var contents = new array of uint8[256]
			length:size_t = 0
			try
				_iostream = _file.open_readwrite()
				_iostream.input_stream.read_all( contents, out length )
			except error:IOError
				print "Failed to read fixture file contents: %s", error.message
			except error:Error
				print "Failed to read fixture file contents: %s", error.message
			return (string)contents

