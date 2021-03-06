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

namespace Devices

	class NoDevice:Object implements Device
		prop raw_partition:string = ""
		prop boot_partition:string = ""
		prop boot_uuid:string = ""
		prop readonly boot_is_mountable:bool
			get
				return false
		prop root_partition:string = ""
		prop root_uuid:string = ""
		prop readonly root_is_mountable:bool
			get
				return false
		prop other_partitions:array of string = {""}
