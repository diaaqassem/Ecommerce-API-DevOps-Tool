FROM node:18

LABEL maintainer="qassemdiaa48@gmail.com"

WORKDIR /app

COPY ./Nodejs-Ecommerce-API /app

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

