# Emotion Detector

Projet réalisé dans le cadre de la formation [Développeur·se Data IA](https://simplon.co/formation/ecole-ia-microsoft/23).

Cette application permet de faire ressortir les émotions d'avis clients ou bien de texte brut.  
À partir d'une interface web, l'utilisateur copie l'URL de la page de commentaire d'un produit ou service (pour le moment, seul *Amazon* et *Airbnb* sont disponibles). Le site en question est **scrapé** pour récupérer les avis qui sont ensuite soumis à un algorithme d'Intelligence Artificielle qui retourne les émotions détectées.

## Exécution
Téléchargez le projet puis dézippez le.  
Ou bien clonez le :   
```git clone https://github.com/FredCar/emotion_detector.git```  

Éditez le fichier ```docker-compose.yml``` et modifiez les paramètres de la base de données  

Depuis un terminal, rendez-vous dans le dossier du projet puis :  
```docker-compose up```

    Le premier lancement peut prendre un certain temps !   

Trois conteneurs Docker vont se lancer :   

- **Un conteneur hébergera l'API**.   
Au cœur de l'application, elle est chargée de traiter les données, de les enregistrer dans la base et de les retourner au client. Cette API est construite avec **Flask**.  

- **Un autre conteneur contiendra la base de donnée**.    
Une base de donnée relationnelle **MariaDB**.  

- **Le dernier conteneur démarre le site**.   
Réalisé avec **React** et accessible à l'adresse : [```localhost:5010```](localhost:5000).