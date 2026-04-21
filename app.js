// Configuration de la connexion Supabase
const SUPABASE_URL = "https://xkyynzbbatglctgdtqyu.supabase.co";
// Cle corrigee : rkilVlw12 (avec un L minuscule)
const SUPABASE_KEY = "sb_publishable_pcrDzFZ9rkilVlw12_0uvw_2CcdtvLB";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Détecter le parrain au chargement de la page via l'URL (?ref=...)
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const parrainDetecte = urlParams.get('ref');
    
    const welcomeArea = document.getElementById('welcome-area');
    const parrainInput = document.getElementById('parrain_code');
    
    if (parrainDetecte) {
        parrainInput.value = parrainDetecte;
        welcomeArea.innerText = "Invité par : " + parrainDetecte;
    } else {
        welcomeArea.innerText = "Bienvenue sur LINKFLOW";
        parrainInput.readOnly = false;
    }
};

// 2. Fonction d'inscription
async function inscription() {
    const email = document.getElementById('email').value.trim();
    const refCode = document.getElementById('ref_code').value.trim();
    const parrain = document.getElementById('parrain_code').value.trim();

    if (!email || !refCode || !parrain) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const { data, error } = await _supabase
            .from('users')
            .insert([{ 
                email: email, 
                ref_code: refCode, 
                referred_by: parrain 
            }]);

        if (error) {
            // Si l'erreur est "Invalid API key", cela s'affichera ici
            alert("Erreur : " + error.message);
        } else {
            alert("Inscription réussie !");
            window.location.href = "https://www.youtube.com/watch?v=9uPybhkqYw4";
        }
    } catch (err) {
        console.error("Erreur technique:", err);
        alert("Une erreur de connexion est survenue.");
    }
}
