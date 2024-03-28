FROM node:latest

WORKDIR /Homework4

COPY ./package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]