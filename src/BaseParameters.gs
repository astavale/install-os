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
		base_file:string = ""
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
