#!/bin/sh
tests="GMustache
		SetShadowPassword"

# Remove old test binaries
rm build/test/* -f

# Build test binaries
for test in $tests
do
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	--debug \
	--pkg gee-0.8 \
	--pkg gio-2.0 \
	--pkg posix \
	--pkg build_os \
	--vapidir . \
	--main UnitTests$test.run \
	-X -I. \
	-X -Wl,-rpath,./ \
	-X -l:build_os \
	-X -w \
	-X -lcrypt \
	-X -D_XOPEN_SOURCE \
	test/$test.gs \
	--output build/test/$test
done

# Run test binaries
for test in $tests
do
gtester --keep-going --verbose build/test/$test
done
