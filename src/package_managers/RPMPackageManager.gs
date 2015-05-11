namespace PackageManagers

	class RPMPackageManager:Object implements PackageManager
		
		construct( filesystem:Filesystem.Filesystem, 
					distribution:string, 
					version:string, 
					architecture:string 
					) raises PackageManagerSetUpError
			pass
		
		def install_packages( package_list:array of string ):bool
			return true
