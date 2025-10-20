# Stage 1: Build the Vue application
FROM node:18-alpine AS builder

WORKDIR /app

COPY ./package.json .
COPY ./packages/frontend/package.json ./packages/frontend/
COPY ./packages/shared/package.json ./packages/shared/

RUN npm install

COPY ./packages/frontend ./packages/frontend
COPY ./packages/shared ./packages/shared

RUN npm run build --workspace=@challenge/frontend

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY ./packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
