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
function displayImagesFromAPI () {
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de la récupération des données.')
      }
      return response.json()
    })
    .then(data => {
      // Récupérer le conteneur dans le modal où vous souhaitez afficher les images
      const modalContent = document.querySelector('.modal-content')

      // Parcourir les données de l'API pour créer les éléments d'image et les ajouter au modal
      data.forEach(imageData => {
        const img = document.createElement('img')
        img.src = imageData.imageUrl
        img.alt = imageData.title

        // Ajouter l'image au conteneur du modal
        modalContent.appendChild(img)
      })
    })
    .catch(error => {
      console.error('Erreur:', error)
    })
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
