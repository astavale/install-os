namespace BaseFile

	def parse( ref config:Configuration.Config ):bool

		var keyfile = new KeyFile()
		try
			message( "Base file: %s", config.base_file )
			keyfile.load_from_file( config.base_file, KeyFileFlags.NONE )

			if keyfile.has_group( "Repository" )
				if keyfile.has_key( "Repository", "format" )
					config.repository_format = keyfile.get_string( "Repository", "format" )
				if keyfile.has_key( "Repository", "distribution" )
					config.repository_distribution = keyfile.get_string( "Repository", "distribution" )
				if keyfile.has_key( "Repository", "uri" )
					config.repository_uri = keyfile.get_string( "Repository", "uri" )
				if keyfile.has_key( "Repository", "package" )
					config.repository_package = keyfile.get_string( "Repository", "package" )
				if keyfile.has_key( "Repository", "key" )
					config.repository_key = keyfile.get_string( "Repository", "key" )
			if keyfile.has_group( "Target" )
				if keyfile.has_key( "Target", "version" )
					config.target_version = keyfile.get_string( "Target", "version" )
				if keyfile.has_key( "Target", "architecture" )
					config.target_architecture = keyfile.get_string( "Target", "architecture" )
			if keyfile.has_group( "Root" )
				if keyfile.has_key( "Root", "packages" )
					config.root_packages = keyfile.get_string_list( "Root", "packages" )
			if keyfile.has_group( "Boot" )
				if keyfile.has_key( "Boot", "packages" )
					config.boot_packages = keyfile.get_string_list( "Boot", "packages" )
				if keyfile.has_key( "Boot", "loader" )
					config.boot_loader = keyfile.get_string( "Boot", "loader" )
		except
			return false

		return true
