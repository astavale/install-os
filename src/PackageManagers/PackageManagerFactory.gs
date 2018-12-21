namespace PackageManagers

	exception PackageManagerSetUpError
		FILE_ERROR

	def use_package_manager( config:Configuration.Config,
							filesystem:RootFilesystem,
							out package_manager:PackageManager
							):bool
		_outcome:bool = false
		package_manager = new NoPackageManager()
		try 
			case config.repository_format
				when "rpm"
					package_manager = new RPMPackageManager( filesystem,
														config.repository_distribution,
														config.target_version,
														config.target_architecture,
														config.repository_uri,
														config.repository_package,
														config.repository_key )
					_outcome = true
		except
			return false

		return _outcome

