FROM node:alpine as build-deps
WORKDIR /recidex-client
COPY package.json ./
COPY package-lock.json ./
RUN npm install && npm cache clean --force
COPY ./ ./
RUN npm run build

FROM ubuntu/nginx
EXPOSE 80
COPY --from=build-deps /recidex-client/build /var/www/recidex-client
COPY ./nginx/nginx_http.conf /etc/nginx/conf.d/http.conf
COPY ./nginx/default.conf /etc/nginx/sites-enabled/default