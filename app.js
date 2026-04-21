// Connexion à Supabase avec la clé JWT brute
const SUPABASE_URL = "https://xkyynzbbatglctgdtqyu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreXluemJiYXRnbGN0Z2R0cXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDI0NDEsImV4cCI6MjA5MjIxODQ0MX0.yUJc7P2zkYCb1ub2IPwKPUM1duIaVwGsBmfa4TVIvPc";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Gestion du parrain automatique via l'URL
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const parrainDetecte = urlParams.get('ref');
    
    if (parrainDetecte) {
        document.getElementById('parrain_code').value = parrainDetecte;
        document.getElementById('welcome-area').innerText = "Invité par : " + parrainDetecte;
    } else {
        document.getElementById('welcome-area').innerText = "Bienvenue sur LINKFLOW";
        document.getElementById('parrain_code').readOnly = false;
    }
};

// Fonction d'inscription
async function inscription() {
    const email = document.getElementById('email').value.trim();
    const refCode = document.getElementById('ref_code').value.trim();
    const parrain = document.getElementById('parrain_code').value.trim();

    if (!email || !refCode || !parrain) {
        alert("Attention : Tous les champs sont obligatoires.");
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
            alert("Erreur système : " + error.message);
        } else {
            alert("Inscription validée avec succès !");
            // Redirection vers ta formation
            window.location.href = "https://www.youtube.com/watch?v=9uPybhkqYw4";
        }
    } catch (err) {
        alert("Une erreur technique est survenue lors de la connexion.");
    }
}
