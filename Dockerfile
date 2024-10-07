# Use the official Node.js image as the base image
FROM node:18 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3056
CMD ["node", "src/app.js"]