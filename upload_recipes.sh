#!/bin/bash

set -e -x

vps_name=${1:-oracle_vps}

# Build images
docker-compose -f docker-compose.prod.yml build

# Copy compose file to server
ssh $vps_name 'mkdir -p recidex'
scp docker-compose.prod.yml $vps_name:recidex/docker-compose.yml

# Push and pull images
ssh $vps_name 'sudo docker container start docker-registry'
docker-compose -f docker-compose.prod.yml push
ssh $vps_name 'cd ~/recidex && sudo docker-compose pull'
ssh $vps_name 'sudo docker container stop docker-registry'

# ssh $vps_name sudo rm -rf /var/www/recidex recidex-client
# scp -r web-client/build $vps_name:recidex-client
# ssh $vps_name sudo mv recidex-client /var/www/recidex


#Services
# ssh $vps_name sudo systemctl stop recipes-backup
scp -r system $vps_name:recidex
# ssh $vps_name sudo systemctl daemon-reload
# ssh $vps_name sudo systemctl start recipes-backup
# ssh $vps_name sudo systemctl status recipes-backup
