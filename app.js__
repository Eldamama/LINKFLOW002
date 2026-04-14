const APP_NAME = "LinkFlow System";
const VIDEO_LINK = "TON_LIEN_YOUTUBE"; // À REMPLACER

// GESTION NOTIFICATIONS
function showNotify(msg, type = 'info') {
    const notify = document.getElementById('notification');
    notify.innerText = msg;
    notify.className = type;
    notify.classList.remove('hidden');
}

// INSCRIPTION
function register() {
    const consent = document.getElementById('consentCheck').checked;
    if (!username.value || !whatsapp.value || !consent) {
        showNotify("Veuillez remplir les champs et cocher la case de compréhension.", "error");
        return;
    }

    let user = {
        username: username.value,
        whatsapp: whatsapp.value,
        usdt: usdt.value,
        referralCode: "LF-" + Math.random().toString(36).substr(2, 6)
    };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "video.html";
}

// TIMER & VALIDATION
let countdown = 180;
function startTimer() {
    let btn = document.getElementById("getLinkBtn");
    let interval = setInterval(() => {
        countdown--;
        btn.innerText = "Déblocage dans " + countdown + "s";
        if (countdown <= 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.innerText = "ACCÉDER À LA PLATEFORME";
            localStorage.setItem("timerDone", true);
            showNotify("Le lien est maintenant disponible !", "success");
        }
    }, 1000);
}

function unlockAccess() {
    if (like.checked && comment.checked && subscribe.checked) {
        localStorage.setItem("videoDone", true);
        showNotify("Actions validées ! Attendez la fin du décompte.", "success");
    } else {
        showNotify("Veuillez compléter toutes les interactions YouTube.", "error");
    }
}

function saveLink() {
    if(!victoryLink.value) {
        showNotify("Collez votre lien partenaire d'abord.", "error");
        return;
    }
    let user = JSON.parse(localStorage.getItem("user"));
    user.partnerLink = victoryLink.value;
    localStorage.setItem("user", JSON.stringify(user));
    
    let link = window.location.origin + "?ref=" + user.referralCode;
    document.getElementById("resultBox").classList.remove("hidden");
    document.getElementById("result").innerText = link;
    showNotify("Votre lien LinkFlow est prêt !", "success");
}

function copyLink() {
    const link = document.getElementById("result").innerText;
    navigator.clipboard.writeText(link);
    alert("Lien copié !");
}
