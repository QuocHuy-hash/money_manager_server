FROM node:20 AS builder
WORKDIR /src
COPY package*.json ./
# RUN npm install && npm install pm2 -g
RUN npm install 
COPY . .
EXPOSE 3056
CMD [ "npm", "start" , "npm start"]