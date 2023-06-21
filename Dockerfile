FROM node:18.5.0-alpine3.16 as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .

ENV NODE_ENV production
ENV NODE_OPTIONS --openssl-legacy-provider

RUN npm run build -- --modern

FROM nginx:1.23.4 as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY docker/nginx.conf /etc/nginx/nginx.conf

# add new entrypoint 
COPY docker/entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
