// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const mysql = require('mysql2'); // ou utilisez 'mysql2' si vous avez installé mysql2

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',      
    password: '',      
    database: 'photos', 
    waitForConnections: true,
    connectionLimit: 10, // Limite le nombre de connexions simultanées
    queueLimit: 0
});

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

app.use(cookieParser());

// Route pour gérer les requêtes AJAX
app.get('/get-photo', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion : ' + err.stack);
            return res.status(500).send('Erreur de connexion à la base de données');
        }

        connection.query('SELECT chemin FROM photo', (error, results) => {
            connection.release(); // Toujours libérer la connexion après utilisation

            if (error) {
                console.error('Erreur lors de la requête : ' + error.stack);
                return res.status(500).send('Erreur lors de l\'exécution de la requête');
            }

            const lesPhotosDeBDD = results.map(result => result.chemin);
            console.log(lesPhotosDeBDD);

            res.json(lesPhotosDeBDD);
        });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});