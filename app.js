import { app } from './firebase-config.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendEmailVerification, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
    getDatabase, 
    ref, 
    set 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Initialisation des services
const auth = getAuth(app);
const db = getDatabase(app);

// RÉGLAGE DU TEMPS : 120 secondes pour le visionnage complet
let timeLeft = 120; 

const btnAction = document.getElementById('btnAction');
const notification = document.getElementById('notification');
const emailInput = document.getElementById('userEmail');
const passInput = document.getElementById('userPassword');
const walletInput = document.getElementById('userWallet'); // Champ utilisé comme identifiant réseau

// 1. Gestion du Compte à rebours
const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
        btnAction.innerText = `Visionnage de la présentation (${timeLeft}s)...`;
    } else {
        clearInterval(timer);
        btnAction.innerText = "Validation des étapes...";
        checkForm(); 
    }
}, 1000);

// 2. Vérification des conditions
window.checkForm = function() {
    const user = auth.currentUser;
    const isLiked = document.getElementById('likeCheck').checked;
    const isCommented = document.getElementById('commentCheck').checked;
    const isSubbed = document.getElementById('subCheck').checked;

    if (timeLeft <= 0 && isLiked && isCommented && isSubbed) {
        if (!user) {
            btnAction.innerText = "CRÉER MON ACCÈS";
            btnAction.disabled = false;
            btnAction.style.background = "#3b82f6"; 
        } else if (!user.emailVerified) {
            btnAction.innerText = "VÉRIFIER MON GMAIL";
            btnAction.disabled = false;
            btnAction.style.background = "#f59e0b"; 
        } else {
            btnAction.innerText = "ACTIVER MON RÉSEAU";
            btnAction.disabled = false;
            btnAction.style.background = "linear-gradient(135deg, #22c55e, #10b981)";
        }
    } else {
        btnAction.disabled = true;
        if (timeLeft <= 0) {
            btnAction.innerText = "Finalisez les 3 étapes";
            btnAction.style.background = "#475569";
        }
    }
};

onAuthStateChanged(auth, () => checkForm());
document.querySelectorAll('input[type="checkbox"]').forEach(ck => ck.addEventListener('change', checkForm));

// 3. Logique du Bouton Action
btnAction.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passInput.value;
    const wallet = walletInput.value;
    const user = auth.currentUser;

    if (!user) {
        if (!email || !password || !wallet) {
            alert("Veuillez remplir tous les champs pour votre identification.");
            return;
        }
        try {
            btnAction.innerText = "Initialisation...";
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Identifiants enregistrés ! Vérifiez maintenant votre boîte mail.");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                await signInWithEmailAndPassword(auth, email, password).catch(e => alert("Mot de passe incorrect"));
            } else {
                alert(error.message);
            }
        }
        return;
    }

    if (!user.emailVerified) {
        try {
            await sendEmailVerification(user);
            notification.innerText = "Lien d'activation envoyé ! Vérifiez vos courriels.";
            notification.classList.remove('hidden');
            alert("Consultez votre messagerie pour confirmer votre accès.");
        } catch (error) {
            alert("Erreur lors de l'envoi : " + error.message);
        }
        return;
    }

    if (user.emailVerified) {
        try {
            // Sauvegarde des informations de structure du membre
            await set(ref(db, 'membres/' + user.uid), {
                email: user.email,
                identifiantReseau: wallet,
                dateActivation: new Date().toLocaleDateString(),
                statut: "actif"
            });
            alert("Accès validé ! Bienvenue dans l'écosystème LinkFlow.");
            window.location.href = "dashboard.html"; 
        } catch (error) {
            alert("Erreur de validation : " + error.message);
        }
    }
});
