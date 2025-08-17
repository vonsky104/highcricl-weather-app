FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

RUN yarn global add serve

COPY . .

RUN yarn run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]