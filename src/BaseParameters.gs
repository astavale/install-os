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

		def parse_file( base_file:string ):bool

			var keyfile = new KeyFile()
			try
				message( "Base file: %s", base_file )
				keyfile.load_from_file( base_file, KeyFileFlags.NONE )

				if keyfile.has_group( "Repository" )
					if keyfile.has_key( "Repository", "format" )
						this.repository_format = keyfile.get_string( "Repository", "format" )
					if keyfile.has_key( "Repository", "distribution" )
						this.repository_distribution = keyfile.get_string( "Repository", "distribution" )
					if keyfile.has_key( "Repository", "uri" )
						this.repository_uri = keyfile.get_string( "Repository", "uri" )
					if keyfile.has_key( "Repository", "package" )
						this.repository_package = keyfile.get_string( "Repository", "package" )
					if keyfile.has_key( "Repository", "key" )
						this.repository_key = keyfile.get_string( "Repository", "key" )
				if keyfile.has_group( "Target" )
					if keyfile.has_key( "Target", "version" )
						this.target_version = keyfile.get_string( "Target", "version" )
					if keyfile.has_key( "Target", "architecture" )
						this.target_architecture = keyfile.get_string( "Target", "architecture" )
				if keyfile.has_group( "Root" )
					if keyfile.has_key( "Root", "packages" )
						this.root_packages = keyfile.get_string_list( "Root", "packages" )
				if keyfile.has_group( "Boot" )
					if keyfile.has_key( "Boot", "packages" )
						this.boot_packages = keyfile.get_string_list( "Boot", "packages" )
					if keyfile.has_key( "Boot", "loader" )
						this.boot_loader = keyfile.get_string( "Boot", "loader" )
			except
				return false

			return true
