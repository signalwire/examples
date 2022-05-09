FROM node:alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY src/index.js ./src/index.js
COPY src/frontend ./src/frontend

CMD [ "npm", "start" ]