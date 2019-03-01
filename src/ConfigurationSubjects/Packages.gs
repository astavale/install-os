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

namespace ConfigurationDeclarations

	class PackagesBuilder:Object implements ConfigurationDeclarationBuilder
		prop readonly name:string = "packages"
		prop readonly title:string = "Install listed packages"
		prop readonly description:string = """"packages" - install a list of packages

The package manager specified in the base configuration file is used to install
the packages.

An example:
{ "script" : [
  { "packages" : [
      "vala",
      "vala-devel"
  ]}
]}"""

		_package_manager:PackageManager

		construct( package_manager:PackageManager )
			_package_manager = package_manager

		def get_declaration( data:Variant ):ConfigurationDeclaration
			return new Packages( data, _package_manager )

	class Packages:Object implements ConfigurationDeclaration

		_package_list:Variant
		_package_manager:PackageManager

		construct( data:Variant,
					package_manager:PackageManager
					)
			_package_list = data
			_package_manager = package_manager


		def check():bool
			if not _package_list.is_of_type( VariantType.ARRAY )
				return false
			var iterator = _package_list.iterator()
			value:Variant? = iterator.next_value()
			result:bool = false
			while ( value != null )
				if value.get_child_value(0).is_of_type( VariantType.STRING )
					result = true
				else
					result = false
					break
				value = iterator.next_value()
			return result


		def apply():bool
			var iterator = _package_list.iterator()
			value:Variant? = iterator.next_value()
			result:bool = false
			packages:array of string = new array of string[ _package_list.n_children() ]
			count:int = 0
			while ( value != null )
				if value.get_child_value(0).is_of_type( VariantType.STRING )
					packages[ count ] = value.get_child_value(0).get_string()
					count ++
					result = true
				else
					result = false
					break
				value = iterator.next_value()
			if result
				_package_manager.install_packages( packages )
			return result
