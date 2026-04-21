// Configuration de la connexion
const SUPABASE_URL = "https://xkyynzbbatglctgdtqyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_pcrDzFZ9rkilVlw12_0uvw_2CcdtvLB";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function inscription() {
    const email = document.getElementById('email').value;
    const refCode = document.getElementById('ref_code').value;
    const parrain = document.getElementById('parrain_code').value;

    if (!email || !refCode || !parrain) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        // Enregistrement dans la table 'users'
        const { data, error } = await _supabase
            .from('users')
            .insert([
                { 
                    email: email, 
                    ref_code: refCode, 
                    referred_by: parrain 
                }
            ]);

        if (error) {
            // Affiche l'erreur (ex: si le parrain n'existe pas ou email déjà pris)
            alert("Erreur d'inscription : " + error.message);
        } else {
            alert("Inscription réussie ! Redirection vers la formation...");
            
            // REMPLACER PAR LE LIEN DE VOTRE VIDÉO YOUTUBE
            window.location.href = "https://www.youtube.com/watch?v=VOTRE_ID_VIDEO";
        }
    } catch (err) {
        console.error("Erreur inattendue:", err);
        alert("Une erreur est survenue lors de la connexion.");
    }
}
