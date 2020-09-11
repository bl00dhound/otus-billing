FROM node:10-alpine
WORKDIR /app

COPY *.json ./
RUN npm install

COPY logs logs/
COPY src src/

RUN npm run build

EXPOSE 8002
ENTRYPOINT [ "npm", "start" ]