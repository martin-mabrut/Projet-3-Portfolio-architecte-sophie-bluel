async function main() {
  const reponse = await fetch('http://localhost:5678/api/works');
  const projets = await reponse.json(); 
  console.log(projets); 


  let affichageGallerie = document.querySelector('.gallery');
  affichageGallerie.textContent = '';

  const gallery = document.querySelector('.gallery');   
  const sectionPortfolio = document.getElementById('portfolio');

  //Affichage de tous le projets à partir des données provenant de l'API//

for (let i = 0; i < projets.length; i++) {
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = projets[i].imageUrl;
  img.alt = projets[i].title;
  
  const caption = document.createElement('figcaption');
  caption.textContent = projets[i].title;
  
  fig.appendChild(img);
  fig.appendChild(caption);
  gallery.appendChild(fig);
}

//******* */



}

main();