# Recidex
https://recidex.yotamgolan.com

Recidex is a recipes site where the recipes are uploaded by the users, for the users.
Anyone can upload any recipe they would like to save.
Whether it's a 30 years old written recipe worth keeping, a good recipe found online or a self made recipe, Recidex is the place for it.

1. [Setup](#setup)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Pages](#pages)


## Setup
### Setup development environment
1. install docker
2. install npm, run `npm install` in `web-client` directory
3. create a directory named `db`

### To develop
1. Run `docker-compose -f docker-compose.dev.yml up --build -d`
2. To see api server's logs, run `docker-compose -f docker-compose.dev.yml logs -f api` in a new terminal
3. To connect to a running container, run `docker exec -it <container name> bash`, run `exit` to exit the terminal
4. Navigate to `web-client` and run `npm start`
5. Browse to http://localhost:3000/
6. To shutdown the containers, run `docker-compose -f docker-compose.dev.yml down`

### Setup Recidex in a new vps (oracle in this case)
1. Create a file named `config` at `C:\Users\<your-user>\.ssh\` and add the following: 
   ```
   Host oracle_vps
       User ubuntu
       HostName yotamgolan.com
       port 22
       IdentityFile "path-to-ssh-key"
   ```
2. Configure vps's `nginx` to route requests from `https://recidex.yotamgolan.com/` to `http://localhost:8080`
3. Install `docker` and `docker-compose`
4. Set up an insecure (or secure) registry on the server:
   * https://www.digitalocean.com/community/tutorials/how-to-set-up-a-private-docker-registry-on-ubuntu-20-04
   * https://www.docker.com/blog/how-to-use-your-own-registry-2/
   * https://docs.docker.com/registry/insecure/
5. To upload to production, run `./upload_recidex.sh` in bash from local machine
6. Enable backing services:
   * Run `sudo systemctl enable recidex-backup.service`
   * Run `sudo systemctl enable recidex-backup.timer`

## Technology Stack

### Frontend
1. React.js
2. Material UI
3. TypeScript
   
### Backend
1. Node.js
2. Express.js 
3. MongoDB
4. Winston and Morgan for logging
5. Docker
6. Nginx

## Features
* Create an account
* Upload, edit, share and collect recipes
* Different recipe privacy modes
* Search and filter recipes
* Moderate users and recipes

## Pages
### Public
Accessible by everyone
* `Home` - all public and approved recipes appear here
* `Add Recipe` - a form to add a recipe to the database
* `Log In`
* `Sign Up`
* `User Profile` - see user related data along with the user's public recipes and favorite recipes
* `Recipe Page`
* `Privacy Policy`
* `Forgot Credentials` - recover username or reset password
### User
Accissible by a registered user
* `My Recipes` - see your recipes categorized by privacy mode 
* `Favorites` - recipes you favorited appear here
* `Account` - see and manage your accound details
### Admin
Accessible by admins and moderators
* `Admin Panel` - Manage and modify users
* `Recipe Moderation` - approve, disapprove and edit recipes set for approval by users
