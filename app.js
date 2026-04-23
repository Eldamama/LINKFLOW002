// Après le succès de l'inscription :
setTimeout(() => {
    document.getElementById('btn-video').classList.remove('hidden'); // Affiche le bouton
    document.getElementById('wait-message').classList.add('hidden'); // Cache le "merci de patienter"
}, 10000); // 10 secondes

