# Utiliser l'image de base node:20-alpine
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port 5173
EXPOSE 5173

# Définir la commande de démarrage de l'application
CMD ["npm", "run", "dev"]