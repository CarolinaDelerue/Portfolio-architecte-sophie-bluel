// Fonction pour ouvrir le modal 1
const openModal = function (e) {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = 'flex'
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  displayImagesFromAPI() // Afficher les images actuelles
}

// Fonction pour fermer le modal 1
const closeModal = function (e) {
  const modal1 = document.getElementById('modal1')
  modal1.style.display = 'none'
  modal1.setAttribute('aria-hidden', 'true')
  modal1.removeAttribute('aria-modal')
}

// Ajouter un écouteur d'événements pour le clic sur le bouton "Modifier"
document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

// Sélectionner l'icône de croix dans le modal 1
const closeIconModal1 = document.querySelector('#modal1 .js-modal-close')

// Ajouter un écouteur d'événements pour le clic sur l'icône de croix dans le modal 1
closeIconModal1.addEventListener('click', closeModal)

// Sélectionner l'élément modal 2
const modal2 = document.getElementById('modal2')

// Fonction pour ouvrir le modal 2
const openModal2 = function (e) {
  e.preventDefault()
  modal2.style.display = 'flex'
  modal2.removeAttribute('aria-hidden')
  modal2.setAttribute('aria-modal', 'true')
}

// Fonction pour fermer le modal 2
const closeModal2 = function () {
  modal2.style.display = 'none'
}

// Ajouter un écouteur d'événements pour le clic sur le bouton "Ajouter une photo"
document.querySelectorAll('.js-modal2').forEach(a => {
  a.addEventListener('click', openModal2)
})

// Sélectionner le formulaire d'ajout de photo
const uploadForm = document.getElementById('uploadForm')

// Ajouter un gestionnaire d'événements pour le soumission du formulaire
uploadForm.addEventListener('submit', function (e) {
  e.preventDefault() // Empêcher le comportement par défaut du formulaire

  const formData = new FormData(this) // Récupérer les données du formulaire

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de l\'ajout de l\'image.')
      }
      // Mettez à jour l'affichage des images après l'ajout
      displayImagesFromAPI()
      closeModal2() // Fermer le modal après l'ajout
      validateButton.classList.add('active-button') // Rendre le bouton rouge
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de l\'image:', error)
    })
})

// Fonction pour empêcher la propagation de l'événement
const stopPropagation = function (e) {
  e.stopPropagation()
}

// Sélectionner l'élément input de type fichier
const imageInput = document.getElementById('image')
// Sélectionner l'élément img pour l'aperçu de l'image
const imagePreview = document.getElementById('imagePreview')
// Sélectionner le label pour le bouton d'ajout d'image
const imagePreviewLabel = document.querySelector('.imagePreviewLabel')
// Sélectionner l'élément <p> pour le texte du format
const formatText = document.getElementById('formatText')
// Sélectionner le bouton "Valider"
const validateButton = document.getElementById('uploadButton') // Utiliser l'ID du bouton

// Ajouter un écouteur d'événements pour le changement de fichier
imageInput.addEventListener('change', function () {
  // Vérifier si un fichier a été sélectionné
  if (this.files && this.files[0]) {
    const file = this.files[0]
    const fileType = file.type
    const fileSize = file.size

    // Vérifier le type de fichier et la taille maximale (4 Mo)
    if (['image/jpeg', 'image/png'].includes(fileType)) {
      if (fileSize <= 4 * 1024 * 1024) { // 4 MB in bytes
        const reader = new FileReader()

        // Lorsque le fichier est chargé, mettre à jour l'aperçu de l'image
        reader.onload = function (e) {
          imagePreview.src = e.target.result
          imagePreview.style.display = 'block'
          imagePreviewLabel.style.display = 'none'
          formatText.style.display = 'none'
          validateButton.classList.add('active')
        }

        // Lire le fichier en tant que URL de données
        reader.readAsDataURL(file)
      } else {
        alert('Le fichier ne doit pas dépasser 4 Mo.')
        imageInput.value = ''
      }
    } else {
      alert('Veuillez sélectionner une image au format JPG ou PNG.')
      imageInput.value = ''
    }
  }
})


// Sélectionner l'icône de croix dans le modal 2
const closeIconModal2 = document.querySelector('#modal2 .js-modal-close')

// Ajouter un écouteur d'événements pour le clic sur l'icône de croix dans le modal 2
closeIconModal2.addEventListener('click', closeModal2)

// Sélectionner l'élément .modal-content pour afficher les images dans le modal 1
const modalContent = document.querySelector('#modal1 .modal-content')

// Effectuer un appel API et afficher les images dans le modal 1
function displayImagesFromAPI () {
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de la récupération des données.')
      }
      return response.json()
    })
    .then(data => {
      modalContent.innerHTML = '' // Vider le contenu existant

      data.forEach(imageData => {
        const imgContainer = document.createElement('div')
        const img = document.createElement('img')
        img.src = imageData.imageUrl // Utilisez l'URL de l'image provenant de l'API
        img.alt = imageData.title
        img.id = imageData.id

        const trash = document.createElement('a')
        const icon = document.createElement('img')
        icon.src = './assets/icons/trash.svg'

        trash.appendChild(icon)

        // Ajouter l'image et l'icône de suppression au conteneur du modal
        imgContainer.appendChild(img)
        imgContainer.appendChild(trash)
        modalContent.appendChild(imgContainer)

        // Ajouter un écouteur d'événements pour la suppression d'image
        trash.addEventListener('click', () => deleteImg(imageData.id))
      })
    })
    .catch(error => {
      console.error('Erreur:', error)
    })
}

// Fonction pour supprimer une image
function deleteImg (id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'image.')
      }
      // Mettez à jour l'affichage des images après la suppression
      displayImagesFromAPI()
    })
    .catch(error => {
      console.error('Erreur lors de la suppression de l\'image:', error)
    })
}

// Récupérer les catégories depuis l'API
function fetchCategories () {
  return fetch('http://localhost:5678/api/categories')
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de la récupération des catégories.')
      }
      return response.json()
    })
}

// Fonction pour afficher les catégories dans le menu déroulant
function displayCategories (categories) {
  const selectCategory = document.getElementById('category')

  // Supprimer toutes les options existantes
  selectCategory.innerHTML = ''

  // Ajouter une option vide par défaut
  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.textContent = 'Sélectionner une catégorie'
  selectCategory.appendChild(defaultOption)

  // Ajouter chaque catégorie comme une option dans le menu déroulant
  categories.forEach(category => {
    const option = document.createElement('option')
    option.value = category.id
    option.textContent = category.name
    selectCategory.appendChild(option)
  })
}

// Appeler la fonction pour récupérer les catégories et les afficher dans le menu déroulant
fetchCategories()
  .then(categories => displayCategories(categories))
  .catch(error => {
    console.error('Erreur:', error)
  })
