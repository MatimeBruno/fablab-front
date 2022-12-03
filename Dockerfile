# Stage 1
FROM node:latest as build-stage
WORKDIR /fablab-front
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_URL=https://geniuslab.onrender.com
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build
# Stage 2
FROM nginx:1.23.1-alpine
COPY --from=build-stage /fablab-front/build /usr/share/nginx/html
CMD nginx -g 'daemon off;'
