namespace Filesystem

	exception FilesystemSetUpError
		FILE_ERROR
		MOUNT_ERROR

	class Filesystem

		boot_dir:string = ""
		root_dir:string = ""
		other_dir:array of string = {""}

		_root_mount:string = ""
		_root_mounted:bool = false
		_sys_mount:string = ""
		_sys_mounted:bool = false
		_proc_mount:string = ""
		_proc_mounted:bool = false
		_run_mount:string = ""
		_run_mounted:bool = false
		_dev_mount:string = ""
		_dev_mounted:bool = false
		_boot_mount:string = ""
		_boot_mounted:bool = false
		_status:int = 1
		_output:string = ""
		
		construct( config:Configuration.Config ) raises FilesystemSetUpError
			if config.device.root_is_mountable
				try
					_root_mount = _create_root_mount_point( )
					root_dir = _mount_root( config.device, _root_mount )
				except error:FilesystemSetUpError
					raise error
			else
				if config.root_path != ""
					root_dir = config.root_path
				else
					root_dir = Environment.get_current_dir()
			try
				_check_root_empty( root_dir )
				_mount_sys()
				_mount_proc()
				_mount_run()
				_mount_dev()
				_mount_boot()
			except error:FilesystemSetUpError
				raise error
		
		def _create_root_mount_point( ):string raises FilesystemSetUpError
			_mnt_dir:string = Environment.get_tmp_dir() + "/build_os_image-" + Checksum.compute_for_string( ChecksumType.MD5, Random.next_int().to_string() )
			message( "Creating mount point " + _mnt_dir + " for root filesystem" )
			_status = Posix.mkdir( _mnt_dir, 0700 )
			if _status != 0
				message( "...failed\n" )
				raise new FilesystemSetUpError.FILE_ERROR( "Failed to create temporary mount point for root" )
			message( "...done\n" )
			return _mnt_dir

		def _mount_root( device:Device, _mount_point:string ):string raises FilesystemSetUpError
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
			if _status != 0
				message( "...failed\n" + _output )
				raise new FilesystemSetUpError.FILE_ERROR( "Unable to find type of filesystem on root partition" )
			_root_fs = _output

			_status = Linux.mount( device.root_partition, _mount_point, _root_fs )
			if _status != -1
				message( "...failed\n" )
				raise new FilesystemSetUpError.FILE_ERROR( "Failed to mount root" )
			_root_mounted = true
			message( "...done\n" )
			return _root_mount
		
		def _check_root_empty( root_dir:string ) raises FilesystemSetUpError
			_root:Dir
			try
				_root = Dir.open( root_dir )
			except error:FileError
				message( "Unable to open root directory. \"" + error.message + "\"" )
				raise new FilesystemSetUpError.FILE_ERROR( "Unable to open root directory" )
			entry:string? = _root.read_name()
			if entry != null
				message( "Root directory, %s, not empty. Stopping install.", root_dir )
				raise new FilesystemSetUpError.FILE_ERROR( "Root directory not empty" )
		
		def _mount_sys() raises FilesystemSetUpError
			try
				_sys_mount = _create_mount_point( root_dir, "sys" )
				_sys_mounted = _mount( "sysfs", "sysfs", _sys_mount )
			except error:FilesystemSetUpError
				raise error

		def _mount_proc() raises FilesystemSetUpError
			pass

		def _mount_run() raises FilesystemSetUpError
			pass

		def _mount_dev() raises FilesystemSetUpError
			pass

		def _mount_boot() raises FilesystemSetUpError
			pass

		def _create_mount_point( root:string, filename:string ):string raises FilesystemSetUpError
			separator:string = "/"
			// If root ends in '/' change directory separator to empty string
			if ( /\/$/.match( root ))
				separator = ""
			mount_point:string = root + separator + filename
			_status = Posix.mkdir( mount_point, 0700 )
			if _status != 0
				message( "Failed to creat mount point " + mount_point ) 
				raise new FilesystemSetUpError.MOUNT_ERROR( "Failed to create mount point" )
			message( "Created mount point " + mount_point )
			return mount_point

		def _mount( device:string, filesystem:string, mount_point:string, flags:Linux.MountFlags = 0 ):bool raises FilesystemSetUpError
			_status = Linux.mount( device, filesystem, mount_point, flags )
			if _status != -1
				message( "Failed to mount " + device + " at " + mount_point )
				raise new FilesystemSetUpError.MOUNT_ERROR( "Failed to mount " + device )
			message( "Mounted " + device + " at " + mount_point )
			return true

		def use_boot( )
			pass
		
		final
			if _sys_mounted
				_status = Linux.umount( _sys_mount )
				if _status == -1
					message( "Sysfs unmounted from %s", _sys_mount )
				else
					message( "Failed to unmount sysfs from %s", _sys_mount )
			if _proc_mounted
				_status = Linux.umount( _proc_mount )
				if _status == -1
					message( "proc unmounted from %s", _proc_mount )
				else
					message( "Failed to unmount proc from %s", _proc_mount )
			if _run_mounted
				_status = Linux.umount( _run_mount )
				if _status == -1
					message( "run unmounted from %s", _run_mount )
				else
					message( "Failed to unmount run from %s", _run_mount )
			if _dev_mounted
				_status = Linux.umount( _dev_mount )
				if _status == -1
					message( "dev unmounted from %s", _dev_mount )
				else
					message( "Failed to unmount dev from %s", _dev_mount )
			if _boot_mounted
				_status = Linux.umount( _boot_mount )
				if _status == -1
					message( "boot unmounted from %s", _boot_mount )
				else
					message( "Failed to unmount boot from %s", _boot_mount )
			if _root_mounted
				_status = Linux.umount( _root_mount )
				if _status == -1
					message( "Root unmounted from %s", _root_mount )
				else
					message( "Failed to unmount root from %s", _root_mount )
			if _root_mount != ""
				FileUtils.remove( _root_mount )
				message( "Mount point %s removed", _root_mount )

