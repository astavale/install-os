#!/bin/sh
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	src/init.gs \
	src/BaseFile.gs \
	src/CLIOptions.gs \
	src/Configuration.gs \
	src/Filesystem.gs \
	src/Interfaces.gs \
	src/Logging.gs \
	src/devices/DeviceFactory.gs \
	src/devices/NoDevice.gs \
	src/devices/BlockDevice.gs \
	src/devices/FileAsDevice.gs \
	src/package_managers/PackageManagerFactory.gs \
	src/package_managers/RPMPackageManager.gs \
	--pkg gio-2.0 \
	--pkg posix \
	--pkg linux \
	--output build_os_image
