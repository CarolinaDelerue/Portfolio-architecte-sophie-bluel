// Fonction pour se connecter
function login () {
    const email = document.getElementById('email').value
    const password = document.getElementById('mdp').value

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la connexion')
            }
            return response.json()
        })
        .then(data => {
            // Vérifier si la connexion a réussi
            if (data.userId && data.token) {
                // Stocker le token dans le stockage local
                localStorage.setItem('userId', data.userId)
                localStorage.setItem('token', data.token)

                // Rediriger vers la page d'accueil
                window.location.href = "index.html"
            } else {
                // Afficher un message d'erreur
                alert("La combinaison utilisateur-mot de passe est incorrecte.")
            }
        })
        .catch(error => {
            // Gérer les erreurs de connexion
            console.error('Erreur de connexion:', error)
            alert("Erreur de connexion: Impossible de se connecter au serveur.")
        })
}

// Fonction pour déconnecter l'utilisateur
function logout () {
    // Supprimer les éléments stockés dans le stockage local
    localStorage.removeItem('userId')
    localStorage.removeItem('token')

    // Rediriger vers la page de connexion
    window.location.href = "login.html"
}

// Fonction pour mettre à jour le texte du lien "login" en "logout" ou vice versa
function updateLoginLogoutLinkText () {
    const loginLogoutLink = document.getElementById('loginLogoutLink')
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    if (userId && token) {
        // Si l'utilisateur est connecté, mettre à jour le texte en "logout"
        loginLogoutLink.textContent = 'logout'
        // Ajouter un écouteur d'événements pour déconnecter l'utilisateur au clic sur le lien "logout"
        loginLogoutLink.addEventListener('click', logout)
    } else {
        // Sinon, mettre à jour le texte en "login"
        loginLogoutLink.textContent = 'login'
        // Ajouter un écouteur d'événements pour connecter l'utilisateur au clic sur le lien "login"
        loginLogoutLink.addEventListener('click', login)
    }
}

// Appeler la fonction pour mettre à jour le texte du lien une fois que la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    updateLoginLogoutLinkText()
})
