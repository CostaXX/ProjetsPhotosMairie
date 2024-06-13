class photos {
    constructor(id,lieux,source,annee,periode){
        this.id = id,
        this.lieux = lieux,
        this.annee = annee
        this.source = source
        this.periode = periode
    }
}

// let lesPhotos = [poto1,poto2,poto3,poto5,poto6,poto9,poto10];
let lesPhotosChoisis = [];
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
function AfficherImage(photo){

    console.log(photo);
    console.log("ID de la photo :", photo.id);
    console.log("Lieux de la photo :", photo.lieux);
    console.log("Source de la photo :", photo.source);
    console.log("Année de la photo :", photo.annee);
    console.log("Période de la photo :", photo.periode);let TableauAnnee = [];
    let nvAnnee = document.createElement("div");
    let titre = document.createElement('h3');
    let img = document.createElement('div');
    let imageEnClair = document.createElement('img');
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
                surImage = document.createElement('div')
                imageEnClair.src = lesPhotosChoisis[j].source;
                surImage.appendChild(imageEnClair)
                img.appendChild(surImage)
            }
        }
        nvAnnee.appendChild(titre);
        nvAnnee.appendChild(img);
        dynamicLieu.appendChild(nvAnnee);
        dynamicLieu.scrollIntoView({behavior: 'smooth'})
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
        fixeSection.style.display = 'flex';
        fixeSection.classList.toggle('animRegeneration')
        while (dynamicLieu.firstChild) {
            dynamicLieu.removeChild(dynamicLieu.firstChild);
        }
        rep.then(data =>{
            let nvAnnee = document.createElement("div");
            let titre = document.createElement('h3');
            let img = document.createElement('div');
            let imageEnClair = document.createElement('img');
            lesPhotos = lesPhotos;
            let TableauAnnee = data.dates;
            console.log(TableauAnnee);
            for(let i = 0;i < TableauAnnee.length;i++){
                nvAnnee = document.createElement("div");
                titre = document.createElement('h3');
                titre.textContent = TableauAnnee[i];
                img = document.createElement('div');
                img.className = "lesImages";
                nvAnnee.className = "lesAnnee";
                
                for(let j = 0;j < lesPhotos.length;j++){
                    if(lesPhotos[j].annee == TableauAnnee[i]){        
                        imageEnClair = document.createElement('img');
                        surImage = document.createElement('div');
                        imageEnClair.src = lesPhotos[j].source;
                        surImage.appendChild(imageEnClair)
                        img.appendChild(surImage)
                    }
                }
                nvAnnee.appendChild(titre);
                nvAnnee.appendChild(img);
                dynamicLieu.appendChild(nvAnnee);
                dynamicLieu.scrollIntoView({behavior: 'smooth'})
            }
        });
    
    })
    boutonQuitte.addEventListener('click',()=>{
        menuTrie.style.display = 'none';
    });
    boutonTrie.addEventListener('click',()=>{
        menuTrie.style.display = 'flex';
    });
    
    document.getElementById('ajaxButton').addEventListener('click', function() {
        fetch('/get-photo')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La requête a échoué avec le statut ' + response.status);
                }
                return response.json();
            }).then(data => {
                // Traiter les données ici
                console.log(data);
            })
            console.log('cest cliqué');
            console.log(lesPhotosChoisis);
    });
    
    // lesPhotos = lesPhotos
    boutonValide.addEventListener('click',()=>{
        fixeSection.style.display = 'flex';
        fixeSection.classList.toggle('animRegeneration')
        while (dynamicLieu.firstChild) {
            dynamicLieu.removeChild(dynamicLieu.firstChild);
        }
        // lesPhotos = [];
        // lesPhotosChoisis.length = 0;
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
                AfficherImage(lesPhotosChoisis[i])
                        
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
        
        // let TableauAnnee = [];
        // let nvAnnee = document.createElement("div");
        // let titre = document.createElement('h3');
        // let img = document.createElement('div');
        // let imageEnClair = document.createElement('img');
        // for(let i = 0; i < lesPhotosChoisis.length; i++){
        //     TableauAnnee.push(lesPhotosChoisis[i].annee);
        // }
        // TableauAnnee = [...new Set(TableauAnnee)];
        // TableauAnnee = TableauAnnee.sort((a, b) => a - b);
        // for(let i = 0;i < TableauAnnee.length;i++){
        //     nvAnnee = document.createElement("div");
        //     titre = document.createElement('h3');
        //     titre.textContent = TableauAnnee[i];
        //     img = document.createElement('div');
        //     surImage = document.createElement('div')
        //     img.className = "lesImages";
        //     nvAnnee.className = "lesAnnee";
        //     for(let j = 0;j < lesPhotosChoisis.length;j++){
        //         if(lesPhotosChoisis[j].annee == TableauAnnee[i]){      
        //             imageEnClair = document.createElement('img');
        //             surImage = document.createElement('div')
        //             imageEnClair.src = lesPhotosChoisis[j].source;
        //             surImage.appendChild(imageEnClair)
        //             img.appendChild(surImage)
        //         }
        //     }
        //     nvAnnee.appendChild(titre);
        //     nvAnnee.appendChild(img);
        //     dynamicLieu.appendChild(nvAnnee);
        //     dynamicLieu.scrollIntoView({behavior: 'smooth'})
        // }
    });
});