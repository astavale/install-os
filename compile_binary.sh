#!/bin/sh

mkdir build/src/resources --parents
glib-compile-resources \
	--sourcedir src/resources \
	--generate-source \
	--target build/src/resources/resources.c \
	src/resources/resources.gresource.xml

if [ ! -v VALAC ]
then VALAC=valac
fi

$VALAC \
	src/init.gs \
	src/AutoRelabel.gs \
	src/BaseFile.gs \
	src/CommandLineInterface/CommandLineInterface.gs \
	src/Commands.gs \
	src/Configuration.gs \
	src/Filesystem.gs \
	src/GMustache.gs \
	src/InstallKernel.gs \
	src/InstallRoot.gs \
	src/Interfaces.gs \
	src/Logging.gs \
	src/Script.gs \
	src/WriteFstab.gs \
	src/BootLoaders/BootLoaderFactory.gs \
	src/BootLoaders/NoBootLoader.gs \
	src/BootLoaders/GRUBBIOS.gs \
	src/BootLoaders/GRUBUEFI.gs \
	src/ScriptCommands/Include.gs \
	src/ScriptCommands/Packages.gs \
	src/ScriptCommands/SetRootPassword.gs \
	src/Devices/DeviceFactory.gs \
	src/Devices/NoDevice.gs \
	src/Devices/BlockDevice.gs \
	src/Devices/FileAsDevice.gs \
	src/PackageManagers/NoPackageManager.gs \
	src/PackageManagers/PackageManagerFactory.gs \
	src/PackageManagers/RPMPackageManager.gs \
	build/src/resources/resources.c \
	--vapidir ./vapi/ \
	--pkg gio-2.0 \
	--pkg posix \
	--pkg linux \
	--pkg gee-0.8 \
	--pkg json-glib-1.0 \
	--pkg augeas \
	-X -pie \
	-X -fPIE \
	-X -Wl,-E \
	-X -w \
	-X -lcrypt \
	-X -D_XOPEN_SOURCE \
	--header install-os.h \
	--basedir src \
	--directory build/src \
	--vapi ../../install-os.vapi \
	--output ../../install-os
