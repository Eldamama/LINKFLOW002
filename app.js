const _supabase = supabase.createClient(
    "https://xkyynzbbatglctgdtqyu.supabase.co",
    "VOTRE_ANON_KEY"
);

let chrono = null;

// ---------------------------
// Chargement page
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
// Navigation entre étapes
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
            .insert([{
                username: user,
                referred_by: parrain
            }]);

        if (error) {
            alert("Erreur base de données : " + error.message);
            return;
        }

        // Sauvegarde locale
        localStorage.setItem('lf_parrain', parrain);
        localStorage.setItem('lf_step', 'youtube');

        // Affichage étape vidéo
        showStep('step-youtube');

        // Reset affichage
        document.getElementById('btn-video').classList.remove('hidden');
        document.getElementById('timer-display').classList.add('hidden');

    } catch (err) {
        alert("Erreur inattendue : " + err.message);
    }
}

// ---------------------------
// Ouverture vidéo
// ---------------------------
function handleYoutube() {

    // empêcher double lancement
    if (!localStorage.getItem('lf_start_time')) {
        localStorage.setItem('lf_start_time', Date.now().toString());
    }

    window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");

    document.getElementById('btn-video').classList.add('hidden');

    startChronoLogic();
}

// ---------------------------
// Chrono vidéo
// ---------------------------
function startChronoLogic() {

    if (chrono) {
        clearInterval(chrono);
    }

    showStep('step-youtube');

    const timerDisplay = document.getElementById('timer-display');

    if (!timerDisplay) return;

    timerDisplay.classList.remove('hidden');

    // sécurité
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
// Ouvrir Victory
// ---------------------------
function openVictory() {

    const parrain = localStorage.getItem('lf_parrain') || "okoningana";

    const finalUrl = "https://victory-automatic.com/register/" + encodeURIComponent(parrain);

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
