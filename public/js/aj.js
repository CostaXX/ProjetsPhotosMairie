// ancienne methode
// let req = new XMLHttpRequest();
// // Grâce à la méthode open on peut indiquer la méthode de requête GET
// // Cette méthode de requête permet de recevoir des données d’un serveur
// // Nous indiquons également l’URL à utiliser
// req.open('GET', 'http://localhost:3000/');
// // Cette évènement est déclenché lorsque la requête se termine correctement
// req.addEventListener('load', function () {
//     if (req.status >= 200 && req.status < 400) {

//         console.log(this.responseText);

//     } else {

//         console.error(req.status + " " + req.statusText);

//     }
// });

// // Méthode obligatoire qui envoie la requête
// req.send();

