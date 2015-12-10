namespace ConfigurationScriptCommands

	class Include:Object implements ScriptCommand

		def get_command():string
			return "include"

		def get_description():string
			return "Reads another script"

