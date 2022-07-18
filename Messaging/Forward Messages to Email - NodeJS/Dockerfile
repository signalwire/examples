FROM node:16

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY index.js .

EXPOSE 3000

CMD ["npm", "start"]