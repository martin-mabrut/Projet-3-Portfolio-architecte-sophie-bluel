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

/***** Affichage du mode édition de la paage d'accueil *****/

const params = new URLSearchParams(window.location.search);
const hasEditParam = params.get('mode') === 'edit';
const hasToken = !!localStorage.getItem('token');

if (hasEditParam && hasToken) {
  initEditMode();
}

/*** ***/

/*** Modale ***/

  const modalContainer = document.querySelector(".modal-container");
  const modalTriggers = document.querySelectorAll(".modal-trigger");

  function toggleModal() {
    modalContainer.classList.toggle("active")
  };

  modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

/*** ***/

// Affichage des projets dans la modale

function afficherProjetsModal (projets) {for (let i = 0; i < projets.length; i++) {
  const fig = document.createElement('figure');
  fig.style.position = "relative";

  const img = document.createElement('img');
  img.src = projets[i].imageUrl;
  img.alt = projets[i].title;
  
  const btn = document.createElement('button');
    btn.innerHTML= `<i class="fa-solid fa-trash-can"></i>`; 
    btn.style.position = "absolute";
    btn.style.top = "5px";
    btn.style.right = "5px";

    // Suppression grâce au bouton poubelle. 

    btn.addEventListener('click', async () => {
      const figEl = btn.closest('figure');
      const imgEl = figEl.querySelector('img');
      const url = imgEl.getAttribute('src');

      const cible = projets.find(p => p.imageUrl === url);
      const idASupprimer = cible.id;
      console.log('ID à supprimer :', idASupprimer);

        // On récupère le token depuis le localStorage
      const token = localStorage.getItem('token');

      // On envoie la requête DELETE vers l’API
      const response = await fetch(`http://localhost:5678/api/works/${idASupprimer}`, {
      method: 'DELETE',
      headers: {
      'Authorization': `Bearer ${token}`,           // On présente le token
      'Accept': 'application/json'                  // On demande une réponse JSON (optionnel)
      }
      });

      if (response.ok) {
      figEl.remove();
      console.log(`Projet ${idASupprimer} supprimé`);

        //MAJ dynamique de index mode edit en fond

      const newReponse = await fetch('http://localhost:5678/api/works');
      const newProjets = await newReponse.json(); 
      affichageGallerie.textContent = '';
      afficherProjets(newProjets);
      }


    });
  
  fig.appendChild(img);
  fig.appendChild(btn);
  const gridModal = document.querySelector(".gridModal");
  gridModal.appendChild(fig);
  
      
}
/***** *****/

// Ajout d'une nouvelle photo

const btnAddPhoto = document.querySelector(".addPhoto");
const modal = document.querySelector(".modal");

btnAddPhoto.addEventListener('click', async () => {
  
  modal.innerHTML = 
  `<button class="close-modal modal-trigger"><i class="fa-solid fa-xmark"></i></button>
		<h1>Ajout photo</h1>

		<form id="ajoutPhotoForm">

			<label for="title">Titre</label>
      <input type="text" id="title" name="title">

      <label for="categorie">Catégorie</label>
      <input type="text" id="categorie" name="categorie">

		</form>

		<button type="submit" form="ajoutPhotoForm" class="addPhoto">valider</button>
  `

})




}


afficherProjetsModal(projets);


}

main();



function initEditMode() {

  console.log('Mode édition activé ✅');
  const bandeauEdit = document.createElement("p");
  bandeauEdit.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> Mode édition </span>`
  bandeauEdit.classList.add("bandeauEdit")
  
  document.body.prepend(bandeauEdit);
  const header = document.querySelector("header");
  header.classList.add("headerEdit")

  const listeNav = document.querySelector("header ul")
  listeNav.innerHTML =
    `<li>projets</li>
			<li>contact</li>
			<li><a href="index.html">logout</a></li>
			<li><img src="./assets/icons/instagram.png" alt="Instagram"></li>`;

  const btnModif = document.createElement("button");
  btnModif.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>modifier`;
  btnModif.classList.add("modal-btn", "modal-trigger");
  
  const titleProjectsEdit = document.getElementById("titleProjectsEdit");
  titleProjectsEdit.classList.add("titleProjectsEdit")

  titleProjectsEdit.appendChild(btnModif);

  const filtres = document.querySelector('.filtres');
  filtres.innerHTML = ``;

}




