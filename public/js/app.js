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
let datePhoto = document.getElementById('datePhoto');
let periodePhoto = document.getElementById('periodePhoto');
let lieuPhoto = document.getElementById('lieuPhoto');
let fixeSection = document.getElementById('SectionRegeneration');
let ValeurLieu = '';
let ValeurPeriode = '';
let ValeurAnnee = '';
const repApiTrieElement = fetch('/api/trie').then(response => response.json());
// const rep = fetch('/get-photo-trier').then(response => response.json());
function AfficherImage(){

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
                let saisonImage = document.createElement('p');
                saisonImage.textContent = "Saison : "+lesPhotosChoisis[j].periode
                imageEnClair.src = lesPhotosChoisis[j].source;
                imageEnClair.loading = "lazy"
                descriptionImage.appendChild(saisonImage);
                descriptionImage.appendChild(categorieImage);
                surImage.appendChild(imageEnClair);
                img.appendChild(surImage);
                surImage.appendChild(descriptionImage);
            }
        }
        nvAnnee.appendChild(titre);
        nvAnnee.appendChild(img);
        dynamicLieu.appendChild(nvAnnee);
        dynamicLieu.scrollIntoView({behavior: 'smooth'});
    }
    lesPhotosChoisis = [];
}

document.addEventListener('DOMContentLoaded', () => {
    
    repApiTrieElement.then(data => {
            let categDate = document.getElementById('datePhoto')
            let lesDates;
            for(let i = 0;i < data.dates.length;i++){
                lesDates = document.createElement('option');
                lesDates.textContent = data.dates[i];
                lesDates.value = data.dates[i];
                categDate.appendChild(lesDates);
            }
            let categPeriode = document.getElementById('periodePhoto')
            let lesPeriodes;
            for(let i = 0;i < data.periodes.length;i++){
                lesPeriodes = document.createElement('option');
                lesPeriodes.textContent = data.periodes[i];
                lesPeriodes.value = data.periodes[i];
                categPeriode.appendChild(lesPeriodes);
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
        ValeurPeriode = "";

        const formData = {
            annee : ValeurAnnee,
            lieu : ValeurLieu,
            periode : ValeurPeriode
        }
        
        fetch('/get-photo-trier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            for(let i = 0;i < data.length;i++){
                const photo = new photos(data[i].id , data[i].lieu , data[i].chemin, data[i].date, data[i].periode);
                lesPhotosChoisis.push(photo)
            }
            console.log('Succès:', data);
            for (let i = 0; i < lesPhotosChoisis.length; i++) {
                AfficherImage(lesPhotosChoisis[i])
                        
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
    
    })
    boutonQuitte.addEventListener('click',()=>{
        menuTrie.style.display = 'none';
    });
    boutonTrie.addEventListener('click',()=>{
        menuTrie.style.display = 'flex';
    });
    

    boutonValide.addEventListener('click',()=>{
        while (dynamicLieu.firstChild) {
            dynamicLieu.removeChild(dynamicLieu.firstChild);
        }
        
        menuTrie.style.display = 'none';

        ValeurAnnee = datePhoto.value;
        ValeurLieu = lieuPhoto.value;
        ValeurPeriode = periodePhoto.value;

        const formData = {
            annee : ValeurAnnee,
            lieu : ValeurLieu,
            periode : ValeurPeriode
        }
        console.log(ValeurAnnee);
        console.log(ValeurLieu);
        console.log(ValeurPeriode);
        console.log(formData);
        fetch('/get-photo-trier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            for(let i = 0;i < data.length;i++){
                const photo = new photos(data[i].id , data[i].lieu , data[i].chemin, data[i].date, data[i].periode);
                lesPhotosChoisis.push(photo)
            }
            console.log('Succès:', data);
            for (let i = 0; i < lesPhotosChoisis.length; i++) {
                AfficherImage()
                        
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
    });
});