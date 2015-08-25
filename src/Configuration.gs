namespace Configuration

	class Config
		root_path:string = ""
		device:Device = new Devices.NoDevice()
		filesize:string = ""

		repository_format:string = ""
		repository_distribution:string = ""
		target_version:string = ""
		target_architecture:string = ""
		root_packages:array of string = { "" }
		
		boot_packages:array of string = { "" }
		boot_loader:string = ""

