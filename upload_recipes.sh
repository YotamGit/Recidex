#!/bin/bash

set -e -x

vps_name=${1:-oracle_vps}

# Build images
docker-compose -f docker-compose.upload.yml build

# Copy compose file to server
ssh $vps_name 'mkdir -p recidex'
scp docker-compose.prod.yml $vps_name:recidex/docker-compose.yml
ssh $vps_name 'cd recidex && mkdir -p db'

# Push and pull images
ssh $vps_name 'sudo docker container start docker-registry'
docker-compose -f docker-compose.upload.yml push
ssh $vps_name "cd recidex && sudo docker-compose pull"
ssh $vps_name 'sudo docker container stop docker-registry'
ssh $vps_name "cd recidex && sudo docker-compose up -d"

#Services
scp -r system $vps_name:recidex

ssh $vps_name "cd recidex && sudo docker-compose up -d"
ssh $vps_name 'sudo cp ~/recidex/system/recidex-backup.service /etc/systemd/system/recidex-backup.service'
ssh $vps_name 'sudo cp ~/recidex/system/recidex-backup.timer /etc/systemd/system/recidex-backup.timer'
ssh $vps_name 'sudo systemctl daemon-reload'
ssh $vps_name 'sudo systemctl stop recidex-backup'
ssh $vps_name 'sudo systemctl start recidex-backup'
ssh $vps_name 'sudo systemctl stop recidex-backup.timer'
ssh $vps_name 'sudo systemctl start recidex-backup.timer'
ssh $vps_name 'sudo systemctl status recidex-backup'
ssh $vps_name 'sudo systemctl status recidex-backup.timer'
