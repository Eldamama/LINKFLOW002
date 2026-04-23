// --- LOGIQUE INSCRIPTION ---
async function sinscrire() {
    const user = document.getElementById('username').value.trim();
    const mail = document.getElementById('email').value.trim();
    const ref = document.getElementById('ref_code').value;

    if(!user || !mail) { alert("Champs vides"); return; }

    // 1. On enregistre dans Supabase
    const { error } = await _supabase.from('users').insert([{ 
        username: user, email: mail, referred_by: ref,
        ref_code: "TEMP_" + user.toLowerCase() 
    }]);

    if (error) {
        alert("Erreur d'inscription : " + error.message);
    } else {
        // 2. AU LIEU DE PARTIR SUR YOUTUBE, on change l'affichage
        document.getElementById('step-registration').classList.add('hidden');
        document.getElementById('step-youtube').classList.remove('hidden');
        alert("Inscription réussie ! Veuillez maintenant valider le soutien.");
    }
}

// --- LOGIQUE YOUTUBE (Déclenchée par le bouton bleu de ta photo) ---
function handleYoutube() {
    // On ouvre la vidéo dans un nouvel onglet pour NE PAS quitter le site
    window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");

    let timeLeft = 180; // 3 minutes
    const btn = document.getElementById('btn-video');
    btn.disabled = true;

    const timer = setInterval(() => {
        timeLeft--;
        btn.innerText = "Validation en cours... " + timeLeft + "s";

        if(timeLeft <= 0) {
            clearInterval(timer);
            // 3. Une fois fini, on montre le bouton Victory
            document.getElementById('step-youtube').classList.add('hidden');
            document.getElementById('step-victory').classList.remove('hidden');
        }
    }, 1000);
}
