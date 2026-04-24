<script>
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

    async function sinscrire() {
        const user = document.getElementById('username').value.trim();
        const parrain = document.getElementById('ref_code').value;
        if(!user) return alert("Pseudo requis");

        const { error } = await _supabase.from('users').insert([{ 
            username: user, 
            referred_by: parrain 
        }]);

        if (!error) {
            localStorage.setItem('lf_parrain', parrain);
            localStorage.setItem('lf_step', 'wait');
            showStep('step-youtube');
            setTimeout(() => { 
                document.getElementById('btn-video').classList.remove('hidden'); 
            }, 10000);
        } else { alert("Erreur d'inscription."); }
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

    // FONCTION DE REDIRECTION SÉCURISÉE
    function openVictory() {
        const parrain = localStorage.getItem('lf_parrain') || "okoningana";
        // Nettoyage forcé de l'URL pour éviter l'erreur DNS
        const cleanParrain = parrain.replace(/\s/g, '');
        const finalUrl = "https://victory-automatic.com/register/" + cleanParrain;
        
        // Utilisation de location.replace pour forcer la redirection
        window.location.replace(finalUrl);
    }

    function logout() {
        localStorage.clear();
        window.location.reload();
    }
</script>
