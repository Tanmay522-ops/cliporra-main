FROM node:18-alpine

WORKDIR /app

COPY server/package.json ./
RUN npm install --include=dev

COPY server/ .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]