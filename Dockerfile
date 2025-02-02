FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn

COPY . .

COPY .env.example .env

RUN yarn build

EXPOSE 3333

CMD ["yarn", "start:prod"]
