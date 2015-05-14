def install_root( package_list:array of string, package_manager:PackageManager ):bool
	return package_manager.install_packages( package_list )

