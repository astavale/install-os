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

def set_root_password( filesystem:RootFilesystem ):bool
	set_password_in_shadow_formatted_file( filesystem.path_on_host + "/etc/shadow", "root", "test" )
	message( "Root password set to \"test\"\n" )
	return true


def set_password_in_shadow_formatted_file( file:string,
											user:string,
											password:string = "!",
											salt_p:string = ""
											)
	salt:string = salt_p
	var aug = new Augeas.Tree ("/", null, Augeas.InitFlags.NO_MODL_AUTOLOAD)
	aug.transform("Shadow", file)
	aug.load()
	path:string = "/files" + file + "/*[label() = \"" + user + "\"]/password"
	if (salt == "" and password != "!")
		salt = get_salt_for_sha_512()
	if password != "!"
		password = Posix.crypt( password, salt )
	aug.set (path, password)
	aug.save()


def get_salt_for_sha_512():string
	var random_numbers = new array of uchar[20]
	for var a = 0 to 20
		random_numbers[a] = (uchar)Random.next_int()
	salt:string = Base64.encode( random_numbers )
	try
		salt = /\+/.replace( salt, -1, 0, "." )
	except
		pass
	salt = salt[0:16]
	salt = "$6$" + salt
	return salt
