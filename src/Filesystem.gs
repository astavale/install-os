namespace Filesystem

	exception FilesystemSetUpError
		FILE_ERROR

	class Filesystem

		boot_dir:string = ""
		root_dir:string = ""
		other_dir:array of string = {""}
		_root_mount:string = ""
		_root_mounted:bool = false
		
		construct( config:Configuration.Config ) raises FilesystemSetUpError
			if not (config.device isa Devices.NoDevice)
				try
					_create_root_mount_point( )
				except error:FilesystemSetUpError
					raise error
		
		def _create_root_mount_point( ) raises FilesystemSetUpError
			_mnt_dir:string = Environment.get_tmp_dir() + "/build_os_image-" + Checksum.compute_for_string( ChecksumType.MD5, Random.next_int().to_string() )
			message( "Creating mount point " + _mnt_dir + " for root filesystem" )
			_result:int = Posix.mkdir( _mnt_dir, 0700 )
			if _result == 0
				_root_mount = _mnt_dir
				message( "...done\n" )
			else
				message( "...failed\n" )
				raise new FilesystemSetUpError.FILE_ERROR( "Failed to create temporary mount point for root" )
			
		
		def use_boot( )
			pass
		
		final
			if _root_mounted
				print "unmounted root from %s", _root_mount
			if _root_mount != ""
				FileUtils.remove( _root_mount )
				message( "Mount point %s removed", _root_mount )
