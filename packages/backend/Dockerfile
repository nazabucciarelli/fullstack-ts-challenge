# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

COPY ./package.json .
COPY ./packages/backend/package.json ./packages/backend/
COPY ./packages/shared/package.json ./packages/shared/

RUN npm install

COPY ./packages/backend ./packages/backend
COPY ./packages/shared ./packages/shared

RUN npm run build --workspace=@challenge/shared & npm run build --workspace=@challenge/backend

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json .

COPY --from=builder /app/packages/shared/dist ./node_modules/@challenge/shared

EXPOSE 3000

CMD ["node", "dist/server.js"]
