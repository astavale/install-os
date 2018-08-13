namespace BootLoaders

	def use_boot_loader( config:Configuration.Config,
						filesystem:RootFilesystem,
						package_manager:PackageManager,
						ref boot_loader:BootLoader
						):bool
		_outcome:bool = false
		message( "Installing boot packages..." )
		_outcome = package_manager.install_packages( config.boot_packages )
		if _outcome
			message( "...done. Boot packages installed" )
		else
			message( "...failed. Install of boot packages failed" )
			return false
		try 
			case config.boot_loader
				when "grub2-bios"
					boot_loader = new GRUBBIOS( config, filesystem )
					_outcome = true
				when "grub2-uefi"
					boot_loader = new GRUBUEFI()
					_outcome = true
		except
			return false

		return _outcome

