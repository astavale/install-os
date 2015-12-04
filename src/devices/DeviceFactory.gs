namespace Devices

	exception DeviceSetUpError
		FILE_ERROR

	def use_device( config:Configuration.Config, ref device:Device ):bool
		if config.root_path == ""
			if not (device isa NoDevice)
				device = new NoDevice()
			return true

		// Test if root_path does not exist
		var _file = File.new_for_path( config.root_path )
		if not _file.query_exists()
			try
				device = new FileAsDevice( config )
				return true
			except error:DeviceSetUpError
				return false

		try
			_result:Posix.Stat
			if Posix.stat( config.root_path, out _result ) == -1
				message( "Unable to stat file " + config.root_path )
				raise new DeviceSetUpError.FILE_ERROR( "Unable to stat file under root path" )

			// Test if root_path is a directory
			if ( _result.st_mode & Posix.S_IFMT ) == Posix.S_IFDIR
				if not (device isa NoDevice)
					device = new NoDevice()
				return true

			// Test if root_path is a block device
			else if ( _result.st_mode & Posix.S_IFMT ) == Posix.S_IFBLK
				message( "Root device is a block device. Handling block devices not implemented." )
				return false

			// Test if root_path is a regular file
			else if ( _result.st_mode & Posix.S_IFMT ) == Posix.S_IFREG
				message( "Root already exists as a regular file. Stopping build." )
				return false

		except error:DeviceSetUpError
			pass
		
		return false

