#!/bin/bash

COLOR='\033[0;35m'
NC='\033[0m' 

echo "${COLOR}#================================================="
echo "# ${NC}download and unpack your database from remote ${COLOR}"
echo "#=================================================${NC}"
echo "\nDownloading db.tar"

curl --progress-bar -O http://boxopix.fr/db.tar
echo "\nUnpacking..."
tar -xf db.tar
if [ $? -ne 0 ]; then
	echo "Failed to Unpack"
else
	echo "Unpack Done"
fi
echo "\nRemove db.tar"
rm -rf db.tar
if [ $? -ne 0 ]; then
	echo "Failed"
	exit 1
fi
echo "\nAll Done"
exit 0
