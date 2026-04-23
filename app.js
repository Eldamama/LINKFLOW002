<script>
    // --- CONFIGURATION ---
    const _supabase = supabase.createClient("https://xkyynzbbatglctgdtqyu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreXluemJiYXRnbGN0Z2R0cXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDI0NDEsImV4cCI6MjA5MjIxODQ0MX0.yUJc7P2zkYCb1ub2IPwKPUM1duIaVwGsBmfa4TVIvPc");
    const MON_LIEN_RACINE = "okoningana";
    const LIEN_VIDEO = "https://www.youtube.com/watch?v=9uPybhkqYw4";
    
    let timeLeft = 180; // 3 minutes globales
    let timerInterval;

    const translations = {
        fr: { title: "🔗 Inscription LINKFLOW", sub: "Rejoins la matrice racine", btn: "S'INSCRIRE MAINTENANT", wait: "Patientez...", support: "📺 Soutien Organique", already: "Déjà inscrit ?" },
        en: { title: "🔗 LINKFLOW Registration", sub: "Join the root matrix", btn: "REGISTER NOW", wait: "Wait...", support: "📺 Organic Support", already: "Already registered?" },
        sw: { title: "🔗 Usajili wa LINKFLOW", sub: "Jiunge na tumbo la mizizi", btn: "JISAJILI SASA", wait: "Subiri...", support: "📺 Msaada wa Kikaboni", already: "Umejisajili tayari?" },
        ln: { title: "🔗 Kokoma nkombo LINKFLOW", sub: "Kota na kati ya mobu", btn: "KOMISA NKOMBO SASA", wait: "Zela...", support: "📺 Lisungi ya Mobu", already: "Okomisaki nkombo ?" },
        es: { title: "🔗 Registro LINKFLOW", sub: "Únete a la matriz raíz", btn: "REGISTRARSE AHORA", wait: "Espere...", support: "📺 Soporte Orgánico", already: "¿Ya estás registrado?" },
        pt: { title: "🔗 Registro LINKFLOW", sub: "Junte-se à matriz raiz", btn: "REGISTRE-SE AGORA", wait: "Aguarde...", support: "📺 Suporte Orgânico", already: "Já tem conta?" }
    };

    function showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg; t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }

    // Gestion du parrainage
    const urlParams = new URLSearchParams(window.location.search);
    const parrainID = urlParams.get('ref') || MON_LIEN_RACINE;
    document.getElementById('ref_code').value = parrainID;

    // --- 1. INSCRIPTION ET LANCEMENT DU COMPTEUR ---
    async function sinscrire() {
        const user = document.getElementById('username').value.trim();
        const mail = document.getElementById('email').value.trim();
        if(!user || !mail) { alert("Veuillez remplir tous les champs"); return; }
        
        const l = document.getElementById('langSelect').value;
        document.getElementById('t-btn').innerText = translations[l].wait;

        const { error } = await _supabase.from('users').insert([{ 
            username: user, 
            email: mail, 
            referred_by: parrainID,
            ref_code: "TEMP_" + user.toLowerCase().replace(/\s/g, '')
        }]);

        if (error) { 
            alert("Erreur : " + error.message); 
            document.getElementById('t-btn').innerText = translations[l].btn;
        } else {
            showToast("Inscription réussie !");
            // Passage à l'étape Youtube
            document.getElementById('step-registration').classList.add('hidden');
            document.getElementById('step-youtube').classList.remove('hidden');
            
            // LANCEMENT DU CHRONO IMMÉDIAT
            demarrerCompteur();
        }
    }

    // --- 2. GESTION DU CHRONO ---
    function demarrerCompteur() {
        const countDisplay = document.getElementById('countdown');
        
        timerInterval = setInterval(() => {
            timeLeft--;
            if (countDisplay) countDisplay.innerText = timeLeft + "s";
            
            if(timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById('step-youtube').classList.add('hidden');
                document.getElementById('step-victory').classList.remove('hidden');
                showToast("Soutien validé !");
            }
        }, 1000);
    }

    // --- 3. OUVERTURE VIDÉO ---
    function handleYoutube() {
        window.open(LIEN_VIDEO, "_blank");
        const btn = document.getElementById('btn-video');
        btn.innerText = "VIDÉO OUVERTE ✅";
        btn.disabled = true; // Empêche d'ouvrir plusieurs onglets
    }

    // --- 4. VICTORY ET ACTIVATION ---
    function openVictory() {
        window.open(`https://victory-automatic.com/register/${parrainID}`, "_blank");
    }

    async function activerMonLien() {
        const user = document.getElementById('username').value;
        const link = document.getElementById('victory-link-input').value.trim();
        if(!link) { alert("Collez votre lien Victory"); return; }

        const parties = link.split('/');
        const finalID = parties[parties.length - 1] || parties[parties.length - 2];

        const { error } = await _supabase.from('users').update({ ref_code: finalID }).eq('username', user);

        if(!error) {
            showToast("Félicitations ! Système activé.");
            document.getElementById('step-victory').classList.add('hidden');
            document.getElementById('step-share').classList.remove('hidden');
            document.getElementById('step-share').setAttribute('data-my-id', finalID);
        } else {
            alert("Erreur : " + error.message);
        }
    }

    // --- 5. PARTAGE ---
    function shareLink() {
        const myID = document.getElementById('step-share').getAttribute('data-my-id');
        const link = window.location.origin + window.location.pathname + "?ref=" + myID;
        if (navigator.share) {
            navigator.share({ title: 'LINKFLOW', text: 'Rejoins mon équipe sur Victory !', url: link });
        } else {
            alert("Copie ton lien : " + link);
        }
    }

    function changeLang() {
        const l = document.getElementById('langSelect').value;
        document.getElementById('t-title').innerText = translations[l].title;
        document.getElementById('t-subtitle').innerText = translations[l].sub;
        document.getElementById('t-btn').innerText = translations[l].btn;
        document.getElementById('t-support').innerText = translations[l].support;
        document.getElementById('t-already').innerText = translations[l].already;
    }
    
    changeLang();
</script>
