namespace PackageManagers

	class NoPackageManager:Object implements PackageManager

		def install_packages( package_list:array of string ):bool
			message( "A NoPackageManager instance cannot install packages" )
			return false

