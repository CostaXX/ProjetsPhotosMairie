class photos {
    constructor(nom,lieux,source,annee,periode){
        this.nom = nom,
        this.lieux = lieux,
        this.annee = annee
        this.source = source
        this.periode = periode
    }
}
let poto1 = new photos('sfgd','lac','img/Hiver_2019/IMG_1647.jpg',2022,'hiver');
let poto2 = new photos('sfgd','rue','img/Hiver_2019/IMG_1648.jpg',2023,'printemps');
let poto3 = new photos('sfgd','quartierChic','img/Hiver_2019/IMG_1649.jpg',2021,'ete');
let poto5 = new photos('sfgd','lac','img/Hiver_2019/IMG_1650.jpg',2022,'automne');
let poto6 = new photos('sfgd','rue','img/Hiver_2019/IMG_1646.jpg',2021,'printemps');
let poto9 = new photos('sfgd','quartierChic','img/Hiver_2019/IMGP4457.JPG',2023,'printemps');
let poto10 = new photos('sfgd','quartierChic','img/Hiver_2019/IMGP4457.JPG',2021,'printemps');
let lesPhotos = [poto1,poto2,poto3,poto5,poto6,poto9,poto10];
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
boutonAfficherTout.addEventListener('click',() => {
    fixeSection.style.display = 'flex';
    fixeSection.classList.toggle('animRegeneration')
    while (dynamicLieu.firstChild) {
        dynamicLieu.removeChild(dynamicLieu.firstChild);
    }
    let TableauAnnee = [2021,2022,2023];
    let nvAnnee = document.createElement("div");
    let titre = document.createElement('h3');
    let img = document.createElement('div');
    let imageEnClair = document.createElement('img');
    lesPhotos = lesPhotos;
    
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
});

lesPhotos = lesPhotos
boutonValide.addEventListener('click',()=>{
    fixeSection.style.display = 'flex';
    fixeSection.classList.toggle('animRegeneration')
    while (dynamicLieu.firstChild) {
        dynamicLieu.removeChild(dynamicLieu.firstChild);
    }
    lesPhotos = [poto1,poto2,poto3,poto5,poto6,poto9,poto10];
    lesPhotosChoisis.length = 0;
    menuTrie.style.display = 'none';
    ValeurAnnee = datePhoto.value;
    ValeurLieu = lieuPhoto.value;
    ValeurPeriode = periodePhoto.value;
    if( ValeurAnnee.length != 0 && ValeurLieu.length != 0 && ValeurPeriode.length != 0){
        for(let i = 0;i < lesPhotos.length;i++){
            if(lesPhotos[i].annee == ValeurAnnee && lesPhotos[i].lieux == ValeurLieu && lesPhotos[i].periode == ValeurPeriode){
                lesPhotosChoisis.push(lesPhotos[i]);
            }
        }
    }else if(ValeurAnnee.length == 0 && ValeurLieu.length == 0 && ValeurPeriode.length == 0){
        lesPhotosChoisis = lesPhotos
    }else{
        if(ValeurAnnee.length == 0 && ValeurLieu.length == 0 && ValeurPeriode.length != 0){
            for(let i = 0;i < lesPhotos.length;i++){
                if(lesPhotos[i].periode == ValeurPeriode){
                    lesPhotosChoisis.push(lesPhotos[i]);
                }
            }
        }else if(ValeurAnnee.length == 0 && ValeurLieu.length != 0 && ValeurPeriode.length == 0){
            for(let i = 0;i < lesPhotos.length;i++){
                if(lesPhotos[i].lieux == ValeurLieu){
                    lesPhotosChoisis.push(lesPhotos[i]);
                }
            }
        }else if(ValeurAnnee.length == 0 && ValeurLieu.length != 0 && ValeurPeriode.length != 0){
            for(let i = 0;i < lesPhotos.length;i++){
                if(lesPhotos[i].lieux == ValeurLieu && lesPhotos[i].periode == ValeurPeriode){
                    lesPhotosChoisis.push(lesPhotos[i]);
                }
            }
        }else if(ValeurAnnee.length != 0 && ValeurLieu.length == 0 && ValeurPeriode.length == 0){
            for(let i = 0;i < lesPhotos.length;i++){
                if(lesPhotos[i].annee == ValeurAnnee){
                    lesPhotosChoisis.push(lesPhotos[i]);
                }
            }
        }else if(ValeurAnnee.length != 0 && ValeurLieu.length == 0 && ValeurPeriode.length != 0){
            for(let i = 0;i < lesPhotos.length;i++){
                if(lesPhotos[i].annee == ValeurAnnee && lesPhotos[i].periode == ValeurPeriode){
                    lesPhotosChoisis.push(lesPhotos[i]);
                }
            }
        }else if(ValeurAnnee.length != 0 && ValeurLieu.length != 0 && ValeurPeriode.length == 0){
            for(let i = 0;i < lesPhotos.length;i++){
                if(lesPhotos[i].annee == ValeurAnnee && lesPhotos[i].lieux == ValeurLieu){
                    lesPhotosChoisis.push(lesPhotos[i]);
                }
            }
        }
    }
    let TableauAnnee = [];
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
});