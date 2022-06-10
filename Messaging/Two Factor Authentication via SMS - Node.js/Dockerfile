FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY index.js .

EXPOSE 5000

CMD ["npm", "start"]