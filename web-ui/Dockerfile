FROM node:lts AS build

WORKDIR /app

COPY ./src /app/src/
COPY ./index.html ./.env /app/
COPY ./package.json ./tsconfig.json ./tsconfig.app.json ./tsconfig.node.json ./vite.config.ts /app/

RUN npm i -g typescript
RUN npm i
RUN npm run build

EXPOSE 5000

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
