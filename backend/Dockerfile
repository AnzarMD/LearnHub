FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN mkdir -p uploads/notes uploads/assignments uploads/avatars uploads/submissions
EXPOSE 8000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
