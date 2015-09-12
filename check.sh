#!/bin/sh
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	--debug \
	--pkg gee-0.8 \
	--pkg posix \
	--pkg build_os_image \
	--vapidir . \
	--main test_main \
	-X -I. \
	-X -Wl,-rpath,./ \
	-X -l:build_os_image \
	test/GMustache.gs \
	--output build/test/GMustache
gtester --keep-going --verbose build/test/GMustache
