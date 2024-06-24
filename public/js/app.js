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
const dynamicLieu = document.getElementById('champDynamique');
const boutonTrie = document.getElementById('btnTrie');
const menuTrie = document.getElementById('MenuTrie');
const boutonQuitte = document.getElementById('QuitBtn');
const boutonAfficherTout = document.getElementById('btnAll');
const boutonValide = document.getElementById('btnValiderTrie');
const datePhotoPrec = document.getElementById('datePhotoPrec');
const datePhotoSuiv = document.getElementById('datePhotoSuiv');
const periodePhoto = document.getElementById('periodePhoto');
const lieuPhoto = document.getElementById('lieuPhoto');
const fixeSection = document.getElementById('SectionRegeneration');
let ValeurLieu = '';
let ValeurPeriode = '';
let ValeurAnneePrec = '';
let ValeurAnneeSuiv = '';
const repApiTrieElement = fetch('/api/trie').then(response => response.json());

function waitForScrollToBottom() {
    return new Promise((resolve) => {
        function onScroll() {
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            if (scrollPosition + windowHeight >= documentHeight) {
                window.removeEventListener('scroll', onScroll);
                resolve();
            }
        }
        window.addEventListener('scroll', onScroll);
    });
}


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

async function AfficherAnneeImage(){
    
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
    let iMax = 0;
    for(let i = 0;i < TableauAnnee.length;i++){
        nvAnnee = document.createElement("div");
        titre = document.createElement('h3');
        titre.textContent = TableauAnnee[i];
        img = document.createElement('div');
        surImage = document.createElement('div')
        img.className = "lesImages";
        nvAnnee.className = "lesAnnee";
        dynamicLieu.appendChild(nvAnnee);
        nvAnnee.appendChild(titre);
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
                nvAnnee.appendChild(img);
                iMax++;
                if(iMax == 10){
                    await waitForScrollToBottom();
                    iMax = 0
                }
            } 
        }
    }
    // lesPhotosChoisis = [];
}

document.addEventListener('DOMContentLoaded', () => {
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
    boutonAfficherTout.addEventListener('click',async () => {
        lesPhotosChoisis = [];
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
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
        await smoothScrollToTop();
        smoothScrollToBottom();
        AfficherAnneeImage();
    })
    

    boutonQuitte.addEventListener('click',()=>{
        menuTrie.style.display = 'none';
    });
    boutonTrie.addEventListener('click',()=>{
        menuTrie.style.display = 'flex';
    });
    

    boutonValide.addEventListener('click',async ()=>{
        lesPhotosChoisis = [];
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
            
            // for (let i = 0; i < lesPhotosChoisis.length; i++) {
            // }
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
        await smoothScrollToTop();
        smoothScrollToBottom();
        AfficherAnneeImage()
    });
});