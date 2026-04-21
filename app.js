// Configuration de la connexion Supabase
const SUPABASE_URL = "https://xkyynzbbatglctgdtqyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_pcrDzFZ9rkilVlw12_0uvw_2CcdtvLB";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function inscription() {
    const email = document.getElementById('email').value;
    const refCode = document.getElementById('ref_code').value;
    const parrain = document.getElementById('parrain_code').value;

    // Vérification que les champs ne sont pas vides
    if (!email || !refCode || !parrain) {
        alert("Veuillez remplir tous les champs pour rejoindre l'aventure.");
        return;
    }

    try {
        // Enregistrement de l'utilisateur dans la table 'users'
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
            // Gestion des erreurs (ex: parrain inexistant ou email déjà utilisé)
            alert("Erreur d'inscription : " + error.message);
        } else {
            alert("Félicitations ! Inscription réussie. Vous allez être redirigé vers la vidéo de formation.");
            
            // Redirection vers ta vidéo YouTube mise à jour
            window.location.href = "https://www.youtube.com/watch?v=9uPybhkqYw4";
        }
    } catch (err) {
        console.error("Erreur critique :", err);
        alert("Une erreur technique est survenue.");
    }
}
