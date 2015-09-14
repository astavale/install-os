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
