<script>
    // Configuration Supabase
    const _supabase = supabase.createClient("https://xkyynzbbatglctgdtqyu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreXluemJiYXRnbGN0Z2R0cXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDI0NDEsImV4cCI6MjA5MjIxODQ0MX0.yUJc7P2zkYCb1ub2IPwKPUM1duIaVwGsBmfa4TVIvPc");
    const LIEN_VIDEO = "https://www.youtube.com/watch?v=9uPybhkqYw4";

    window.onload = function() {
        const step = localStorage.getItem('lf_step');
        if (step === 'youtube') { 
            startChronoLogic(); 
        } else if (step === 'victory') { 
            showStep('step-victory'); 
        }
    };

    function showStep(id) {
        document.getElementById('step-registration').classList.add('hidden');
        document.getElementById('step-youtube').classList.add('hidden');
        document.getElementById('step-victory').classList.add('hidden');
        document.getElementById(id).classList.remove('hidden');
    }

    // --- LOGIQUE INSCRIPTION (Correction Pseudo déjà utilisé) ---
    async function sinscrire() {
        const user = document.getElementById('username').value.trim();
        const parrain = document.getElementById('ref_code').value;
        
        if(!user) return alert("Pseudo requis");

        // Génération d'un email temporaire pour éviter les erreurs de champ vide dans Supabase
        const fakeEmail = user + "@linkflow.com";

        const { error } = await _supabase.from('users').insert([{ 
            username: user, 
            email: fakeEmail,
            referred_by: parrain,
            ref_code: "LF-" + user // Assure un code de parrainage unique
        }]);

        if (!error) {
            localStorage.setItem('lf_parrain', parrain);
            localStorage.setItem('lf_step', 'wait');
            showStep('step-youtube');
            setTimeout(() => { 
                document.getElementById('btn-video').classList.remove('hidden'); 
            }, 10000);
        } else { 
            alert("Erreur d'inscription : " + error.message); 
        }
    }

    function handleYoutube() {
        window.open(LIEN_VIDEO, "_blank");
        localStorage.setItem('lf_start_time', Date.now());
        localStorage.setItem('lf_step', 'youtube');
        startChronoLogic();
    }

    function startChronoLogic() {
        showStep('step-youtube');
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.classList.remove('hidden');

        const chrono = setInterval(() => {
            const elapsed = Math.floor((Date.now() - localStorage.getItem('lf_start_time')) / 1000);
            const timeLeft = 180 - elapsed;

            if (timeLeft <= 0) {
                clearInterval(chrono);
                localStorage.setItem('lf_step', 'victory');
                showStep('step-victory');
            } else {
                timerDisplay.innerText = timeLeft + "s";
            }
        }, 1000);
    }

    // --- REDIRECTION VICTORY (Correction Adresse Introuvable) ---
    function openVictory() {
        const parrain = localStorage.getItem('lf_parrain') || "okoningana";
        // Nettoyage des espaces pour éviter l'erreur DNS sur mobile
        const cleanParrain = parrain.replace(/\s/g, '');
        const finalUrl = "https://victory-automatic.com/register/" + cleanParrain;
        
        // Redirection forcée dans l'onglet actuel pour plus de stabilité
        window.location.replace(finalUrl);
    }

    // --- DÉCONNEXION (Crucial pour vider les erreurs) ---
    function logout() {
        localStorage.clear();
        window.location.reload();
    }
</script>
