class photos {
    constructor(id,lieux,source,annee,periode){
        this.id = id,
        this.lieux = lieux,
        this.annee = annee
        this.source = source
        this.periode = periode
    }
}

let lesPhotosChoisis = [];
let photosAfficher;
let dynamicLieu = document.getElementById('champDynamique');
let boutonTrie = document.getElementById('btnTrie');
let menuTrie = document.getElementById('MenuTrie');
let boutonQuitte = document.getElementById('QuitBtn');
let boutonAfficherTout = document.getElementById('btnAll');
let boutonValide = document.getElementById('btnValiderTrie');
let datePhotoPrec = document.getElementById('datePhotoPrec');
let datePhotoSuiv = document.getElementById('datePhotoSuiv');
let periodePhoto = document.getElementById('periodePhoto');
let lieuPhoto = document.getElementById('lieuPhoto');
let fixeSection = document.getElementById('SectionRegeneration');
let ValeurLieu = '';
let ValeurPeriode = '';
let ValeurAnneePrec = '';
let ValeurAnneeSuiv = '';
const repApiTrieElement = fetch('/api/trie').then(response => response.json());

function smoothScrollToTop() {
    return new Promise((resolve) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(resolve, 300); 
    });
}

function smoothScrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

function AfficherImage(){

}

function AfficherAnneeImage(){
    
    let TableauAnnee = [];
    let nvAnnee = document.createElement("div");
    let titre = document.createElement('h3');
    let img = document.createElement('div');
    let imageEnClair = document.createElement('img');
    let descriptionImage = document.createElement('div');
    for(let i = 0; i < lesPhotosChoisis.length; i++){
        TableauAnnee.push(lesPhotosChoisis[i].annee);
    }
    TableauAnnee = [...new Set(TableauAnnee)];
    TableauAnnee = TableauAnnee.sort((a, b) => a - b);
    for(let i = 0;i < TableauAnnee.length;i++){
        
        nvAnnee = document.createElement("div");
        titre = document.createElement('h3');
        titre.textContent = TableauAnnee[i];
        img = document.createElement('div');
        surImage = document.createElement('div')
        img.className = "lesImages";
        nvAnnee.className = "lesAnnee";
        for(let j = 0;j < lesPhotosChoisis.length;j++){
            if(lesPhotosChoisis[j].annee == TableauAnnee[i]){      
                imageEnClair = document.createElement('img');
                surImage = document.createElement('div');
                descriptionImage = document.createElement('section');
                descriptionImage.className = "uneImage";
                let categorieImage = document.createElement('p');
                categorieImage.textContent ="Catégorie : " +lesPhotosChoisis[j].lieux;
                imageEnClair.src = lesPhotosChoisis[j].source;
                imageEnClair.loading = "lazy"
                descriptionImage.appendChild(categorieImage);
                surImage.appendChild(imageEnClair);
                img.appendChild(surImage);
                surImage.appendChild(descriptionImage);
                
            }
        }
        nvAnnee.appendChild(titre);
        nvAnnee.appendChild(img);
        dynamicLieu.appendChild(nvAnnee);
        
    }
    // lesPhotosChoisis = [];
}

document.addEventListener('DOMContentLoaded', () => {
    
    let lazyImagesObserver;
    // Fonction pour initialiser l'Intersection Observer
    function initIntersectionObserver() {
        const options = {
            root: null, // Utiliser le viewport du navigateur comme racine
            rootMargin: "0px", // Pas de marge autour de la racine
            threshold: 0.1 // Appeler le callback quand 10% de l'image est visible
        };

        lazyImagesObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Charger l'image
                    img.removeAttribute('src'); // Supprimer l'attribut data-src
                    observer.unobserve(img); // Arrêter d'observer cette image
                }
            });
        }, options);
    }

    initIntersectionObserver();
    repApiTrieElement.then(data => {
            let categDate = document.getElementById('datePhotoPrec')
            let lesDates;
            for(let i = 0;i < data.dates.length;i++){
                lesDates = document.createElement('option');
                lesDates.textContent = data.dates[i];
                lesDates.value = data.dates[i];
                categDate.appendChild(lesDates);
            }
            let categDateSuiv = document.getElementById('datePhotoSuiv')
            
            for(let i = 0;i < data.dates.length;i++){
                lesDates = document.createElement('option');
                lesDates.textContent = data.dates[i];
                lesDates.value = data.dates[i];
                categDateSuiv.appendChild(lesDates);
            }

            let categLieu = document.getElementById('lieuPhoto')
            let lesLieux;
            for(let i = 0;i < data.lieux.length;i++){
                lesLieux = document.createElement('option');
                lesLieux.textContent = data.lieux[i];
                lesLieux.value = data.lieux[i];
                categLieu.appendChild(lesLieux);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des dates:', error);
        });
    boutonAfficherTout.addEventListener('click',() => {
        while (dynamicLieu.firstChild) {
            dynamicLieu.removeChild(dynamicLieu.firstChild);
        }
        // lesPhotos = [];
        // lesPhotosChoisis.length = 0;
        menuTrie.style.display = 'none';

        ValeurAnnee = "";
        ValeurLieu = "";

        const formData = {
            annee : ValeurAnnee,
            lieu : ValeurLieu,
        }
        
        fetch('/get-photo-trier', {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(lesPhotosChoisis.length > 0){
                lesPhotosChoisis = []
            }
            for(let i = 0;i < data.length;i++){
                const photo = new photos(data[i].id , data[i].lieu , data[i].chemin, data[i].date, data[i].periode);
                lesPhotosChoisis.push(photo)
            }
            
            console.log(lesPhotosChoisis);
            console.log('Succès:', data);
            
                
            
            console.log(lesPhotosChoisis);
            
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
        
    })
    window.addEventListener('scroll',() => {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        if (scrollPosition + windowHeight >= documentHeight) {
            console.log('Vous êtes tout en bas de la page!');
            AfficherAnneeImage();
        }
    })

    boutonQuitte.addEventListener('click',()=>{
        menuTrie.style.display = 'none';
    });
    boutonTrie.addEventListener('click',()=>{
        menuTrie.style.display = 'flex';
    });
    

    boutonValide.addEventListener('click',async ()=>{
        while (dynamicLieu.firstChild) {
            dynamicLieu.removeChild(dynamicLieu.firstChild);
        }
        
        menuTrie.style.display = 'none';

        ValeurAnneePrec = datePhotoPrec.value;
        ValeurAnneeSuiv = datePhotoSuiv.value;
        ValeurLieu = lieuPhoto.value;
        

        const formData = {
            anneeDebut : ValeurAnneePrec,
            anneeFin : ValeurAnneeSuiv,
            lieu : ValeurLieu
        }
        console.log(ValeurAnneePrec);
        console.log(ValeurAnneeSuiv);
        console.log(ValeurLieu);
        console.log(formData);
        fetch('/get-photo-trier', {
            method: 'POST',
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(lesPhotosChoisis.length > 0){
                lesPhotosChoisis = []
            }
            for(let i = 0;i < data.length;i++){
                const photo = new photos(data[i].id , data[i].lieu , data[i].chemin, data[i].date, data[i].periode);
                lesPhotosChoisis.push(photo)
            }
            console.log('Succès:', data);
            
            // for (let i = 0; i < lesPhotosChoisis.length; i++) {
                AfficherImage()  
            // }
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
        await smoothScrollToTop();
        smoothScrollToBottom();
    });
});