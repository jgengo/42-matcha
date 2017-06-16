#!/bin/sh

tar -cvf /tmp/db.tar ./docker/sql/

ftp -n <<EOF
  open ftp.boxopix.fr
  user boxopix
  cd www
  put /tmp/db.tar db.tar
EOF


