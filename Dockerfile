FROM node:latest AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:alpine
WORKDIR /hdu-volume/app
COPY --from=builder /app ./
EXPOSE ${PORT}
CMD ["npm","run", "start:prod"]
