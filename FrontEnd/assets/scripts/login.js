document.getElementById('loginBtn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('mdp').value;

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }
        return response.json();
    })
    .then(data => {
        // Vérifier si la connexion a réussi
        if (data.userId && data.token) {
            // Stocker le token dans le stockage local
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('token', data.token);

            // Rediriger vers la page d'accueil
            window.location.href = "index.html";
        } else {
            // Afficher un message d'erreur
            alert("La combinaison utilisateur-mot de passe est incorrecte.");
        }
    })
    .catch(error => {
        // Gérer les erreurs de connexion
        console.error('Erreur de connexion:', error);
        alert("Erreur de connexion: Impossible de se connecter au serveur.");
    });
});
