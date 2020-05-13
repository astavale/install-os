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

namespace PackageManagers


	exception PackageManagerSetUpError
		FILE_ERROR
		UNSUPPORTED_CONFIGURATION_METHOD


	enum ConfiguredBy
		NOTHING
		FILE
		PACKAGE


	def use_package_manager( parameters:Base.Parameters,
							filesystem:RootFilesystem,
							out package_manager:PackageManager
							):bool
		_outcome:bool = false
		package_manager = new NoPackageManager()

		try
			case parameters.repository_package_manager
				when "yum"
					package_manager = new YumPackageManager( filesystem, parameters.os_id, parameters.os_version_id, parameters.os_architecture, parameters.repository_base_location )
					_outcome = true
		except
			return false

		return _outcome
