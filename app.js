import { app } from './firebase-config.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const auth = getAuth(app);
const db = getDatabase(app);

let timeLeft = 120;
let isTimerStarted = false;

const btnAction = document.getElementById('btnAction');
const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');
const passInput = document.getElementById('userPassword');

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

btnAction.addEventListener('click', async () => {
    const user = auth.currentUser;

    // ÉTAPE 1 : Inscription et lancement du chrono
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
            
            // On ajoute le Nom d'utilisateur au profil Firebase
            await updateProfile(userCredential.user, { displayName: name });
            
            alert("Inscription réussie ! Le décompte de 120s commence pour valider votre accès.");
            startTimer();
        } catch (error) {
            alert("Erreur : " + error.message);
        }
        return;
    }

    // ÉTAPE 2 : Validation après les 120s
    if (user && timeLeft <= 0) {
        if (!user.emailVerified) {
            try {
                await sendEmailVerification(user);
                alert("Lien de confirmation envoyé à votre adresse Gmail.");
            } catch (error) {
                alert("Erreur d'envoi : " + error.message);
            }
        } else {
            // Sauvegarde finale dans la Database
            try {
                await set(ref(db, 'membres/' + user.uid), {
                    nom: user.displayName,
                    email: user.email,
                    statut: "actif",
                    date: new Date().toLocaleDateString()
                });
                alert("Accès activé avec succès !");
                window.location.href = "dashboard.html";
            } catch (error) {
                alert("Erreur réseau : " + error.message);
            }
        }
    }
});

btnAction.innerText = "S'INSCRIRE & LANCER LE CHRONO";
