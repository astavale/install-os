def install_boot( package_list:array of string, package_manager:PackageManager ):bool
	result:bool = false
	message( "Installing boot..." )
	result = package_manager.install_packages( package_list )
	if result
		message( "...done. Boot install complete" )
	else
		message( "...failed. Install of boot failed" )
	return result
