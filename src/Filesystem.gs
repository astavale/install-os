namespace Filesystem

	exception FilesystemSetUpError
		FILE_ERROR

	class Filesystem

		boot_dir:string = ""
		root_dir:string = ""
		other_dir:array of string = {""}

		_root_mount:string = ""
		_root_mounted:bool = false
		_status:int = 1
		_output:string = ""
		
		construct( config:Configuration.Config ) raises FilesystemSetUpError
			if not (config.device isa Devices.NoDevice)
				try
					_create_root_mount_point( )
					_mount_root( config.device )
				except error:FilesystemSetUpError
					raise error
			if config.device isa Devices.NoDevice
				if config.root_path != ""
					root_dir = config.root_path
				else
					root_dir = Environment.get_current_dir()
		
		def _create_root_mount_point( ) raises FilesystemSetUpError
			_mnt_dir:string = Environment.get_tmp_dir() + "/build_os_image-" + Checksum.compute_for_string( ChecksumType.MD5, Random.next_int().to_string() )
			message( "Creating mount point " + _mnt_dir + " for root filesystem" )
			_status = Posix.mkdir( _mnt_dir, 0700 )
			if _status == 0
				_root_mount = _mnt_dir
				message( "...done\n" )
			else
				message( "...failed\n" )
				raise new FilesystemSetUpError.FILE_ERROR( "Failed to create temporary mount point for root" )

		def _mount_root( device:Device ) raises FilesystemSetUpError
			message( "Mounting root filesystem" )
			_root_fs:string = ""
			try
				Process.spawn_command_line_sync( 
					"blkid -o value -s TYPE " + device.root_partition,
					out _output,
					null,
					out _status )
			except
				pass
			if _status == 0
				_root_fs = _output
			else
				message( "...failed\n" + _output )
				raise new FilesystemSetUpError.FILE_ERROR( "Unable to find type of filesystem on root partition" )
			_status = Linux.mount( device.root_partition, _root_mount, _root_fs )
			if _status == -1
				_root_mounted = true
				root_dir = _root_mount
				message( "...done\n" )
			else
				message( "...failed\n" )
				raise new FilesystemSetUpError.FILE_ERROR( "Failed to mount root" )
		
		def use_boot( )
			pass
		
		final
			if _root_mounted
				_status = Linux.umount( _root_mount )
				if _status == -1
					message( "Root unmounted from %s", _root_mount )
				else
					message( "Failed to unmount root from %s", _root_mount )
			if _root_mount != ""
				FileUtils.remove( _root_mount )
				message( "Mount point %s removed", _root_mount )

