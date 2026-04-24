const _supabase = supabase.createClient(
    "https://xkyynzbbatglctgdtqyu.supabase.co",
    "VOTRE_ANON_KEY"
);

let chrono = null;

// ---------------------------
// Chargement de la page
// ---------------------------
window.onload = function () {

    const step = localStorage.getItem('lf_step');

    if (step === 'youtube') {
        startChronoLogic();
    }
    else if (step === 'victory') {
        showStep('step-victory');
    }
};

// ---------------------------
// Afficher une étape
// ---------------------------
function showStep(id) {

    document.querySelectorAll('.container > div').forEach(div => {
        div.classList.add('hidden');
    });

    const target = document.getElementById(id);

    if (target) {
        target.classList.remove('hidden');
    }
}

// ---------------------------
// Inscription utilisateur
// ---------------------------
async function sinscrire() {

    const user = document.getElementById('username').value.trim();
    const parrain = document.getElementById('ref_code').value.trim() || "okoningana";

    if (!user) {
        alert("Pseudo requis");
        return;
    }

    try {

        const { error } = await _supabase
            .from('users')
            .insert([
                {
                    username: user,
                    referred_by: parrain
                }
            ]);

        if (error) {
            alert("Erreur base de données : " + error.message);
            return;
        }

        // Sauvegarde
        localStorage.setItem('lf_parrain', parrain);
        localStorage.setItem('lf_step', 'youtube');

        // Réinitialisation
        localStorage.removeItem('lf_start_time');

        // Aller à l'étape vidéo
        showStep('step-youtube');

        const btnVideo = document.getElementById('btn-video');
        const timerDisplay = document.getElementById('timer-display');

        if (btnVideo) btnVideo.classList.remove('hidden');
        if (timerDisplay) timerDisplay.classList.add('hidden');

    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

// ---------------------------
// Ouverture vidéo
// ---------------------------
function handleYoutube() {

    const existingStart = localStorage.getItem('lf_start_time');

    if (!existingStart) {
        localStorage.setItem('lf_start_time', Date.now().toString());
    }

    // Ouvre la vidéo
    window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");

    // Cache bouton
    const btnVideo = document.getElementById('btn-video');

    if (btnVideo) {
        btnVideo.classList.add('hidden');
    }

    // Lance chrono
    startChronoLogic();
}

// ---------------------------
// Chrono
// ---------------------------
function startChronoLogic() {

    if (chrono) {
        clearInterval(chrono);
    }

    showStep('step-youtube');

    const timerDisplay = document.getElementById('timer-display');

    if (!timerDisplay) return;

    timerDisplay.classList.remove('hidden');

    let startTime = localStorage.getItem('lf_start_time');

    if (!startTime) {
        startTime = Date.now().toString();
        localStorage.setItem('lf_start_time', startTime);
    }

    chrono = setInterval(() => {

        const savedStart = parseInt(localStorage.getItem('lf_start_time'));

        if (!savedStart) {
            clearInterval(chrono);
            return;
        }

        const elapsed = Math.floor((Date.now() - savedStart) / 1000);
        const timeLeft = 180 - elapsed;

        if (timeLeft <= 0) {

            clearInterval(chrono);

            localStorage.setItem('lf_step', 'victory');

            timerDisplay.innerText = "0s";

            showStep('step-victory');

        } else {
            timerDisplay.innerText = timeLeft + "s";
        }

    }, 1000);
}

// ---------------------------
// Redirection Victory
// ---------------------------
function openVictory() {

    const parrain = localStorage.getItem('lf_parrain') || "okoningana";

    const finalUrl = "https://victoryautomatic.com/register/" + encodeURIComponent(parrain);

    window.location.href = finalUrl;
}

// ---------------------------
// Déconnexion
// ---------------------------
function logout() {

    if (chrono) {
        clearInterval(chrono);
    }

    localStorage.removeItem('lf_step');
    localStorage.removeItem('lf_start_time');
    localStorage.removeItem('lf_parrain');

    window.location.reload();
}
