async function sinscrire() {
    const pseudo = document.getElementById('username').value.trim();
    const mail = document.getElementById('email').value.trim();
    const parrain = document.getElementById('ref_code').value;

    if(!pseudo || !mail) { 
        alert("Remplis le nom et l'email !"); 
        return; 
    }

    const { error } = await _supabase
        .from('users') 
        .insert([{ 
            email: mail, 
            ref_code: pseudo,
            referred_by: parrain
        }]);

    if (error) { 
        alert("Erreur technique : " + error.message); 
    } else { 
        window.location.href = "https://www.youtube.com/watch?v=9uPybhkqYw4"; 
    }
}
