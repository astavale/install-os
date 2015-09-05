#!/bin/sh
glib-compile-resources \
	--sourcedir src/resources \
	--generate-source \
	--target src/resources/resources.c \
	src/resources/resources.gresource.xml
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	src/init.gs \
	src/BaseFile.gs \
	src/CLIOptions.gs \
	src/Configuration.gs \
	src/Filesystem.gs \
	src/InstallKernel.gs \
	src/InstallRoot.gs \
	src/Interfaces.gs \
	src/Logging.gs \
	src/boot_loaders/BootLoaderFactory.gs \
	src/boot_loaders/NoBootLoader.gs \
	src/boot_loaders/GRUBBIOS.gs \
	src/boot_loaders/GRUBUEFI.gs \
	src/devices/DeviceFactory.gs \
	src/devices/NoDevice.gs \
	src/devices/BlockDevice.gs \
	src/devices/FileAsDevice.gs \
	src/package_managers/NoPackageManager.gs \
	src/package_managers/PackageManagerFactory.gs \
	src/package_managers/RPMPackageManager.gs \
	src/resources/resources.c \
	--pkg gio-2.0 \
	--pkg posix \
	--pkg linux \
	--vapi build_os_image.vapi \
	--header build_os_image.h \
	-X -pie \
	-X -fPIE \
	-X -Wl,-E \
	--output build_os_image
