// --- FONCTION CONNEXION AMÉLIORÉE ---
async function toggleLogin() {
    const user = prompt("Entrez votre pseudo pour vous connecter :");
    if(!user) return;

    // 1. Vérifier si l'utilisateur existe dans Supabase
    const { data, error } = await _supabase
        .from('users')
        .select('username')
        .eq('username', user.trim())
        .single();

    if (error || !data) {
        alert("Pseudo introuvable. Veuillez d'abord vous inscrire.");
    } else {
        // 2. Si l'utilisateur existe, on mémorise et on l'envoie à l'étape finale
        localStorage.setItem('lf_user', user);
        localStorage.setItem('lf_step', 'victory'); 
        showStep('step-victory');
        alert("Bon retour " + user + " !");
    }
}

// --- SÉCURITÉ REDIRECTION ---
function openVictory() {
    const parrain = document.getElementById('ref_code').value;
    // Vérification de l'URL pour éviter l'erreur "Adresse introuvable"
    if(!parrain) {
        alert("Erreur de parrainage. Contactez l'administrateur.");
        return;
    }
    const targetUrl = `https://victory-automatic.com/register/${parrain}`;
    window.open(targetUrl, "_blank");
}
