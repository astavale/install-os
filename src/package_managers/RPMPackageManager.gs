namespace PackageManagers

	class RPMPackageManager:Object implements PackageManager
		

		construct( filesystem:Filesystem.Filesystem, 
					distribution:string, 
					version:string, 
					architecture:string 
					) raises PackageManagerSetUpError
			try
				_check_root_empty( filesystem.root_dir )
				_create_db( filesystem.root_dir )
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
		
		def _create_db( root_dir:string ) raises PackageManagerSetUpError
			_status:int = 1
			_output:string = ""
			try
				Process.spawn_command_line_sync( 
					"rpm --root " + root_dir + " -qa",
					out _output,
					null,
					out _status )
			except
				pass
			if _status == 0
				message( "RPM database for root " + root_dir + " created" + _output )
			else
				message( "Unable to create RPM database for root " + root_dir + "\n" + _output )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to create RPM database" )

		def install_packages( package_list:array of string ):bool
			return true

