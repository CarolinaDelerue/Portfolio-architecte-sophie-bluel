let modal = document.getElementById('modal1')

const openModal = function (e) {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = "flex"
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  const computedStyle = window.getComputedStyle(modal);
  if (computedStyle.display === 'none') return;
  e.preventDefault();
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
}



const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})


// Effectuer un appel API et afficher les images dans le modal
function displayImagesFromAPI() {
  fetch('http://localhost:5678/api/works')
      .then(response => {
          if (!response.ok) {
              throw new Error('Échec de la récupération des données.');
          }
          return response.json();
      })
      .then(data => {
          const modalContent = document.querySelector('.modal-content');
          modalContent.innerHTML = ''; // Clear existing content

          data.forEach(imageData => {
              const imgContainer = document.createElement('div');
              const img = document.createElement('img');
              img.src = imageData.imageUrl; // Utilisez l'URL de l'image provenant de l'API

              // Autres attributs de l'image comme l'ID, l'alt, etc.
              img.alt = imageData.title;
              img.id = imageData.id;

              const trash = document.createElement('button');
              const icon = document.createElement('img');
              icon.src = './assets/icons/trash.svg';

              // Ajouter l'image au conteneur du modal
              imgContainer.appendChild(img);
              imgContainer.appendChild(trash);
              trash.appendChild(icon);
              modalContent.appendChild(imgContainer);

              trash.addEventListener('click', () => deleteImg(imageData.id));
          });
      })
      .catch(error => {
          console.error('Erreur:', error);
      });
}


function deleteImg(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    //suppression de l'image via token session
    headers: {
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    },
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Échec de la suppression de l\'image.');
    }
    // Mettez à jour l'affichage des images après la suppression
    displayImagesFromAPI();
  })
  .catch(error => {
    console.error('Erreur lors de la suppression de l\'image:', error);
  });


}

// Appeler la fonction pour afficher les images une fois que le modal est ouvert
document.addEventListener('DOMContentLoaded', () => {
  // Récupérer le bouton pour ouvrir le modal
  const modalButton = document.querySelector('.js-modal')

  // Ajouter un écouteur d'événements pour ouvrir le modal lors du clic sur le bouton
  modalButton.addEventListener('click', () => {
    // Afficher le modal
    const modal = document.getElementById('modal1')
    modal.style.display = 'block'

    // Appeler la fonction pour afficher les images de l'API
    displayImagesFromAPI()
  })
})



// Fonction pour ouvrir le modal 2
const openModal2 = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = "flex";
  target.removeAttribute('aria-hidden');
  target.setAttribute('aria-modal', 'true');
};

// Fonction pour fermer le modal 2
const closeModal2 = function (e) {
  const modal2 = document.getElementById('modal2');
  modal2.style.display = "none";
};

// Fonction pour empêcher la propagation de l'événement
const stopPropagation2 = function (e) {
  e.stopPropagation();
};

// Sélectionnez tous les boutons "Ajouter une photo" et ajoutez un écouteur d'événements pour ouvrir le modal 2
document.querySelectorAll('.js-modal2').forEach(button => {
  button.addEventListener('click', openModal2);
});

// Soumission du formulaire d'ajout de photo
document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Récupération des données du formulaire
  const formData = new FormData(this);

  console.log('formData', formData)

  // Envoi des données au serveur
  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Échec de l\'ajout de l\'image.');
    }
    // Mettre à jour l'affichage des images après l'ajout
    displayImagesFromAPI();
    // Fermer le modal 2
    closeModal2(e);
  })
  .then(data => {
    // Ajoutez un console.log pour afficher les données envoyées en base
    console.log('Données envoyées en base:', formData);
  })
  .catch(error => {
    console.error('Erreur lors de l\'ajout de l\'image:', error);
  });
});
