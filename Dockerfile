# ─── Étape 1 : Build ───────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Copier uniquement package.json
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Générer le build de production
RUN npm run build

# ─── Étape 2 : Serveur HTTP ──────────────────────────────────────
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
