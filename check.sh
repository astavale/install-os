#!/bin/sh
tests="GMustache
	SetShadowPassword"

# Remove old test binaries
rm build/tests/* -rf

# Create any directories for tests
for test in $tests
do
dir=$(dirname $test)
if [ "$dir" != "." ]; then
	mkdir build/tests/$dir --parents --verbose
fi
done

# Build test binaries
for test in $tests
do
namespace=${test//\//.}
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	--debug \
	--pkg gee-0.8 \
	--pkg gio-2.0 \
	--pkg posix \
	--pkg json-glib-1.0 \
	--pkg install-os \
	--vapidir . \
	--main UnitTests.$namespace.run \
	-X -I. \
	-X -Wl,-rpath,./ \
	-X -L./ \
	-X -l:install-os \
	-X -lcrypt \
	-X -D_XOPEN_SOURCE \
	-X -w \
	tests/$test.gs \
	--output build/tests/$test \
	--target-glib=2.46
done

# Run test binaries
for test in $tests
do
gtester --keep-going --verbose build/tests/$test
done
