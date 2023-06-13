FROM node:16

WORKDIR /app

COPY packahe*.json .

RUN npm install

COPY . .

CMD node index.js