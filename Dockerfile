FROM node:14.17-alpine3.14
ENV NODE_ENV=production

ENV AUTH_TYPE=memory
ENV MIKRO_ORM_TYPE=sqlite
ENV MIKRO_ORM_DB_NAME=:memory:
ENV MIKRO_ORM_DEBUG=1

EXPOSE 5000
WORKDIR /home

COPY /node_modules/ /home/node_modules/
COPY package.json /home/
COPY yarn.lock /home/
RUN yarn install

COPY /dist/ /home/dist/
CMD node ./dist/main.js
