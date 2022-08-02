FROM node:alpine

WORKDIR /app

COPY  package*.json ./

RUN yarn

COPY . . 

# FROM base as production 

# ENV NODE_ENV=production

RUN yarn run build

CMD yarn run dev