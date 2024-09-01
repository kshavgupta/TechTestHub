FROM node:latest

WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .

RUN npm run build
Expose 5555

CMD ["node", "app.js"]
