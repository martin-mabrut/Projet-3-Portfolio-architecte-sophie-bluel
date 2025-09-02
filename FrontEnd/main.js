async function main() {
  const reponse = await fetch('http://localhost:5678/api/works');
  const projets = await reponse.json(); 
  console.log(projets); 

  const gallery = document.querySelector('.gallery');   

  //Réinitialisation de la gallerie//

  let affichageGallerie = document.querySelector('.gallery');
  affichageGallerie.textContent = '';

  //Création des boutons filtres// 

  const filtres = document.querySelector('.filtres');
const labels = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];

for (let i = 0; i < labels.length; i++) {
  const btn = document.createElement('button');
  btn.textContent = labels[i];
  filtres.appendChild(btn);
}

//******//

  //Affichage des projets à partir des données provenant de l'API//

function afficherProjets (listeFiltree) {for (let i = 0; i < listeFiltree.length; i++) {
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = listeFiltree[i].imageUrl;
  img.alt = listeFiltree[i].title;
  
  const caption = document.createElement('figcaption');
  caption.textContent = listeFiltree[i].title;
  
  fig.appendChild(img);
  fig.appendChild(caption);
  gallery.appendChild(fig);
}
}

afficherProjets (projets);

/***** Activation du bouton "Tous" dès le chargement de la page *****/

document.querySelectorAll('.filtres button').forEach(btn => {
  if (btn.textContent.trim() === 'Tous') btn.classList.add('btnFiltreActif');
});

//*******//

//Filtrage//

document.querySelector('.filtres').addEventListener('click', e => {
  if (e.target.textContent === 'Tous') {
    document.querySelectorAll('.filtres button').forEach(btn => btn.classList.remove('btnFiltreActif'));
    e.target.classList.add('btnFiltreActif');

    affichageGallerie.textContent = '';
    afficherProjets (projets); 
  }

  if (e.target.textContent === 'Objets') {
    document.querySelectorAll('.filtres button').forEach(btn => btn.classList.remove('btnFiltreActif'));
    e.target.classList.add('btnFiltreActif');

    const objets = projets.filter(p => p.category.name === 'Objets');
    affichageGallerie.textContent = '';
    afficherProjets (objets); 
  }

  if (e.target.textContent === 'Appartements') {
    document.querySelectorAll('.filtres button').forEach(btn => btn.classList.remove('btnFiltreActif'));
    e.target.classList.add('btnFiltreActif');

    const appartements = projets.filter(p => p.category.name === 'Appartements');
    affichageGallerie.textContent = '';
    afficherProjets (appartements); 
  }

  if (e.target.textContent === 'Hotels & restaurants') {
    document.querySelectorAll('.filtres button').forEach(btn => btn.classList.remove('btnFiltreActif'));
    e.target.classList.add('btnFiltreActif');

    const hotelsRestaurants = projets.filter(p => p.category.name === 'Hotels & restaurants');
    affichageGallerie.textContent = '';
    afficherProjets (hotelsRestaurants); 
  }

});

const params = new URLSearchParams(window.location.search);
const hasEditParam = params.get('mode') === 'edit';
const hasToken = !!localStorage.getItem('token');

if (hasEditParam && hasToken) {
  initEditMode();
}

function initEditMode() {
  console.log('Mode édition activé ✅');
  const headerEdit = document.createElement("p");
  headerEdit.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> Mode édition </span>`
  headerEdit.classList.add("headerEdit")
  
  const header = document.querySelector("header");
  header.appendChild(headerEdit);

  const listeNav = document.querySelector("header ul")
  listeNav.innerHTML =
    `<li>projets</li>
			<li>contact</li>
			<li><a href="index.html">logout</a></li>
			<li><img src="./assets/icons/instagram.png" alt="Instagram"></li>`;

  const btnModif = document.createElement("p");
  btnModif.innerHTML = `<a href="#"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`;
  btnModif.classList.add("btnModif");
  
  const titleProjectsEdit = document.querySelector(".titleProjectsEdit");
  titleProjectsEdit.appendChild(btnModif);

  const filtres = document.querySelector('.filtres');
  filtres.innerHTML = ``;

}

}

main();