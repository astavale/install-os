project( 'install-os', 'vala', 'c' )

if not meson.get_compiler('vala').version().version_compare('>=0.40.0')
    error( 'Vala version needs to be >= 0.40.0' )
endif

add_project_arguments( ['--vapidir', join_paths(meson.current_source_dir(), 'vapi')],
                        language: 'vala' )

dependencies = [
    dependency( 'glib-2.0' ),
    dependency( 'gobject-2.0' ),
    dependency( 'gio-2.0' ),
    dependency( 'gee-0.8' ),
    dependency( 'json-glib-1.0' ),
    dependency( 'augeas' ),
    meson.get_compiler( 'vala' ).find_library( 'posix' ),
    meson.get_compiler( 'vala' ).find_library( 'linux' ),
    meson.get_compiler( 'c' ).find_library( 'crypt' ),
]

sources = []

subdir( 'src' )

sources += import( 'gnome' ).compile_resources(
    'project-resources', 
    'src/resources/resources.gresource.xml',
    source_dir: 'src/resources',
)

executable( 'install-os', sources, dependencies: dependencies )
