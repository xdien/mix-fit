FROM node:lts AS dist
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build:prod

FROM node:lts AS node_modules
COPY package.json yarn.lock ./

RUN yarn install --prod

FROM node:lts

ARG PORT=3000

ENV NODE_ENV=production

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Copy the built application and i18n directory from the dist stage
COPY --from=dist dist /usr/src/app/dist
COPY --from=dist src/i18n /usr/src/app/dist/i18n

# Copy the node_modules from the node_modules stage
COPY --from=node_modules node_modules /usr/src/app/node_modules

# Copy the rest of the application code
COPY . /usr/src/app

EXPOSE $PORT

CMD [ "yarn", "start:prod" ]