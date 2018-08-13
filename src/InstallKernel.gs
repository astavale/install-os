def install_kernel( package_list:array of string,
					package_manager:PackageManager,
					config:Configuration.Config,
					filesystem:RootFilesystem
					):bool
	result:bool = false
	message( "Installing kernel..." )
	result = package_manager.install_packages( package_list )
	if result
		message( "...done. Kernel install complete" )
	else
		message( "...failed. Install of kernel failed" )

	_boot:Dir
	try
		_boot = Dir.open( filesystem.path_on_host + "/boot" )
	except error:FileError
		message( "Unable to read boot directory. \"" + error.message + "\"" )
		return false
	entry:string? = _boot.read_name()
	match:MatchInfo
	while entry != null
		if (/^vmlinuz.*x86_64$/.match( entry, 0, out match ))
			config.boot_kernel_named = "/boot/" + match.fetch( 0 )
		if (/^initramfs-0.*\.img$/.match( entry, 0, out match ))
			config.boot_initrd_named = "/boot/" + match.fetch( 0 )
		entry = _boot.read_name()
	return result

