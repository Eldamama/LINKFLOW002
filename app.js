import { app } from './firebase-config.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const auth = getAuth(app);
const db = getDatabase(app);

let timeLeft = 120;
let isTimerStarted = false;

const btnAction = document.getElementById('btnAction');
const emailInput = document.getElementById('userEmail');
const passInput = document.getElementById('userPassword');
const walletInput = document.getElementById('userWallet');

// Fonction pour gérer le compte à rebours
function startTimer() {
    isTimerStarted = true;
    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            btnAction.disabled = true;
            btnAction.innerText = `Visionnage obligatoire : ${timeLeft}s`;
            btnAction.style.background = "#475569";
        } else {
            clearInterval(timer);
            btnAction.disabled = false;
            btnAction.innerText = "ACTIVER MON ACCÈS FINAL";
            btnAction.style.background = "linear-gradient(135deg, #22c55e, #10b981)";
        }
    }, 1000);
}

// Action principale du bouton
btnAction.addEventListener('click', async () => {
    const user = auth.currentUser;

    // ÉTAPE 1 : Soumission initiale (Création de compte)
    if (!user && !isTimerStarted) {
        const email = emailInput.value;
        const password = passInput.value;
        const wallet = walletInput.value;

        if (!email || !password || !wallet) {
            alert("Remplissez tous les champs avant de démarrer.");
            return;
        }

        try {
            btnAction.innerText = "Initialisation...";
            await createUserWithEmailAndPassword(auth, email, password);
            
            // Le compte est créé, on lance maintenant le chrono
            alert("Compte enregistré ! Suivez maintenant la vidéo (120s) pour valider votre accès.");
            startTimer();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
        return;
    }

    // ÉTAPE 2 : Une fois le chrono fini, on gère la vérification d'email
    if (user && timeLeft <= 0) {
        if (!user.emailVerified) {
            try {
                await sendEmailVerification(user);
                alert("Lien envoyé ! Vérifiez votre boîte Gmail pour confirmer votre accès.");
            } catch (error) {
                alert("Erreur mail : " + error.message);
            }
        } else {
            // ÉTAPE 3 : Sauvegarde finale si mail OK
            try {
                await set(ref(db, 'membres/' + user.uid), {
                    email: user.email,
                    identifiant: walletInput.value,
                    statut: "actif",
                    date: new Date().toLocaleDateString()
                });
                alert("Félicitations ! Accès activé.");
                window.location.href = "dashboard.html";
            } catch (error) {
                alert("Erreur de sauvegarde : " + error.message);
            }
        }
    }
});

// Initialisation du bouton au départ
btnAction.disabled = false;
btnAction.innerText = "S'INSCRIRE & LANCER LA VIDÉO";
