async function sinscrire() {
    const user = document.getElementById('username').value.trim();
    const mail = document.getElementById('email').value.trim();
    if(!user || !mail) { alert("Veuillez remplir tous les champs"); return; }
    
    const l = document.getElementById('langSelect').value;
    const btnReg = document.getElementById('t-btn');
    btnReg.innerText = translations[l].wait;
    btnReg.disabled = true;

    // 1. Enregistrement Supabase
    const { error } = await _supabase.from('users').insert([{ 
        username: user, 
        email: mail, 
        referred_by: parrainID,
        ref_code: "TEMP_" + user.toLowerCase().replace(/\s/g, '')
    }]);

    if (error) { 
        alert("Erreur : " + error.message); 
        btnReg.innerText = translations[l].btn;
        btnReg.disabled = false;
    } else {
        // 2. Notification de succès AVANT tout le reste
        showToast("Compte créé avec succès ! ✅");

        // Petit délai de 1 seconde pour laisser l'utilisateur lire
        setTimeout(() => {
            // 3. Changement d'écran
            document.getElementById('step-registration').classList.add('hidden');
            document.getElementById('step-youtube').classList.remove('hidden');
            
            // 4. LANCEMENT DU CHRONO
            demarrerCompteur();
        }, 1000);
    }
}
