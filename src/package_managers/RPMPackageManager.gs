namespace PackageManagers

	class RPMPackageManager:Object implements PackageManager
		
		construct( filesystem:Filesystem.Filesystem, 
					distribution:string, 
					version:string, 
					architecture:string 
					) raises PackageManagerSetUpError
			try
				_check_root_empty( filesystem.root_dir )
			except error:PackageManagerSetUpError
				raise error
		
		def _check_root_empty( root_dir:string ) raises PackageManagerSetUpError
			_root:Dir
			try
				_root = Dir.open( root_dir )
			except error:FileError
				message( "Unable to open root directory. \"" + error.message + "\"" )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to open root directory" )
			entry:string? = _root.read_name()
			if entry != null
				message( "Root directory, %s, not empty. Stopping install.", root_dir )
				raise new PackageManagerSetUpError.FILE_ERROR( "Root directory not empty" )
		
		def install_packages( package_list:array of string ):bool
			return true
