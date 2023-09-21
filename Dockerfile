FROM node:18.17.0-alpine

WORKDIR /opt

RUN apk update --no-cache && \
    apk add --no-cache git python3 build-base openssh && \
    mkdir -p /opt/src /opt/dumps && \
    chown -R node:node /opt

COPY --chown=node:node ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", "/opt/"]

USER node

RUN npm install

COPY --chown=node:node ./src /opt/src
# RUN npm install --only=production --force
