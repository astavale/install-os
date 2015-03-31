namespace Devices

	exception DeviceSetUpError
		FILE_ERROR

	def use_device( device_string:string, out device:Device ):bool
		if device_string == ""
			return false
		try
			device = new FileAsDevice( device_string )
			return true
		except error:DeviceSetUpError
			pass
		
		return false
