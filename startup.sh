#!/bin/bash

COLOR='\033[0;35m'
NC='\033[0m' 

echo "${COLOR}#================================================="
echo "# ${NC}download and unpack your database from remote ${COLOR}"
echo "#=================================================${NC}"
echo "\n\n"

curl -O http://boxopix.fr/db.tar
tar -xvf db.tar
