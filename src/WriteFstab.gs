def write_fstab( config:Configuration.Config,
				filesystem:RootFilesystem
				):bool
	if config.device.root_uuid == ""
		message( "/etc/fstab not written because root filesystem UUID is blank" )
		return true
	try
		_template_resource:Bytes = resources_lookup_data( "/templates/boot/fstab.mustache", ResourceLookupFlags.NONE )
		_template:string = (string)_template_resource.get_data()
		var _hash = new dict of string, string
		_hash[ "boot_uuid" ] = config.device.boot_uuid
		_hash[ "root_uuid" ] = config.device.root_uuid
		_grub_config:string = GMustache.render( _template, _hash )
		var _file = File.new_for_path( filesystem.path_on_host + "/etc/fstab" )
		var _output = _file.create( FileCreateFlags.NONE )
		_bytes_written:size_t
		_output.write_all( _grub_config.data, out _bytes_written )
		message( "/etc/fstab written:\n%s", _grub_config )
	except
		message( "Creating or writing /etc/fstab file failed" )
		return false
	return true

