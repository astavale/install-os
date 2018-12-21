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

namespace GMustache

	_data:dict of string, string

	def render( template:string, hash:dict of string, string ):string
		r:Regex = /{{&\s*(?<variable>[a-zA-Z_-]*)\s*}}/
		_data = hash
		result:string = ""
		try
			result = r.replace_eval( template, -1, 0, 0, (RegexEvalCallback) _process )
		except
			pass
		return result


	def _process( match:MatchInfo, output:StringBuilder ):bool
		key:string = match.fetch_named( "variable" )
		output.append( _data[ key ])
		return false
