#!/bin/bash

set -e -x

vps_name=${1:-oracle_vps}

# Client
sh <<EOF
cd web-client/
npm run build
EOF

ssh $vps_name sudo rm -rf /var/www/recipes recipes-client
scp -r web-client/build $vps_name:recipes-client
ssh $vps_name sudo mv recipes-client /var/www/recipes


# Server
mv server/node_modules/ .

ssh $vps_name sudo rm -rf /var/www/recipes-server recipes-server
scp -r server $vps_name:recipes-server
mv node_modules/ server/
ssh $vps_name sudo mv recipes-server /var/www/recipes-server

ssh $vps_name "cd /var/www/recipes-server ; npm install"
ssh $vps_name pm2 restart recipes-server

# Services
ssh $vps_name sudo systemctl stop recipes-backup
scp -r system $vps_name:recipes
ssh $vps_name sudo systemctl daemon-reload
ssh $vps_name sudo systemctl start recipes-backup
ssh $vps_name sudo systemctl status recipes-backup
