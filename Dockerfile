FROM node:latest
MAINTAINER ruiming <ruiming.zhuang@gmail.com>

WORKDIR /rss
COPY . /rss/
RUN yarn install
RUN yarn run build
EXPOSE 80
EXPOSE 443
ENTRYPOINT node server.js
