FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18.0-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]

#  我们用的基础的 linux 镜像比较大，可以换成 alpine 的，这是一个 linux 发行版，主打的就是一个体积小。 ,一般情况下，用多阶段构建 + alpine 基础镜像。