namespace Configuration

	class Config
		root_path:string = ""
		device:Device = new Devices.NoDevice()
		filesize:string = ""

		repository_format:string = ""
		repository_distribution:string = ""
		target_version:string = ""
		target_architecture:string = ""

		install_base:bool = true
		root_packages:array of string = { "" }
		boot_packages:array of string = { "" }
		boot_loader:string = ""
		boot_device:string = ""
		boot_kernel_named:string = ""
		boot_initrd_named:string = ""

