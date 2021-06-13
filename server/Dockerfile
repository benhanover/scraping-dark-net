FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV PORT=3001

ENV MONGO_URI=mongodb://mongo:27017/insight

COPY . .

CMD ["node", "index.js"]
