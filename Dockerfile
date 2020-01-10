FROM node:12.13.0-alpine

ARG API_BASE_URL
ARG FRONTEND_PUBLIC_PATH=/

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

ENV API_BASE_URL=$API_BASE_URL
ENV FRONTEND_PUBLIC_PATH=$FRONTEND_PUBLIC_PATH

EXPOSE 8080
CMD [ "http-server", "dist" ]
