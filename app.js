import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// TA CONFIGURATION RÉELLE
const firebaseConfig = {
  apiKey: "AIzaSyDgBD9NrGaUU92l7vBadVyENH_rby8zZ-w",
  authDomain: "linkflow-7a82a.firebaseapp.com",
  databaseURL: "https://linkflow-7a82a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "linkflow-7a82a",
  storageBucket: "linkflow-7a82a.firebasestorage.app",
  messagingSenderId: "459654757296",
  appId: "1:459654757296:web:d6e2609d19d3d7f4a7b475",
  measurementId: "G-THW9XMEJTX"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let timeLeft = 120;
let isTimerStarted = false;

const btnAction = document.getElementById('btnAction');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const passInput = document.getElementById('userPassword');

// Fonction du chronomètre
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

// Logique du bouton
btnAction.addEventListener('click', async () => {
    const user = auth.currentUser;

    // 1. Inscription et lancement du chrono
    if (!user && !isTimerStarted) {
        const name = nameInput.value;
        const email = emailInput.value;
        const password = passInput.value;

        if (!name || !email || !password) {
            alert("Veuillez remplir le nom, l'email et le mot de passe.");
            return;
        }

        try {
            btnAction.innerText = "Inscription...";
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            
            alert("Compte créé ! Regardez la vidéo (120s) pour débloquer l'activation.");
            startTimer();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
        return;
    }

    // 2. Validation finale après les 120s
    if (user && timeLeft <= 0) {
        if (!user.emailVerified) {
            try {
                await sendEmailVerification(user);
                alert("Lien de confirmation envoyé à votre adresse Gmail ! Vérifiez vos mails.");
            } catch (error) {
                alert("Erreur d'envoi : " + error.message);
            }
        } else {
            try {
                await set(ref(db, 'membres/' + user.uid), {
                    nom: user.displayName,
                    email: user.email,
                    statut: "actif",
                    date: new Date().toLocaleDateString()
                });
                alert("Bravo ! Accès LinkFlow activé.");
                window.location.href = "dashboard.html";
            } catch (error) {
                alert("Erreur de sauvegarde : " + error.message);
            }
        }
    }
});

btnAction.innerText = "S'INSCRIRE & LANCER LE CHRONO";
