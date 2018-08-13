namespace PackageManagers

	class RPMPackageManager:Object implements PackageManager

		_filesystem:RootFilesystem
		_distribution:string = ""
		_version:string = ""
		_architecture:string = ""
		_status:int = 1
		_output:string = ""
		_error:string = ""

		construct( filesystem:RootFilesystem,
					distribution:string,
					version:string,
					architecture:string
					) raises PackageManagerSetUpError
			try
				_create_db( filesystem.root_dir )
			except error:PackageManagerSetUpError
				raise error
			_filesystem = filesystem
			_distribution = distribution
			_version = version
			_architecture = architecture

		def _create_db( root_dir:string ) raises PackageManagerSetUpError
			try
				Process.spawn_command_line_sync(
					"rpm --root " + root_dir + " -qa",
					out _output,
					null,
					out _status )
			except
				pass
			if _status == 0
				message( "RPM database for root " + root_dir + " available" + _output )
			else
				message( "Unable to use RPM database for root " + root_dir + "\n" + _output )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to use RPM database" )

		def install_packages( package_list:array of string ):bool
			_package_list:string = ""
			try
				for var package in package_list
					_package_list += package + " "
				message( "Installing RPM packages: " + _package_list )
				Process.spawn_command_line_sync( 
					"yum install --assumeyes --installroot " + _filesystem.root_dir + " --releasever " + _version + " " + _package_list,
					out _output,
					out _error,
					out _status )
			except
				pass
			if _status == 0
				message( "...done. RPM packages " + _package_list + " installed\n" + _output + _error )
			else
				message( "Unable to install packages: " + _package_list + "\n" + _error )
				return false
			return true

