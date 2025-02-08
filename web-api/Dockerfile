FROM node:lts AS build

WORKDIR /app

RUN apt-get update -y
RUN apt-get install ffmpeg -y

COPY ./src/ /app/src/
COPY ./package.json ./nest-cli.json ./tsconfig.build.json ./tsconfig.json /app/

RUN npm i -g typescript
RUN npm i -g @nestjs/cli
RUN npm i
RUN nest build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

