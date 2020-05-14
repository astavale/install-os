/*
 *   install-os - a tool to build configured raw disk images
 *
 *   Copyright (C) 2018  Alistair Thomas <opensource @ astavale.co.uk>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Base

	class Parameters
		root_path:string = ""
		device:Device = new Devices.NoDevice()
		image_size:string = ""

		os_id:string = ""
		os_version_id:string = ""
		os_architecture:string = ""

		repository_base_location:string = ""
		repository_package_manager:string = ""
		repository_configured_by:string = ""
		repository_configuration_source_location:string = ""
		repository_public_key_location:string = ""

		root_packages:array of string = { null }
		kernel_packages:array of string = { null }
		boot_packages:array of string = { null }
		boot_loader:string = ""
		boot_device:string = ""
		boot_kernel_named:string = ""
		boot_initrd_named:string = ""

		configuration_paths:List of string = new List of string()


		def parse_file( base_file:string ):bool

			var keyfile = new KeyFile()
			try
				message( "Base file: %s", base_file )
				keyfile.load_from_file( base_file, KeyFileFlags.NONE )

				if keyfile.has_group( "OS" )
					if keyfile.has_key( "OS", "id" )
						this.os_id = keyfile.get_string( "OS", "id" )
					if keyfile.has_key( "OS", "version_id" )
						this.os_version_id = keyfile.get_string( "OS", "version_id" )
					if keyfile.has_key( "OS", "architecture" )
						this.os_architecture = keyfile.get_string( "OS", "architecture" )

				if keyfile.has_group( "Repository" )
					if keyfile.has_key( "Repository", "package_manager" )
						this.repository_package_manager = keyfile.get_string( "Repository", "package_manager" )
					if keyfile.has_key( "Repository", "location" )
						this.repository_base_location = keyfile.get_string( "Repository", "location" )
					if keyfile.has_key( "Repository", "configured_by" )
						this.repository_configured_by = keyfile.get_string( "Repository", "configured_by" )
					if keyfile.has_key( "Repository", "configuration_source_location" )
						this.repository_configuration_source_location = keyfile.get_string( "Repository", "configuration_source_location" )
					if keyfile.has_key( "Repository", "public_key_location" )
						this.repository_public_key_location = keyfile.get_string( "Repository", "public_key_location" )

				if keyfile.has_group( "Root" )
					if keyfile.has_key( "Root", "packages" )
						this.root_packages = keyfile.get_string_list( "Root", "packages" )

				if keyfile.has_group( "Kernel" )
					if keyfile.has_key( "Kernel", "packages" )
						this.kernel_packages = keyfile.get_string_list( "Kernel", "packages" )

				if keyfile.has_group( "Boot" )
					if keyfile.has_key( "Boot", "packages" )
						this.boot_packages = keyfile.get_string_list( "Boot", "packages" )
					if keyfile.has_key( "Boot", "loader" )
						this.boot_loader = keyfile.get_string( "Boot", "loader" )
			except
				return false

			return true
