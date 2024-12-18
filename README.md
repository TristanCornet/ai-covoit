# AI Covoit

## Description

Ce projet est une API pour l'application web AI Covoit qui permet de gérer l'authentification, les réservations, les trajets et les utilisateurs. Le projet inclut également des tests unitaires et end-to-end pour assurer la qualité du code.

## Prérequis

- [Docker](https://www.docker.com/)

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/TristanCornet/ai-covoit.git
cd ai-covoit
```

## Lancer le projet

1. Démarrez les conteneurs Docker avec la commande suivante :

```bash
docker compose up --build
```

## Accéder aux services

Une fois les conteneurs lancés, vous pouvez accéder aux différents services aux adresses suivantes :

- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Adminer** : [http://localhost:8080](http://localhost:8080)
- **Swagger** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
