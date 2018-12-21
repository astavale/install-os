`install-os` - a tool for system builders and DevOps to build configured raw
disk images

## ## WARNING ## ##
This software requires root privileges to create loopback devices, mount
partitions and install software in the mounted partitions.

 ** USE AT YOUR OWN RISK **

## How to Use ##

`install-os` will show a basic help message when no command is added. On the
command line Just enter:

`install-os`

To install Cent OS to a raw disk image use the `install` command:

`sudo install-os install base_files/centos-7.6.1810-x86_64
my_raw_disk_image.img`

The raw disk image is created as part of the install. If the path already exists
as a file then `install-os` will exit. If the path given is a directory then the
install is made to the directory.

The basic form is `install` `distribution` to `image`. The distribution
definition files are called 'base' files and define the basic characteristics of
any installation. At present `install-os` only supports RPM based distributions.
See the `base_files` directory for examples.

Additional configuration scripts can be added to the command, e.g.

`sudo install-os install base_files/centos-7.6.1810-x86_64 my_raw_disk_image.img
my_webserver_install.json`


Configuration scripts are JSON formatted. A list of commands available in a
script can be seen with:

`install-os list`

For more information about each script command use `install-os help <command>`,
for example:

`install-os help packages`


## How to Build `install-os` ##
`install-os` uses the Meson build system. First clone the mainline repository:

```
git clone https://gitlab.com/astavale/install-os
cd install-os
```

Then set up your Meson build directory:

`meson setup my_build_dir`

Then build the program. For example, if using `ninja` as the backend:

`ninja -C my_build_dir`

To run `install-os` use:

`./my_build_dir install-os`


## Improvements ##
Future improvements could be:

 * System wide install
 * Add `base_files` to system wide install directories
 * Tighter use of system administration privileges
 * Support for `dpkg` so Debian based distributions can be installed


## Financing ##
If you think `install-os` has potential and you would like to fund future
features please contact `opensouce @ astavale.co.uk`.

Note that the project is licensed under the GPL v3 and follows a collaborative
development model. Self funded contributions are welcome.
