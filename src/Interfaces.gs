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

interface Device:Object
	prop abstract raw_partition:string
	prop abstract boot_partition:string
	prop abstract boot_uuid:string
	prop abstract readonly boot_is_mountable:bool
	prop abstract root_partition:string
	prop abstract root_uuid:string
	prop abstract readonly root_is_mountable:bool
	prop abstract other_partitions:array of string

interface PackageManager:Object
	def abstract install_packages( package_list:array of string ):bool

interface BootLoader:Object
	def abstract install():bool
	def abstract create_menu():bool

interface ConfigurationDeclarationBuilder:Object
	prop abstract readonly name:string
	prop abstract readonly title:string
	prop abstract readonly description:string
	def abstract get_declaration( data:Variant ):ConfigurationDeclaration

interface ConfigurationDeclaration:Object
	def abstract check():bool
	def abstract apply():bool
