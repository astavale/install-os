namespace Devices

	exception DeviceSetUpError
		FILE_ERROR

	def use_device( config:Configuration.Config, out device:Device ):bool
		if config.device_string == ""
			return false
		try
			device = new FileAsDevice( config )
			return true
		except error:DeviceSetUpError
			pass
		
		return false
