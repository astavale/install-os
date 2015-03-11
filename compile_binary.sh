#!/bin/sh
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	src/init.gs \
	src/CLI_Options.gs \
	src/devices/DeviceFactory.gs \
	src/devices/NoDevice.gs \
	src/devices/BlockDevice.gs \
	src/devices/FileAsDevice.gs \
	--output build_os_image
