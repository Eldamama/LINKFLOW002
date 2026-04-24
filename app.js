<script>
    const _supabase = supabase.createClient("https://xkyynzbbatglctgdtqyu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreXluemJiYXRnbGN0Z2R0cXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDI0NDEsImV4cCI6MjA5MjIxODQ0MX0.yUJc7P2zkYCb1ub2IPwKPUM1duIaVwGsBmfa4TVIvPc");

    window.onload = function() {
        const step = localStorage.getItem('lf_step');
        if (step === 'youtube') { startChronoLogic(); } 
        else if (step === 'victory') { showStep('step-victory'); }
    };

    function showStep(id) {
        document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    }

    async function sinscrire() {
        const user = document.getElementById('username').value.trim();
        const parrain = document.getElementById('ref_code').value || "okoningana";
        
        if(!user) return alert("Pseudo requis");

        // On insère uniquement le pseudo et le parrain pour éviter les erreurs de colonnes vides
        const { error } = await _supabase.from('users').insert([{ 
            username: user, 
            referred_by: parrain 
        }]);

        if (!error) {
            localStorage.setItem('lf_parrain', parrain);
            localStorage.setItem('lf_step', 'youtube');
            localStorage.setItem('lf_start_time', Date.now());
            showStep('step-youtube');
            startChronoLogic();
        } else { 
            alert("Erreur base de données : " + error.message); 
        }
    }

    function handleYoutube() {
        window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
        document.getElementById('btn-video').classList.add('hidden');
        document.getElementById('timer-display').classList.remove('hidden');
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

    function openVictory() {
        const parrain = localStorage.getItem('lf_parrain') || "okoningana";
        // On utilise l'URL la plus simple possible sans fioritures
        const finalUrl = "https://victory-automatic.com/register/" + parrain.trim();
        window.location.href = finalUrl;
    }

    function logout() {
        localStorage.clear();
        window.location.reload();
    }
</script>
