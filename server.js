// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    // Ajoutez autant de photos que nécessaire
];
app.use(cookieParser());

// Route pour gérer les requêtes AJAX
app.get('/get-photo', (req, res) => {
    let viewedPhotos = req.cookies.viewedPhotos ? JSON.parse(req.cookies.viewedPhotos) : [];

    // Filtrer les photos non encore vues par le client
    let availablePhotos = photos.filter(photo => !viewedPhotos.includes(photo));

    if (availablePhotos.length === 0) {
        // Si toutes les photos ont été vues, réinitialiser la liste
        viewedPhotos = [];
        availablePhotos = photos;
    }

    // Sélectionner une nouvelle photo aléatoire
    const newPhoto = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];

    // Ajouter la nouvelle photo à la liste des vues
    viewedPhotos.push(newPhoto);

    // Mettre à jour le cookie sans définir maxAge ou expires pour créer un cookie de session
    res.cookie('viewedPhotos', JSON.stringify(viewedPhotos), { 
        httpOnly: true, 
        secure: true 
    });

    // Envoyer la nouvelle photo
    res.json({ photo: newPhoto });
});



// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Importez le module mysql ou mysql2
const mysql = require('mysql2'); // ou utilisez 'mysql2' si vous avez installé mysql2

// Créez une connexion à la base de données
const connection = mysql.createConnection({
    host: 'localhost', // Adresse de l'hôte, habituellement 'localhost' pour XAMPP
    user: 'root',      // Nom d'utilisateur MySQL, 'root' par défaut pour XAMPP
    password: '',      // Mot de passe MySQL, vide par défaut pour XAMPP
    database: 'test' // Remplacez par le nom de votre base de données
});

// Établissez la connexion
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion : ' + err.stack);
        return;
    }
    console.log('Connecté en tant que ID ' + connection.threadId);
});

// Exemple de requête pour vérifier la connexion
connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    console.log('La solution est : ', results[0].solution);
});

// Fermez la connexion
connection.end();