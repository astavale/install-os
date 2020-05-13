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

	class YumPackageManager:Object implements PackageManager

		_filesystem:RootFilesystem
		_distribution:string = ""
		_version:string = ""
		_architecture:string = ""
		_repo_base_uri:string = ""
		_status:int = 1
		_output:string = ""
		_error:string = ""

		construct( filesystem:RootFilesystem,
					distribution:string,
					version:string,
					architecture:string,
					uri:string
					) raises PackageManagerSetUpError
			_filesystem = filesystem
			_distribution = distribution
			_version = version
			_architecture = architecture
			_repo_base_uri = uri
			try
				this.create_db()
			except error:PackageManagerSetUpError
				raise error


		def private create_db() raises PackageManagerSetUpError
			try
				Process.spawn_command_line_sync(
					"rpm --root " + _filesystem.path_on_host + " -qa",
					out _output,
					null,
					out _status )
			except
				pass
			if _status == 0
				message( "RPM database for root " + _filesystem.path_on_host + " available" + _output )
			else
				message( "Unable to use RPM database for root " + _filesystem.path_on_host + "\n" + _output )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to use RPM database" )


		def install_repository_configuration( by:ConfiguredBy, uri:string ) raises PackageManagerSetUpError
			if by != PACKAGE
				raise new PackageManagerSetUpError.UNSUPPORTED_CONFIGURATION_METHOD( "YumPackageManager only supports configuration by PACKAGE" )
			var command = @"yum install --assumeyes"
			command += @" --installroot $(_filesystem.path_on_host)"
			command += @" --setopt=reposdir=$(_filesystem.path_on_host)/etc/yum.repos.d/"
			command += @" --repofrompath=install-os,$(_repo_base_uri)"
			command += @" --releasever $(_version)"
			command += @" $(uri)"
			message( command )
			try
				Process.spawn_command_line_sync( command, out _output, out _error, out _status )
			except
				pass
			if _status == 0
				message( "RPM repo files package installed\n" + _output + _error )
			else
				message( "Unable to install RPM repo files package\n" + _error )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to install RPM repo files package" )


		def install_repository_public_key( uri:string ) raises PackageManagerSetUpError
			var command = @"rpm --root $(_filesystem.path_on_host)"
			if Uri.parse_scheme( uri ) == "file"
				try
					command += @" --import $(_filesystem.path_on_host)$(Filename.from_uri(uri))"
				except error:ConvertError
					raise new PackageManagerSetUpError.FILE_ERROR ( @"$(error.message)" )
			else
				command += @" --import $(uri)"
			message( command )
			try
				Process.spawn_command_line_sync( command, out _output, out _error, out _status )
			except
				pass
			if _status == 0
				message( "GPG key imported in to RPM database" )
			else
				message( "Unable to import GPG key in to RPM database\n" + _output + _error )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to import key" )


		def install_packages( package_list:array of string ):bool
			try
				var command_base = @"yum install --assumeyes"
				command_base += @" --installroot $(_filesystem.path_on_host)"
				command_base += @" --setopt=reposdir=$(_filesystem.path_on_host)/etc/yum.repos.d/"
				command_base += @" --releasever $(_version)"
				command:string
				for var package in package_list
					command = @"$(command_base) $(package)"
					message( @"Installing RPM package: $(package)" )
					message( @"$(command)" )
					Process.spawn_command_line_sync( command, out _output, out _error, out _status )
					if _status == 0
						message( "...done. RPM package " + package + " installed\n" + _output + _error )
					else
						message( "Unable to install package: " + package + "\n" + _error )
						return false
			except
				pass
			return true
