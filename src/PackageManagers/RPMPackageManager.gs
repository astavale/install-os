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

	class RPMPackageManager:Object implements PackageManager

		_filesystem:RootFilesystem
		_distribution:string = ""
		_version:string = ""
		_architecture:string = ""
		_repo_uri:string = ""
		_repo_package:string = ""
		_repo_key:string = ""
		_status:int = 1
		_output:string = ""
		_error:string = ""

		construct( filesystem:RootFilesystem,
					distribution:string,
					version:string,
					architecture:string,
					uri:string,
					package:string,
					key:string
					) raises PackageManagerSetUpError
			_filesystem = filesystem
			_distribution = distribution
			_version = version
			_architecture = architecture
			_repo_uri = uri
			_repo_package = package
			_repo_key = key
			try
				this.create_db()
			except error:PackageManagerSetUpError
				raise error
			this.install_repo_package()
			this.import_key()


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


		def private install_repo_package() raises PackageManagerSetUpError
			try
				Process.spawn_command_line_sync(
					"yum install --assumeyes --installroot " + _filesystem.path_on_host + " --setopt=reposdir=" + _filesystem.path_on_host + "/etc/yum.repos.d/ --repofrompath=install-os," + _repo_uri + " --releasever " + _version + " " + _repo_package,
					out _output,
					out _error,
					out _status )
			except
				pass
			if _status == 0
				message( "RPM repo files package installed\n" + _output + _error )
			else
				message( "Unable to install RPM repo files package\n" + _error )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to install RPM repo files package" )


		def private import_key() raises PackageManagerSetUpError
			try
				Process.spawn_command_line_sync(
					"rpm --root " + _filesystem.path_on_host + " --import " + _filesystem.path_on_host + "/etc/pki/rpm-gpg/" + _repo_key,
					out _output,
					out _error,
					out _status )
			except
				pass
			if _status == 0
				message( "GPG key imported in to RPM database" )
			else
				message( "Unable to import GPG key in to RPM database\n" + _output + _error )
				raise new PackageManagerSetUpError.FILE_ERROR( "Unable to import key" )


		def install_packages( package_list:array of string ):bool
			_package_list:string = ""
			try
				for var package in package_list
					_package_list += package + " "
				message( "Installing RPM packages: " + _package_list )
				Process.spawn_command_line_sync( 
					"yum install --assumeyes --installroot " + _filesystem.path_on_host + " --setopt=reposdir=" + _filesystem.path_on_host + "/etc/yum.repos.d/ --releasever " + _version + " " + _package_list,
					out _output,
					out _error,
					out _status )
			except
				pass
			if _status == 0
				message( "...done. RPM packages " + _package_list + " installed\n" + _output + _error )
			else
				message( "Unable to install packages: " + _package_list + "\n" + _error )
				return false
			return true
