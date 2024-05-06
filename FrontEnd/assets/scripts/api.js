

    {/* // Fonction pour récupérer les données de l'API */}

    function fetchDataFromAPI() {
        return fetch('http://localhost:5678/api/works')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données.');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
    }

    // Fonction pour mettre à jour la galerie d'images avec les données de l'API
    function updateGalleryWithData(data) {
        const gallery = document.querySelector('#gallery');

        // Efface le contenu actuel de la galerie
        gallery.innerHTML = '';

        // Parcourt les données de l'API pour créer les nouvelles figures
        data.forEach(item => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            // Remplacez les chemins d'accès statiques par les URL des images provenant de l'API
            img.src = item.imageUrl;
            img.alt = item.title;

            figcaption.textContent = item.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        });
    }

    // Fonction pour filtrer les projets par catégorie
    function filterProjects(category) {
        fetchDataFromAPI()
            .then(data => {
                if (category === 'Tous') {
                    updateGalleryWithData(data);
                } else {
                    const filteredData = data.filter(item => item.category.name === category);
                    updateGalleryWithData(filteredData);
                }
            });
    }

    // Appel de la fonction pour récupérer les données de l'API et mettre à jour la galerie d'images au chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
        fetchDataFromAPI()
            .then(data => {
                updateGalleryWithData(data);
            });
    });

    // Gestion des événements des boutons de filtre
    const filterButtons = document.querySelectorAll('.container-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.textContent.trim();
            filterProjects(category);
        });
    });


    document.addEventListener("DOMContentLoaded", function() {
        const userToken = localStorage.getItem('token')

        const banner = document.getElementById('banner')
        const isLogged = document.getElementById('update-button')

        if (!userToken) {
            banner.style.display = 'none'
            isLogged.style.display = 'none'
        } else {
            banner.style.display = 'flex'
            isLogged.style.display = 'flex'
        }
    })
