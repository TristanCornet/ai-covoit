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

# Exposer le port 3000
EXPOSE 3000

# Définir la commande de démarrage de l'application
CMD ["npm", "run", "start:dev"]