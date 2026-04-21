const SUPABASE_URL = "https://xkyynzbbatglctgdtqyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_pcrDzFZ9rkilVlw12_0uvw_2CcdtvLB";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Détecter le parrain au chargement de la page
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const parrainDetecte = urlParams.get('ref');
    
    if (parrainDetecte) {
        document.getElementById('parrain_code').value = parrainDetecte;
        document.getElementById('welcome-area').innerText = "Invité par : " + parrainDetecte;
    } else {
        document.getElementById('welcome-area').innerText = "Bienvenue sur LINKFLOW";
        document.getElementById('parrain_code').readOnly = false; // Permet de le taper si pas de lien
    }
};

// 2. Fonction d'inscription
async function inscription() {
    const email = document.getElementById('email').value;
    const refCode = document.getElementById('ref_code').value;
    const parrain = document.getElementById('parrain_code').value;

    if (!email || !refCode || !parrain) {
        alert("Remplis tous les champs !");
        return;
    }

    const { data, error } = await _supabase
        .from('users')
        .insert([{ email: email, ref_code: refCode, referred_by: parrain }]);

    if (error) {
        alert("Erreur : " + error.message);
    } else {
        alert("Inscription réussie !");
        window.location.href = "https://www.youtube.com/watch?v=9uPybhkqYw4";
    }
}
