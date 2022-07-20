FROM node
WORKDIR /recidex-server
COPY package.json ./
COPY package-lock.json ./

ARG npm_flag=""
RUN npm install ${npm_flag} && npm cache clean --force

COPY ./ ./

EXPOSE 3001
ARG start_script="dev"
ENV start_script=${start_script}
ENTRYPOINT npm run $start_script