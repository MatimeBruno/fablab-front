# Stage 1
FROM node:latest as build-stage
WORKDIR /fablab-front
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build
# Stage 2
FROM nginx:1.23.1-alpine
COPY --from=build-stage /fablab-front/build /usr/share/nginx/html
EXPOSE 8080
CMD nginx -g 'daemon off;'
