#!/bin/sh
glib-compile-resources \
	--sourcedir src/resources \
	--generate-source \
	--target src/resources/resources.c \
	src/resources/resources.gresource.xml
#valac \
/home/al/software_projects/vala_source/installed/bin/valac \
	src/init.gs \
	src/AutoRelabel.gs \
	src/BaseFile.gs \
	src/CLIOptions.gs \
	src/Configuration.gs \
	src/Filesystem.gs \
	src/GMustache.gs \
	src/InstallKernel.gs \
	src/InstallRoot.gs \
	src/Interfaces.gs \
	src/Logging.gs \
	src/SetRootPassword.gs \
	src/WriteFstab.gs \
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
	--pkg gee-0.8 \
	--pkg augeas \
	--vapidir /home/al/software_projects/vapis/ \
	--vapi build_os.vapi \
	--header build_os.h \
	-X -pie \
	-X -fPIE \
	-X -Wl,-E \
	-X -w \
	-X -lcrypt \
	-X -D_XOPEN_SOURCE \
	--output build_os
