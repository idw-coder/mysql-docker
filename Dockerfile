FROM node:18

WORKDIR /app

RUN npm install -g express-generator

EXPOSE 3000

CMD ["npm", "start"]