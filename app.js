import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuration réelle extraite de tes paramètres Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDgBD9NrGaUU92l7vBadVyENH_rby8zZ-w",
  authDomain: "linkflow-7a82a.firebaseapp.com",
  databaseURL: "https://linkflow-7a82a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "linkflow-7a82a",
  storageBucket: "linkflow-7a82a.firebasestorage.app",
  messagingSenderId: "459654757296",
  appId: "1:459654757296:web:d6e2609d19d3d7f4a7b475"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let timeLeft = 120;
let isTimerStarted = false;

const btnAction = document.getElementById('btnAction');
const videoBox = document.getElementById('videoBox');
const stepsBox = document.getElementById('stepsBox');

function startTimer() {
    isTimerStarted = true;
    videoBox.classList.remove('hidden');
    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            btnAction.disabled = true;
            btnAction.innerText = `Validation Victory Hugo : ${timeLeft}s`;
        } else {
            clearInterval(timer);
            stepsBox.classList.remove('hidden'); 
            btnAction.innerText = "Cochez les 3 cases ci-dessus";
            btnAction.disabled = true;
        }
    }, 1000);
}

window.checkSteps = function() {
    const isLiked = document.getElementById('likeCheck').checked;
    const isCommented = document.getElementById('commentCheck').checked;
    const isSubbed = document.getElementById('subCheck').checked;

    if (timeLeft <= 0 && isLiked && isCommented && isSubbed) {
        btnAction.disabled = false;
        btnAction.innerText = "OBTENIR MON LIEN VICTOR HUGO";
        btnAction.style.background = "linear-gradient(135deg, #22c55e, #10b981)";
    }
};

btnAction.addEventListener('click', async () => {
    const user = auth.currentUser;

    if (!user && !isTimerStarted) {
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const pass = document.getElementById('userPassword').value;

        if (!name || !email || !pass) return alert("Veuillez remplir tous les champs.");

        try {
            btnAction.innerText = "Connexion Firebase...";
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(res.user, { displayName: name });
            alert("Compte créé ! Suivez la vidéo pour débloquer le lien Victor Hugo.");
            startTimer();
        } catch (e) { 
            alert("Erreur de configuration : " + e.message);
        }
    } else if (user && timeLeft <= 0) {
        if (!user.emailVerified) {
            await sendEmailVerification(user);
            alert("Vérifiez votre Gmail pour activer le lien Victor Hugo !");
        } else {
            await set(ref(db, 'membres/' + user.uid), { 
                nom: user.displayName, 
                email: user.email, 
                statut: "Victory Hugo" 
            });
            window.location.href = "dashboard.html";
        }
    }
});
