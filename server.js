// server.js
const express = require('express');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const mysql = require('mysql2'); // ou utilisez 'mysql2' si vous avez installé mysql2

const pool = mysql.createPool({
    host: '192.168.1.57', 
    user: 'root',      
    password: '',
    database: 'photos', 
    waitForConnections: true,
    connectionLimit: 10, // Limite le nombre de connexions simultanées
    queueLimit: 0
});

// Middleware pour servir les fichiers statiques
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.get('/api/trie', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion : ' + err.stack);
            return res.status(500).send('Erreur de connexion à la base de données');
        }
        
        connection.query('SELECT DISTINCT date FROM photo ORDER BY date DESC', (error, results) => {
            connection.release(); // Toujours libérer la connexion après utilisation

        if (error) {
            console.error('Erreur lors de la requête : ' + error.stack);
            return res.status(500).send('Erreur lors de l\'exécution de la requête');
        }

        const lesDate = results.map(result => result.date);
        console.log(lesDate);

        
            connection.query('SELECT DISTINCT periode FROM photo', (error, results) => {
                connection.release(); // Toujours libérer la connexion après utilisation

                if (error) {
                    console.error('Erreur lors de la requête : ' + error.stack);
                    return res.status(500).send('Erreur lors de l\'exécution de la requête');
                }

                const lesPeriode = results.map(result => result.periode);
                console.log(lesPeriode);
                connection.query('SELECT DISTINCT lieu FROM photo', (error, results) => {
                    connection.release(); // Toujours libérer la connexion après utilisation
    
                    if (error) {
                        console.error('Erreur lors de la requête : ' + error.stack);
                        return res.status(500).send('Erreur lors de l\'exécution de la requête');
                    }
    
                    const lesLieux = results.map(result => result.lieu);
                    console.log(lesLieux);
                    res.json({ dates: lesDate, periodes: lesPeriode, lieux: lesLieux });
                });
            });
        });

        
        
    });
});

app.post('/get-photo-trier', (req, res) => {
    console.log(req.body);
    const { anneeDebut,anneeFin ,lieu } = req.body;
    console.log('Année debut:', anneeDebut);
    console.log('Année fin', anneeFin);
    console.log('Lieu:', lieu);

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion : ' + err.stack);
            return res.status(500).send('Erreur de connexion à la base de données');
        }

        let query = 'SELECT * FROM photo';
        const conditions = [];

        if (anneeDebut && anneeFin) {
            conditions.push(`date BETWEEN ${connection.escape(anneeDebut)} AND ${connection.escape(anneeFin)}`);
        }else if(anneeDebut && !anneeFin){
            conditions.push(`date = ${connection.escape(anneeDebut)}`)
        }else if(!anneeDebut && anneeFin){
            conditions.push(`date = ${connection.escape(anneeFin)}`)
        }else if(!anneeDebut && !anneeFin){

        }
        
        if (lieu) {
            conditions.push(`lieu = ${connection.escape(lieu)}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query+= ' ORDER BY date ASC'

        console.log('SQL Query:', query);

        connection.query(query, (error, results) => {
            connection.release(); // Toujours libérer la connexion après utilisation
            if (error) {
                console.error('Erreur lors de la requête : ' + error.stack);
                return res.status(500).send('Erreur lors de l\'exécution de la requête');
            }

            const lesPhotosDeBDD = results.map(result => result);
            // console.log(lesPhotosDeBDD);

            res.json(lesPhotosDeBDD);
        });
    });
});

// Route pour gérer les requêtes AJAX
app.get('/get-photo', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion : ' + err.stack);
            return res.status(500).send('Erreur de connexion à la base de données');
        }

        connection.query('SELECT * FROM photo LIMIT 100', (error, results) => {
            connection.release(); // Toujours libérer la connexion après utilisation

            if (error) {
                console.error('Erreur lors de la requête : ' + error.stack);
                return res.status(500).send('Erreur lors de l\'exécution de la requête');
            }

            const lesPhotosDeBDD = results.map(result => result);
            console.log(lesPhotosDeBDD);

            res.json(lesPhotosDeBDD);
        });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});