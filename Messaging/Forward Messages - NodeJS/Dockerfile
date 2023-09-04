FROM node:latest

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY index.js .

CMD ["npm", "start"]