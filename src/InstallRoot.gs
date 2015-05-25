def install_root( package_list:array of string, package_manager:PackageManager ):bool
	result:bool = false
	message( "Installing root filesystem..." )
	result = package_manager.install_packages( package_list )
	if result
		message( "...done. Root filesystem install complete" )
	else
		message( "...failed. Install of root filesystem failed" )
	return result

