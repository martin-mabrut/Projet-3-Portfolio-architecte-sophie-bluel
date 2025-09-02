async function main() {
    const reponse = await fetch('http://localhost:5678/api/works');
    const projets = await reponse.json(); 
    console.log(projets); 

    const gallery = document.querySelector('.gallery');   

    //Réinitialisation de la gallerie

    let affichageGallerie = document.querySelector('.gallery');
    affichageGallerie.textContent = '';

    //Création des boutons filtres

    const filtres = document.querySelector('.filtres');
    const labels = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];

    for (let i = 0; i < labels.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = labels[i];
    filtres.appendChild(btn);
    }

    //Affichage des projets à partir des données provenant de l'API

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

    // Activation du bouton "Tous" dès le chargement de la page

    document.querySelectorAll('.filtres button').forEach(btn => {
    if (btn.textContent.trim() === 'Tous') btn.classList.add('btnFiltreActif');
    });

    //Filtrage

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

    //Affichage du mode édition de la page d'accueil

    const params = new URLSearchParams(window.location.search);
    const hasEditParam = params.get('mode') === 'edit';
    const hasToken = !!localStorage.getItem('token');

    if (hasEditParam && hasToken) {
      initEditMode();
      }

    //Ouverture fermerture Modale

    const modalContainer = document.querySelector(".modal-container");
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    const modal1 = document.querySelector(".modal1");
    const modal2 = document.querySelector(".modal2");

            function toggleModal() {
              modalContainer.classList.toggle("active")

              if (!modalContainer.classList.contains("active")) { //Quand la modale est désactivée
                
                modal2.style.display = "none";
                modal1.style.display = "flex"; //A chaque ouverture, la modale s'ouvre à la première page
                
                const msgErrorGrid = document.querySelector(".message-erreur");
                const msgErrorForm = document.querySelector(".error-form-message");
                msgErrorGrid.style.display = "none";
                msgErrorForm.style.display = "none"; //A chaque ouverture, les messages d'erreurs ont disparu
                
              }
            };

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

    // Contenu et comportement quand la modale est ouverte

            function contenuModal (projets) {
              for (let i = 0; i < projets.length; i++) {
              //Affichage des projets
              const fig = document.createElement('figure');
              fig.style.position = "relative";

              const img = document.createElement('img');
              img.src = projets[i].imageUrl;
              img.alt = projets[i].title;
              
              //Création des boutons poubelle
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
                            try {
                              const response = await fetch(`http://localhost:5678/api/works/${idASupprimer}`, {
                              method: 'DELETE',
                              headers: {
                              'Authorization': `Bearer ${token}`,           // On présente le token
                              'Accept': 'application/json'                  // On demande une réponse JSON (Même si pas nescessaire ici)
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

                              const msgErrorGrid = document.querySelector(".message-erreur");
                              const msgErrorForm = document.querySelector(".error-form-message");
                              msgErrorGrid.style.display = "none";
                              msgErrorForm.style.display = "none"; //Suppression des messages erreurs

                              } else { //Gestion de l'erreur si token perdu                              
                                const tokenLost = document.querySelector(".message-erreur");
                                tokenLost.style.display = "flex";
                                tokenLost.innerText = "Connexion expirée. Veuillez vous reconnecter.";
                              }
                            } catch { //Gestion de l'erreur si pas de réponse du serveur                              
                                const responseNone = document.querySelector(".message-erreur");
                                responseNone.style.display = "flex";
                                responseNone.innerText = "Une erreur est survenue. Réessayez ultérieurement.";
                            }
                          });
                        
              fig.appendChild(img);
              fig.appendChild(btn);
              const gridModal = document.querySelector(".gridModal");
              gridModal.appendChild(fig);
              }

              // Ajout d'une nouvelle photo

              const btnAddPhoto = document.querySelector(".addPhoto"); 

                          btnAddPhoto.addEventListener('click', async () => {
                            modal1.style.display = "none";
                            modal2.style.display = "flex";
                            const title = document.querySelector("#title");
                            const titleValue = title.value.trim();

                            if (titleValue === "") {
                              const btnValider = document.querySelector(".addPhotoValider");
                              btnValider.style.backgroundColor = "#A7A7A7";
                              btnValider.style.cursor = "not-allowed";
                            };
                          }) 
              // Bouton pour revenir en arrière
              const btnBack = document.querySelector(".back-modal")

                          btnBack.addEventListener('click', async () => {
                            modal1.style.display = "flex";
                            modal2.style.display = "none";

                            const msgErrorGrid = document.querySelector(".message-erreur");
                            const msgErrorForm = document.querySelector(".error-form-message");
                            msgErrorGrid.style.display = "none";
                            msgErrorForm.style.display = "none"; //Suppression des messages erreurs
                          })
              // Afficher les catégories dans le formulaire
              
                          async function getCategory() {
                            const response = await fetch("http://localhost:5678/api/categories");
                            const categories = await response.json();
                            console.log(categories);
                            const inputCategory = document.querySelector(".inputCategory");
                                  for (let i = 0; i < categories.length; i++){
                                    const option = document.createElement("option");
                                    const value = categories[i].id;
                                    const txt = categories [i].name;
                                    option.setAttribute("value", value);
                                    option.innerText = txt;
                                    inputCategory.appendChild(option);
                                  }
                          }
              getCategory();

              // Génération de l'aperçu de l'image chargé dans le form
              const inputFile = document.getElementById("image");
              const uploadBox = document.querySelector(".upload-box");

                          inputFile.addEventListener("change", (event) => {
                            const file = event.target.files[0];
                            const tailleMax = 4 * 1024 * 1024; // 4 Mo en octets
                            const extensionOk = file.name.endsWith(".jpg") || file.name.endsWith(".png");
                                  if (!extensionOk || file.size > tailleMax) { //Gestion des formats et taille de l'image
                                    inputFile.value = "";
                                    const imgError = document.querySelector(".image-error");
                                    imgError.style.display = "flex";
                                  } else {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      uploadBox.innerHTML = `<img src="${e.target.result}" alt="aperçu" class="preview-img">`;
                                    };
                                    reader.readAsDataURL(file);
                                  }
                          });
              
              // Remise à zéro du form ou de l'aperçu de l'image, en cas de fermeture ou changement de page modale 
              const triggerResetForm = document.querySelectorAll(".reset-form")
              
                          triggerResetForm.forEach(trigger => {
                                  trigger.addEventListener("click", () => {
                                  const form = document.getElementById("ajoutPhotoForm");
                                  form.reset();

                                  uploadBox.innerHTML =  
                                  `<i class="fa-regular fa-image upload-icon"></i>
                                  <label for="image" class="upload-btn">+ Ajouter photo</label>
                                  <p class="upload-info">jpg, png : 4mo max</p>
                                  <p class="image-error">Vérifiez le format et la taille du fichier.</p>
                                  `;

                                  const imgError = document.querySelector(".image-error");
                                  const msgErrorForm = document.querySelector(".error-form-message");
                                  imgError.style.display = "none";
                                  msgErrorForm.style.display = "none";
                                  });                                  
                          });
              
              //Conditions et soummission du formulaire
              const form = document.getElementById("ajoutPhotoForm");
              const title = document.querySelector("#title");
              const image = document.querySelector("#image");
              const category = document.querySelector("#category");
              const btnValider = document.querySelector(".addPhotoValider");

                          function allFieldsFilled() {
                            const titleValue = title.value.trim(); // au moins un caractère non-espace
                            return (
                              titleValue !== "" &&
                              image.files.length > 0 &&
                              category.value !== ""
                            );
                          }

                          async function handleSubmit(e) {
                                  e.preventDefault();

                                  const token = localStorage.getItem("token");
                                  const formData = new FormData(form);

                                  try {
                                    const res = await fetch("http://localhost:5678/api/works", {
                                      method: "POST",
                                      headers: { Authorization: `Bearer ${token}` },
                                      body: formData,
                                    });

                                              if (!res.ok) { //Gestion perte token
                                                const msgErrorForm = document.querySelector(".error-form-message");
                                                msgErrorForm.innerText = "Connexion expirée. Veuillez vous reconnecter."
                                                msgErrorForm.style.display = "flex";
                                              } else {

                                              
                                              const data = await res.json(); //Lire la réponse JSON et l'afficher dans la console
                                              console.log(data);
                                              
                                              form.reset();
                                              uploadBox.innerHTML =  
                                              `<i class="fa-regular fa-image upload-icon"></i>
                                              <label for="image" class="upload-btn">+ Ajouter photo</label>
                                              <p class="upload-info">jpg, png : 4mo max</p>
                                              `;
                                              toggleModal();

                                              const lastReponse = await fetch('http://localhost:5678/api/works');
                                              const lastProjets = await lastReponse.json(); 
                                              affichageGallerie.textContent = '';
                                              afficherProjets (lastProjets);

                                              //Mise à jour du grid 
                                              const gridModal = document.querySelector(".gridModal");
                                              gridModal.innerHTML = ``;
                                              for (let i = 0; i < lastProjets.length; i++) {
                                                //Ré-affichage des projets
                                                const fig = document.createElement('figure');
                                                fig.style.position = "relative";

                                                const img = document.createElement('img');
                                                img.src = lastProjets[i].imageUrl;
                                                img.alt = lastProjets[i].title;
                                                
                                                const btn = document.createElement('button');
                                                btn.innerHTML= `<i class="fa-solid fa-trash-can"></i>`; 
                                                btn.style.position = "absolute";
                                                btn.style.top = "5px";
                                                btn.style.right = "5px";

                                                            
                                                          
                                                fig.appendChild(img);
                                                fig.appendChild(btn);
                                                const gridModal = document.querySelector(".gridModal");
                                                gridModal.appendChild(fig);

                                                // Suppression grâce au bouton poubelle sur la nouvelle liste

                                                            btn.addEventListener('click', async () => {
                                                            const figEl = btn.closest('figure');
                                                            const imgEl = figEl.querySelector('img');
                                                            const url = imgEl.getAttribute('src');

                                                            const cible = lastProjets.find(p => p.imageUrl === url);
                                                            const idASupprimer = cible.id;
                                                            console.log('ID à supprimer :', idASupprimer);

                                                              // On récupère le token depuis le localStorage
                                                            const token = localStorage.getItem('token');

                                                            // On envoie la requête DELETE vers l’API
                                                            try {
                                                              const response = await fetch(`http://localhost:5678/api/works/${idASupprimer}`, {
                                                              method: 'DELETE',
                                                              headers: {
                                                              'Authorization': `Bearer ${token}`,           // On présente le token
                                                              'Accept': 'application/json'                  // On demande une réponse JSON (Même si pas nescessaire ici)
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

                                                              const msgErrorGrid = document.querySelector(".message-erreur");
                                                              const msgErrorForm = document.querySelector(".error-form-message");
                                                              msgErrorGrid.style.display = "none";
                                                              msgErrorForm.style.display = "none"; //Suppression des messages erreurs

                                                              } else { //Gestion de l'erreur si token perdu                              
                                                                const tokenLost = document.querySelector(".message-erreur");
                                                                tokenLost.style.display = "flex";
                                                                tokenLost.innerText = "Connexion expirée. Veuillez vous reconnecter.";
                                                              }
                                                            } catch { //Gestion de l'erreur si pas de réponse du serveur                              
                                                                const responseNone = document.querySelector(".message-erreur");
                                                                responseNone.style.display = "flex";
                                                                responseNone.innerText = "Une erreur est survenue. Réessayez ultérieurement.";
                                                            }
                                                            });
                                                }
                                              }
                                    } catch { //Gestion de l'erreur si pas de réponse du serveur 
                                      const msgErrorForm = document.querySelector(".error-form-message");
                                      msgErrorForm.innerText = "Une erreur est survenue. Réessayez ultérieurement.";
                                      msgErrorForm.style.display = "flex";
                                    }

                          }
              
              
                                //Active/désactive le bouton + (dé)clenche la soumission
                                function checkForm() {
                                  if (allFieldsFilled()) {
                                    btnValider.style.backgroundColor = "#1D6154";
                                    btnValider.style.cursor = "pointer";
                                    form.addEventListener("submit", handleSubmit);
                                  } else {
                                    btnValider.style.backgroundColor = "#A7A7A7";
                                    btnValider.style.cursor = "not-allowed";
                                    form.removeEventListener("submit", handleSubmit);
                                  }
                                }
              title.addEventListener("input", checkForm);
              image.addEventListener("change", checkForm);
              category.addEventListener("change", checkForm);

              checkForm();

              }


    contenuModal(projets);

}

main();

function initEditMode() { //Interface après login

  console.log('Mode édition activé');
  const bandeauEdit = document.createElement("div");
  bandeauEdit.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> Mode édition </span>`
  bandeauEdit.classList.add("bandeauEdit")
  
  document.body.prepend(bandeauEdit);

  const listeNav = document.querySelector("header ul")
  listeNav.innerHTML =
    `<li>projets</li>
			<li>contact</li>
			<li><a href="index.html">logout</a></li>
			<li><img src="./assets/icons/instagram.png" alt="Instagram"></li>`;

  const btnModif = document.createElement("button");
  btnModif.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><span>modifier</span>`;
  btnModif.classList.add("modal-btn", "modal-trigger");
  
  const titleProjectsEdit = document.getElementById("titleProjectsEdit");
  titleProjectsEdit.classList.add("titleProjectsEdit")

  titleProjectsEdit.appendChild(btnModif);

  const filtres = document.querySelector('.filtres');
  filtres.innerHTML = ``;

}




