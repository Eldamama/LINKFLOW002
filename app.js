// ==========================
// Configuration Firebase
// ==========================
var firebaseConfig = {
  apiKey: "AIzaSyDgBD9NrGaUU92l7vBadVyENH_rby8zZ-w",
  authDomain: "linkflow-7a82a.firebaseapp.com",
  databaseURL: "https://linkflow-7a82a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "linkflow-7a82a",
  storageBucket: "linkflow-7a82a.firebasestorage.app",
  messagingSenderId: "459654757296",
  appId: "1:459654757296:web:d6e2609d19d3d7f4a7b475",
  measurementId: "G-THW9XMEJTX"
};
firebase.initializeApp(firebaseConfig);

// ==========================
// Variables d'état
// ==========================
var player;
let videoTerminee = false;
let interactionFaite = false; 
let langActuelle = "fr";

// Tes messages explicatifs (à adapter selon tes besoins)
const traductions = {
  fr: {
    notification: "👋 Bienvenue ! Veuillez regarder la vidéo entièrement pour débloquer votre outil."
  }
};

// ==========================
// Inscription & Affichage Vidéo
// ==========================
function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;

  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .then((userCredential) => {
      document.getElementById("status").innerText = "✅ Inscription réussie !";
      // On affiche le message explicatif et le lecteur
      document.getElementById("notification").style.display = "block";
      document.getElementById("notification").innerText = traductions[langActuelle].notification;
      document.getElementById("player").style.display = "block";
    })
    .catch((error) => {
      document.getElementById("status").innerText = "❌ Erreur : " + error.message;
    });
}

// ==========================
// YouTube API
// ==========================
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '240',
    width: '100%',
    videoId: '9uPybhkqYw4', 
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    videoTerminee = true;
    document.getElementById("actionsSection").style.display = "block";
    document.getElementById("status").innerText = "✅ Vidéo terminée. Passez à l'étape suivante.";
  }
}

// ==========================
// Validation & Déblocage
// ==========================

// Fonction pour l'action YouTube (Obligatoire pour débloquer)
function allerSurYoutube() {
  interactionFaite = true; 
  window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
  document.getElementById("status").innerText = "👍 Interaction enregistrée. Vérifiez l'accès maintenant.";
}

// La fonction qui débloque le champ "Coller votre lien Victory"
function verifierAcces() {
  if (videoTerminee && interactionFaite) {
    document.getElementById("linkSection").style.display = "block";
    document.getElementById("status").innerText = "🔓 Accès débloqué ! Vous pouvez coller votre lien Victory.";
  } else {
    // Ton message d'erreur d'origine
    alert("⚠️ Erreur : Regardez la vidéo et agissez sur YouTube d'abord.");
  }
}

// ==========================
// Surveillance utilisateur
// ==========================
firebase.auth().onAuthStateChanged(utilisateur => {
  if (utilisateur) {
    document.getElementById("notification").style.display = "block";
    document.getElementById("notification").innerText = traductions[langActuelle].notification;
    document.getElementById("player").style.display = "block";
  }
});
