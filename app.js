async function sinscrire() {
    // Récupération des données du formulaire
    const pseudo = document.getElementById('username').value.trim();
    const mail = document.getElementById('email').value.trim();
    const parrain = document.getElementById('ref_code').value;

    if(!pseudo || !mail) { 
        alert("Veuillez remplir le nom et l'email."); 
        return; 
    }

    // On envoie à Supabase
    const { data, error } = await _supabase
        .from('users') 
        .insert([{ 
            email: mail, 
            ref_code: pseudo,     // Ta table utilise 'ref_code' pour le nom
            referred_by: parrain, // Ta table utilise 'referred_by'
            is_active: true       // Ta table a une colonne boolean 'is_active'
        }]);

    if (error) { 
        // Si ça rate, ce message nous dira pourquoi (ex: problème d'ID)
        console.error("Erreur détaillée:", error);
        alert("Erreur : " + error.message); 
    } else { 
        // Si ça marche, direction YouTube !
        window.location.href = "https://www.youtube.com/watch?v=9uPybhkqYw4"; 
    }
}

