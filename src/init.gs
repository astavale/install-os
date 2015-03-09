init
	Intl.setlocale( LocaleCategory.ALL, "" )
	if not cli_options.parse( args ) do return
