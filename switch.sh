#!/bin/sh

dir=`pwd`

sed -i '' "s@.*\/lib\/mysql.*@    - ${dir}/docker/sql:/var/lib/mysql@" $dir/docker/docker-compose.yml
sed -i '' "s@.*\/app.*@    - ${dir}/docker/www:/app@" $dir/docker/docker-compose.yml
echo "[edit] docker-compose.yml"
