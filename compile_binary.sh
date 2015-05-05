#!/bin/sh
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	src/init.gs \
	src/CLI_Options.gs \
	src/Configuration.gs \
	src/Interfaces.gs \
	src/Logging.gs \
	src/devices/DeviceFactory.gs \
	src/devices/NoDevice.gs \
	src/devices/BlockDevice.gs \
	src/devices/FileAsDevice.gs \
	src/Filesystem.gs \
	--pkg gio-2.0 \
	--pkg posix \
	--output build_os_image
