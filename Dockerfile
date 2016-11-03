FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production

EXPOSE 6666

CMD ["pm2", "start", "production.json"]
