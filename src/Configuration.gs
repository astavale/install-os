namespace Configuration

	class Config
		base_file:string = ""
		root_path:string = ""
		device:Device = new Devices.NoDevice()
		image_size:string = ""

		repository_format:string = ""
		repository_distribution:string = ""
		repository_uri:string = ""
		repository_package:string = ""
		repository_key:string = ""
		target_version:string = ""
		target_architecture:string = ""

		root_packages:array of string = { null }
		boot_packages:array of string = { null }
		boot_loader:string = ""
		boot_device:string = ""
		boot_kernel_named:string = ""
		boot_initrd_named:string = ""

		script_paths:List of string = new List of string()

