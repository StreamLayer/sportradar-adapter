  FROM node:18.17.0-alpine

  WORKDIR /opt

  COPY --chown=node:node ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", "/opt/"]

  RUN apk add --no-cache --virtual .buildDeps git python3 build-base openssh && \
      mkdir -p /opt/src /opt/dumps && \
      npm install && \
      apk del .buildDeps && \
      chown -R node:node /opt

  USER node

  COPY --chown=node:node ./src /opt/src
  # RUN npm install --only=production --force
