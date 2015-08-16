namespace BootLoaders

	def use_boot_loader( filesystem:Filesystem.Filesystem, 
						config:Configuration.Config,
						package_manager:PackageManager,
						ref boot_loader:BootLoader
						):bool
		result:bool = false
		message( "Installing boot packages..." )
		result = package_manager.install_packages( config.boot_packages )
		if result
			message( "...done. Boot packages installed" )
		else
			message( "...failed. Install of boot packages failed" )
		return result
