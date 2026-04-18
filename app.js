// ==========================================
// 1. CONFIGURATION FIREBASE
// ==========================================
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

// ==========================================
// 2. VARIABLES D'ÉTAT (Le coeur du problème)
// ==========================================
var player;
let videoTerminee = false;
let interactionFaite = false;
let langActuelle = "fr";

// ==========================================
// 3. LOGIQUE YOUTUBE (API PLAYER)
// ==========================================
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '240',
    width: '100%',
    videoId: '9uPybhkqYw4', // Ton ID vidéo
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // Déclenche quand la vidéo est finie
  if (event.data === YT.PlayerState.ENDED) {
    videoTerminee = true;
    document.getElementById("actionsSection").style.display = "block";
    document.getElementById("status").innerText = "✅ Vidéo terminée ! Cliquez sur le bouton rouge.";
  }
}

// ==========================================
// 4. FONCTIONS D'ACCÈS (Redirection)
// ==========================================

// Appelée par le bouton rouge (S'abonner/Like)
function allerSurYoutube() {
  interactionFaite = true;
  window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
  document.getElementById("status").innerText = "👍 Action enregistrée. Vérifiez l'accès.";
}

// Appelée par le bouton "ÉTAPE 2" (Vérification)
function verifierAcces() {
  if (videoTerminee && interactionFaite) {
    document.getElementById("linkSection").style.display = "block";
    document.getElementById("status").innerText = "🎉 Félicitations ! Lien débloqué.";
    document.getElementById("linkSection").scrollIntoView({ behavior: 'smooth' });
  } else {
    // Message exact de ton erreur
    alert("⚠️ Erreur : Regardez la vidéo et agissez sur YouTube d'abord.");
  }
}

// ==========================================
// 5. AUTHENTIFICATION FIREBASE
// ==========================================
function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;
  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .then((u) => { document.getElementById("status").innerText = "✅ Compte créé : " + u.user.email; })
    .catch((e) => { document.getElementById("status").innerText = "❌ " + e.message; });
}

function connecter() {
  const email = document.getElementById("emailConnexion").value;
  const mdp = document.getElementById("mdpConnexion").value;
  firebase.auth().signInWithEmailAndPassword(email, mdp)
    .then(() => { document.getElementById("status").innerText = "✅ Connecté avec succès"; })
    .catch((e) => { document.getElementById("status").innerText = "❌ " + e.message; });
}

function deconnecter() {
  firebase.auth().signOut().then(() => { location.reload(); });
}

// Surveillance de la session
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("notification").style.display = "block";
    document.getElementById("player").style.display = "block";
    // On cache le formulaire de connexion une fois connecté
    if(document.getElementById("authSection")) document.getElementById("authSection").style.display = "none";
  } else {
    // On cache tout si déconnecté
    const ids = ["notification", "player", "actionsSection", "linkSection"];
    ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = "none"; });
  }
});
