namespace BootLoaders

	class NoBootLoader:Object implements BootLoader
		def install():bool
			return true
		def create_menu():bool
			return true

