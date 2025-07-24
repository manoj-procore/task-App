# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /task-ui 

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build 

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /task-ui/dist /usr/share/nginx/html

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]
