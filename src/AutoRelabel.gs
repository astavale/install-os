def selinux_autorelabel( config:Configuration.Config,
				filesystem:Filesystem.Filesystem
				):bool
	try
		_template:string = ""
		var _file = File.new_for_path( filesystem.root_dir + "/.autorelabel" )
		var _output = _file.create( FileCreateFlags.NONE )
		_bytes_written:size_t
		_output.write_all( _template.data, out _bytes_written )
		message( "SELinux autorelabel written\n" )
	except
		message( "Writing SELinux autorelabel failed" )
		return false
	return true

