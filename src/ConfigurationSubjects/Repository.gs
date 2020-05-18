/*
 *   install-os - a tool to build configured raw disk images
 *
 *   Copyright (C) 2020  Alistair Thomas <opensource @ astavale.co.uk>
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

	class RepositoryBuilder:Object implements ConfigurationDeclarationBuilder
		prop readonly name:string = "repository"
		prop readonly title:string = "References to a remote package repository"
		prop readonly description:string = """"repository" - references to a remote package repository

Reference information to a remote package repository. This is used to configure the package manager for the image to use that repository.

An example:
{ "configuration" : [
  { "repository" : {
      "configured_by": "PACKAGE",
      "configuration_source_location": "http://repository.example/release.package",
	  "public_key_location": "http://repository.example/public.key"
  }}

"configured_by" has the value of either "PACKAGE" or "FILE". These values should be all upper case.

"PACKAGE" denotes "configuration_source_location" contains a URI of a package. This package contains configuration files for the remote repository and is used by the package manager to reference the remote repository. This package may also contain public keys used to confirm the signature of installed packages.

"FILE" denotes "configuration_source_location" contains a URI of a file. install-os copies this file in to the image. The file is copied to a standard location expected by the package manager. This file contains details of the remote repository that is used by the package manager.

"public_key_location" is a URI of the repository's public key. The public key is used to verify the signature of a package. If the public key was installed as a "PACKAGE" then the file:/// scheme can be used, e.g. file:///etc/pki-gpg/PUBLIC-KEY. The file:/// URI is used by install-os to import the public key from the image to the package manager.
]}"""

		_package_manager:PackageManager

		construct( package_manager:PackageManager )
			_package_manager = package_manager

		def get_declaration( data:Variant ):ConfigurationDeclaration
			return new Repository( data, _package_manager )

	class Repository:Object implements ConfigurationDeclaration

		_repository:Variant
		_package_manager:PackageManager

		construct( data:Variant,
					package_manager:PackageManager
					)
			_repository = data
			_package_manager = package_manager


		def check():bool
			if not _repository.is_of_type( VariantType.DICTIONARY )
				message( @"\"repository\" in configuration should contain a dictionary" )
				return false
			var dictionary = new VariantDict( _repository )
			if !dictionary.contains( "configured_by" )
				message( @"\"repository\" in configuration should \"configured_by\" key" )
				return false
			if !dictionary.contains( "configuration_source_location" )
				message( @"\"repository\" in configuration should \"configuration_source_location\" key" )
				return false
			if !dictionary.contains( "public_key_location" )
				message( @"\"repository\" in configuration should \"public_key_location\" key" )
				return false
			return true


		def apply():bool
			result:bool = false
			var dictionary = new VariantDict( _repository )

			interim:EnumValue? = ((EnumClass)typeof(PackageManagers.ConfiguredBy).class_ref()).get_value_by_name( @"PACKAGE_MANAGERS_CONFIGURED_BY_$(dictionary.lookup_value( "configured_by", VariantType.STRING ).get_string())" )
			if interim == null
				message( @"configured_by base parameter is '$(dictionary.lookup_value( "configured_by", VariantType.STRING ).get_string())' and is not a value in PackageManagers.ConfiguredBy" )
				return false
			configured_by:PackageManagers.ConfiguredBy = (PackageManagers.ConfiguredBy)interim.value

			try
				_package_manager.install_repository_configuration( configured_by, dictionary.lookup_value( "configuration_source_location", VariantType.STRING ).get_string())
				_package_manager.install_repository_public_key( dictionary.lookup_value( "public_key_location", VariantType.STRING ).get_string() )
				result = true
			except error:PackageManagers.PackageManagerSetUpError
				message( @"error.message" )
				result = false

			return result
