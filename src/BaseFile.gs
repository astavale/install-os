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

namespace BaseFile

	def parse( ref parameters:Base.Parameters ):bool

		var keyfile = new KeyFile()
		try
			message( "Base file: %s", parameters.base_file )
			keyfile.load_from_file( parameters.base_file, KeyFileFlags.NONE )

			if keyfile.has_group( "Repository" )
				if keyfile.has_key( "Repository", "format" )
					parameters.repository_format = keyfile.get_string( "Repository", "format" )
				if keyfile.has_key( "Repository", "distribution" )
					parameters.repository_distribution = keyfile.get_string( "Repository", "distribution" )
				if keyfile.has_key( "Repository", "uri" )
					parameters.repository_uri = keyfile.get_string( "Repository", "uri" )
				if keyfile.has_key( "Repository", "package" )
					parameters.repository_package = keyfile.get_string( "Repository", "package" )
				if keyfile.has_key( "Repository", "key" )
					parameters.repository_key = keyfile.get_string( "Repository", "key" )
			if keyfile.has_group( "Target" )
				if keyfile.has_key( "Target", "version" )
					parameters.target_version = keyfile.get_string( "Target", "version" )
				if keyfile.has_key( "Target", "architecture" )
					parameters.target_architecture = keyfile.get_string( "Target", "architecture" )
			if keyfile.has_group( "Root" )
				if keyfile.has_key( "Root", "packages" )
					parameters.root_packages = keyfile.get_string_list( "Root", "packages" )
			if keyfile.has_group( "Boot" )
				if keyfile.has_key( "Boot", "packages" )
					parameters.boot_packages = keyfile.get_string_list( "Boot", "packages" )
				if keyfile.has_key( "Boot", "loader" )
					parameters.boot_loader = keyfile.get_string( "Boot", "loader" )
		except
			return false

		return true
