# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1. Copier package.json et installer (afin de profiter du cache Docker)
COPY package.json ./
RUN npm install --production

# 2. Copier le schéma Prisma et générer le client + push de la base
COPY prisma ./prisma
RUN npx prisma generate \
 && npx prisma db push

# 3. Copier le code source de l'API
COPY src ./src

EXPOSE 4000
CMD ["npm", "start"]
