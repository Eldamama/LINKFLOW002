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
// Fonctions d'authentification
// ==========================

// Inscription
function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;

  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("status").innerText = "✅ Inscription réussie : " + user.email;
    })
    .catch((error) => {
      console.error("Erreur Firebase:", error.code, error.message);
      document.getElementById("status").innerText = "❌ Erreur : " + error.code + " - " + error.message;
    });
}

// Connexion
function connecter() {
  const email = document.getElementById("emailConnexion").value;
  const mdp = document.getElementById("mdpConnexion").value;

  firebase.auth().signInWithEmailAndPassword(email, mdp)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("status").innerText = "✅ Connexion réussie : " + user.email;
    })
    .catch((error) => {
      console.error("Erreur Firebase:", error.code, error.message);
      document.getElementById("status").innerText = "❌ Erreur : " + error.code + " - " + error.message;
    });
}

// Déconnexion
function deconnecter() {
  firebase.auth().signOut()
    .then(() => {
      document.getElementById("status").innerText = "ℹ️ Déconnexion réussie";
      // Effacer les champs
      document.getElementById("emailInscription").value = "";
      document.getElementById("mdpInscription").value = "";
      document.getElementById("emailConnexion").value = "";
      document.getElementById("mdpConnexion").value = "";
      // Masquer sections
      document.getElementById("notification").style.display = "none";
      document.getElementById("player").style.display = "none";
      document.getElementById("actionsSection").style.display = "none";
      document.getElementById("linkSection").style.display = "none";
    })
    .catch((error) => {
      console.error("Erreur Firebase:", error.code, error.message);
      document.getElementById("status").innerText = "❌ Erreur : " + error.code + " - " + error.message;
    });
}

// ==========================
// Surveiller état utilisateur
// ==========================
let langActuelle = "fr";
document.getElementById("langSelect").addEventListener("change", e => {
  langActuelle = e.target.value;
});

firebase.auth().onAuthStateChanged(utilisateur => {
  if (utilisateur) {
    document.getElementById("notification").style.display = "block";
    document.getElementById("notification").innerText = traductions[langActuelle].notification;
    document.getElementById("player").style.display = "block";
  } else {
    document.getElementById("notification").style.display = "none";
    document.getElementById("player").style.display = "none";
    document.getElementById("actionsSection").style.display = "none";
    document.getElementById("linkSection").style.display = "none";
  }
});

// ==========================
// YouTube API
// ==========================
var player;
let videoTerminee = false;
let interactionFaite = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '240',
    width: '320',
    videoId: '9uPybhkqYw4', // ID réel de ta vidéo YouTube
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    videoTerminee = true;
    document.getElementById("actionsSection").style.display = "block";
  }
}

function verifierAcces() {
  if (videoTerminee && interactionFaite) {
    document.getElementById("linkSection").style.display = "block";
  } else {
    document.getElementById("status").innerText = "⚠️ Vous devez terminer la vidéo et interagir avant d'accéder au lien.";
  }
}
