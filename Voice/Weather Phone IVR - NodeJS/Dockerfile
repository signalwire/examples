FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN npm install

# Bundle app source
COPY . .

# Start app
CMD [ "node", "index.js" ]