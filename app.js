// 1. Fonction pour démarrer la session (à appeler quand la vidéo commence)
async function startVideo() {
    const { data, error } = await supabase
        .from('video_sessions')
        .insert([{ 
            user_id: (await supabase.auth.getUser()).data.user.id,
            status: 'pending' 
        }])
        .select()
        .single();

    if (error) {
        alert("Erreur lors du démarrage : " + error.message);
    } else {
        // On stocke l'ID de session pour le vérifier plus tard
        localStorage.setItem("current_session_id", data.id);
        alert("Vidéo démarrée ! Patientez 3 minutes avant de réclamer.");
    }
}

// 2. Fonction pour appeler ta Edge Function
async function claimReward() {
    const sessionId = localStorage.getItem("current_session_id");

    if (!sessionId) {
        alert("Veuillez d'abord lancer la vidéo.");
        return;
    }

    try {
        const response = await fetch("https://xkyynzbbatglctgdtqyu.supabase.co/functions/v1/dynamic-handler", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId })
        });

        if (response.ok) {
            alert("✅ Succès ! Session validée dans la base de données.");
            localStorage.removeItem("current_session_id"); // On nettoie après succès
        } else {
            const errorMsg = await response.text();
            if (response.status === 403) {
                alert("❌ Trop tôt ! Revenez quand les 3 minutes seront écoulées.");
            } else {
                alert("Erreur : " + errorMsg);
            }
        }
    } catch (err) {
        alert("Erreur de connexion : " + err.message);
    }
}

// Rendre les fonctions accessibles au clic des boutons
window.startVideo = startVideo;
window.claimReward = claimReward;
