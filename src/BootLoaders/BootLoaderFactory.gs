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

namespace BootLoaders

	def use_boot_loader( parameters:Base.Parameters,
						filesystem:RootFilesystem,
						package_manager:PackageManager,
						ref boot_loader:BootLoader
						):bool
		_outcome:bool = false
		message( "Installing boot packages..." )
		_outcome = package_manager.install_packages( parameters.boot_packages )
		if _outcome
			message( "...done. Boot packages installed" )
		else
			message( "...failed. Install of boot packages failed" )
			return false
		try
			case parameters.boot_loader
				when "grub2-bios"
					boot_loader = new GRUBBIOS( parameters, filesystem )
					_outcome = true
				when "grub2-uefi"
					boot_loader = new GRUBUEFI()
					_outcome = true
		except
			return false

		return _outcome
