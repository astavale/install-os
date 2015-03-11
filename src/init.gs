init
	Intl.setlocale( LocaleCategory.ALL, "" )
	if not CLI_Options.parse( args ) do return
