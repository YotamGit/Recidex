#!/bin/bash

set -e -x

vps_name=${1:-oracle_vps}

# Client
cd web-client/
npm run build

ssh $vps_name sudo rm -rf /var/www/recipes recipes
scp -r build $vps_name:recipes
ssh $vps_name sudo mv recipes /var/www/recipes