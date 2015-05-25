def install_kernel( package_list:array of string, package_manager:PackageManager ):bool
	result:bool = false
	message( "Installing kernel..." )
	result = package_manager.install_packages( package_list )
	if result
		message( "...done. Kernel install complete" )
	else
		message( "...failed. Install of kernel failed" )
	return result
