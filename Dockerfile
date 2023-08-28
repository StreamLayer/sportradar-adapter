# this is our first build stage, it will not persist in the final image
FROM node:18.17.0-buster as intermediate

# installation required packages
RUN apt-get update && apt-get install -y ssh git python python3 build-essential

RUN mkdir -p /src

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", "/src/"]
WORKDIR /src
RUN npm install
# RUN npm install --only=production --force

COPY ./src /src

RUN ls -lhs /src

# copy just the package form the previous image
FROM node:18.17.0-buster
COPY --from=intermediate /src /src
