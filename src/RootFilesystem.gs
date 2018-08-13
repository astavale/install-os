exception RootFilesystemSetUpError
	FILE
	MOUNT
	HOST_PATH

class RootFilesystem

	boot_dir:string = ""
	prop readonly path_on_host:string = ""
	prop readonly empty_at_start:bool = false

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


	construct( config:Configuration.Config ) raises RootFilesystemSetUpError
		if config.device.root_is_mountable
			try
				_root_mount = _create_root_mount_point( )
				_path_on_host = _mount_root( config.device, _root_mount )
			except error:RootFilesystemSetUpError
				raise error
		else if config.root_path != ""
			_path_on_host = config.root_path
		else
			raise new RootFilesystemSetUpError.HOST_PATH( "File path on host, %s, for target root file system is not usable", config.root_path )

		this._empty_at_start = _check_root_empty()
		if empty_at_start
			try
				_mount_sys()
				_mount_proc()
				_mount_run()
				_mount_dev()
				_mount_boot()
			except error:RootFilesystemSetUpError
				raise error


	def _create_root_mount_point( ):string raises RootFilesystemSetUpError
		_mnt_dir:string = Environment.get_tmp_dir() + "/build_os_image-" + Checksum.compute_for_string( ChecksumType.MD5, Random.next_int().to_string() )
		message( "Creating mount point " + _mnt_dir + " for root filesystem" )
		_status = Posix.mkdir( _mnt_dir, 0700 )
		if _status != 0
			message( "...failed\n" )
			raise new RootFilesystemSetUpError.FILE( "Failed to create temporary mount point for root" )
		message( "...done\n" )
		return _mnt_dir


	def _mount_root( device:Device, _mount_point:string ):string raises RootFilesystemSetUpError
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
			raise new RootFilesystemSetUpError.FILE( "Unable to find type of filesystem on root partition" )
		_root_fs = _output.chomp()

		try
			_root_mounted = _mount( device.root_partition, _root_fs, _mount_point )
		except error:RootFilesystemSetUpError
			raise new RootFilesystemSetUpError.FILE( "Failed to mount root" )
		message( "...done\n" )
		return _mount_point


	def _check_root_empty():bool raises RootFilesystemSetUpError
		_root:Dir
		try
			_root = Dir.open( path_on_host )
		except error:FileError
			message( "Unable to open root directory. \"" + error.message + "\"" )
			raise new RootFilesystemSetUpError.FILE( "Unable to open root directory" )
		entry:string? = _root.read_name()
		if entry == "lost+found"
			entry = _root.read_name()
		root_is_empty:bool = true
		if entry != null
			message( "Root filesystem is not empty, path on host to root is %s", path_on_host )
			root_is_empty = false
		return root_is_empty


	def _mount_sys() raises RootFilesystemSetUpError
		try
			_sys_mount = _create_mount_point( path_on_host, "sys" )
			_sys_mounted = _mount( "sysfs", "sysfs", _sys_mount )
		except error:RootFilesystemSetUpError
			raise error


	def _mount_proc() raises RootFilesystemSetUpError
		try
			_proc_mount = _create_mount_point( path_on_host, "proc" )
			_proc_mounted = _mount( "proc", "proc", _proc_mount )
		except error:RootFilesystemSetUpError
			raise error


	def _mount_run() raises RootFilesystemSetUpError
		try
			_run_mount = _create_mount_point( path_on_host, "run" )
			_run_mounted = _mount( "tmpfs", "tmpfs", _run_mount )
		except error:RootFilesystemSetUpError
			raise error


	def _mount_dev() raises RootFilesystemSetUpError
		try
			_dev_mount = _create_mount_point( path_on_host, "dev" )
			_dev_mounted = _mount( "/dev", "devtmpfs", _dev_mount, Linux.MountFlags.BIND )
		except error:RootFilesystemSetUpError
			raise error


	def _mount_boot() raises RootFilesystemSetUpError
		pass


	def _create_mount_point( root:string, filename:string ):string raises RootFilesystemSetUpError
		separator:string = "/"
		// If root ends in '/' change directory separator to empty string
		if ( /\/$/.match( root ))
			separator = ""
		mount_point:string = root + separator + filename
		_status = Posix.mkdir( mount_point, 0700 )
		if _status != 0
			message( "Failed to creat mount point " + mount_point )
			raise new RootFilesystemSetUpError.MOUNT( "Failed to create mount point" )
		message( "Created mount point " + mount_point )
		return mount_point


	def _mount( device:string, filesystem:string, mount_point:string, flags:Linux.MountFlags = 0 ):bool raises RootFilesystemSetUpError
		_status = Linux.mount( device, mount_point, filesystem, flags )
		if _status == -1
			message( "Failed to mount %s at %s as %s. Error number %i\n", device, mount_point, filesystem, Posix.errno )
			raise new RootFilesystemSetUpError.MOUNT( "Failed to mount " + device )
		message( "Mounted " + device + " at " + mount_point )
		return true


	def use_boot( )
		pass


	final
		if _sys_mounted
			_status = Linux.umount( _sys_mount )
			if _status == 0
				message( "Sysfs unmounted from %s", _sys_mount )
			else
				message( "Failed to unmount sysfs from %s", _sys_mount )
		if _proc_mounted
			_status = Linux.umount( _proc_mount )
			if _status == 0
				message( "proc unmounted from %s", _proc_mount )
			else
				message( "Failed to unmount proc from %s", _proc_mount )
		if _run_mounted
			_status = Linux.umount( _run_mount )
			if _status == 0
				message( "run unmounted from %s", _run_mount )
			else
				message( "Failed to unmount run from %s", _run_mount )
		if _dev_mounted
			_status = Linux.umount( _dev_mount )
			if _status == 0
				message( "dev unmounted from %s", _dev_mount )
			else
				message( "Failed to unmount dev from %s", _dev_mount )
		if _boot_mounted
			_status = Linux.umount( _boot_mount )
			if _status == 0
				message( "boot unmounted from %s", _boot_mount )
			else
				message( "Failed to unmount boot from %s", _boot_mount )
		if _root_mounted
			_status = Linux.umount( _root_mount )
			if _status == 0
				message( "Root unmounted from %s", _root_mount )
			else
				message( "Failed to unmount root from %s", _root_mount )
		if _root_mount != ""
			FileUtils.remove( _root_mount )
			message( "Mount point %s removed", _root_mount )

