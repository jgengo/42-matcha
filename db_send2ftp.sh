#!/bin/sh

dir=`pwd`

tar -cvf /tmp/db.tar ${dir}/docker/sql/

ftp -n <<EOF
  open ftp.boxopix.fr
  user boxopix
  cd www
  put /tmp/db.tar db.tar
EOF


