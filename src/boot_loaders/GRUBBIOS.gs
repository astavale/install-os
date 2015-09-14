namespace BootLoaders

	class GRUBBIOS:Object implements BootLoader

		_boot_device:string = ""
		_root_dir:string = ""
		_status:int = 1
		_output:string = ""

		construct( config:Configuration.Config,
			filesystem:Filesystem.Filesystem )
			_boot_device = config.boot_device
			_root_dir = filesystem.root_dir

		def install():bool
			if _boot_device == ""
				message( "GRUB BIOS not installed. No boot device given" )
			else
				message( "Creating and writing GRUB2 device map" )
				try
					_template_resource:Bytes = resources_lookup_data( "/templates/grub2/device.map.mustache", ResourceLookupFlags.NONE )
					_template:string = (string)_template_resource.get_data()
					var _hash = new dict of string, string
					_hash[ "boot_device" ] = _boot_device
					_device_map:string = GMustache.render( _template, _hash )
					var _file = File.new_for_path( _root_dir + "/boot/grub2/device.map" )
					var _output = _file.create( FileCreateFlags.NONE )
					_bytes_written:size_t
					_output.write_all( _device_map.data, out _bytes_written )
					message( "GRUB2 device map written:\n%s", _device_map )
				except
					message( "Creating or writing GRUB2 device map failed" )
					return false
				try
					message( "Installing GRUB2 BIOS boot on %s", _boot_device )
					// Needs to be run from within the image, but get
					// "failed to get canonical path of"
					// looks as though chroot needed and remount
					Process.spawn_command_line_sync( 
						"grub2-install --no-floppy --modules=\"part_gpt fat exfat ext2\" --target=i386-pc --boot-directory=" + _root_dir + "/boot " + _boot_device,
						out _output,
						null,
						out _status )
				except
					pass
				if _status != 0
					message( "...failed\n" + _output )
				else
					message( "...success\n" + _output )
			return true

		def create_menu():bool
			return true

