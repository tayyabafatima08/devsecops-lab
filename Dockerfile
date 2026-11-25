FROM node:26-alpine
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY src ./src
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "server.js"]