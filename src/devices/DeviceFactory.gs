namespace Devices

	exception DeviceSetUpError
		FILE_ERROR

	def use_device( config:Configuration.Config, ref device:Device ):bool
		if config.device_string == ""
			if not (device isa NoDevice)
				device = new NoDevice()
			return true
		try
			device = new FileAsDevice( config )
			return true
		except error:DeviceSetUpError
			pass
		
		return false
