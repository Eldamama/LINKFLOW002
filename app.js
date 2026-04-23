// --- CONFIGURATION ---
const _supabase = supabase.createClient("VOTRE_URL", "VOTRE_KEY");
const LIEN_VIDEO = "https://www.youtube.com/watch?v=9uPybhkqYw4";
let timeLeft = 180;

// --- INSCRIPTION ---
async function sinscrire() {
    const user = document.getElementById('username').value.trim();
    const mail = document.getElementById('email').value.trim();
    
    if(!user || !mail) return alert("Remplissez les champs");

    const { error } = await _supabase.from('users').insert([{ 
        username: user, email: mail, referred_by: document.getElementById('ref_code').value 
    }]);

    if (!error) {
        // 1. Passer à l'écran de succès
        document.getElementById('step-registration').classList.add('hidden');
        document.getElementById('step-youtube').classList.remove('hidden');

        // 2. Attendre 10 secondes avant d'afficher le bouton vidéo
        setTimeout(() => {
            document.getElementById('btn-video').classList.remove('hidden');
        }, 10000); 
    }
}

// --- ACTION YOUTUBE ---
function handleYoutube() {
    window.open(LIEN_VIDEO, "_blank");
    
    const btn = document.getElementById('btn-video');
    const display = document.getElementById('timer-display');
    
    btn.disabled = true;
    btn.innerText = "Interaction YouTube en cours...";
    display.classList.remove('hidden');

    // Démarrage du chrono de 180s
    const chrono = setInterval(() => {
        timeLeft--;
        display.innerText = timeLeft + "s";

        if(timeLeft <= 0) {
            clearInterval(chrono);
            document.getElementById('step-youtube').classList.add('hidden');
            document.getElementById('step-victory').classList.remove('hidden');
        }
    }, 1000);
}

// --- VICTORY ---
function openVictory() {
    const parrain = document.getElementById('ref_code').value;
    window.open(`https://victory-automatic.com/register/${parrain}`, "_blank");
}
