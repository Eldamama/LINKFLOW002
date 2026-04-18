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

function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;
  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .then((userCredential) => {
      document.getElementById("status").innerText = "✅ Inscription réussie : " + userCredential.user.email;
    })
    .catch((error) => {
      document.getElementById("status").innerText = "❌ Erreur : " + error.message;
    });
}

function connecter() {
  const email = document.getElementById("emailConnexion").value;
  const mdp = document.getElementById("mdpConnexion").value;
  firebase.auth().signInWithEmailAndPassword(email, mdp)
    .then((userCredential) => {
      document.getElementById("status").innerText = "✅ Connexion réussie";
    })
    .catch((error) => {
      document.getElementById("status").innerText = "❌ Erreur : " + error.message;
    });
}

function deconnecter() {
  firebase.auth().signOut()
    .then(() => {
      document.getElementById("status").innerText = "ℹ️ Déconnexion réussie";
      ["emailInscription", "mdpInscription", "emailConnexion", "mdpConnexion"].forEach(id => document.getElementById(id).value = "");
      document.getElementById("notification").style.display = "none";
      document.getElementById("player").style.display = "none";
      document.getElementById("actionsSection").style.display = "none";
      document.getElementById("linkSection").style.display = "none";
    });
}

// ==========================
// Gestion de l'état et Langue
// ==========================
let langActuelle = "fr";
// Note : Assurez-vous que votre objet 'traductions' est bien défini ailleurs dans votre code
firebase.auth().onAuthStateChanged(utilisateur => {
  if (utilisateur) {
    document.getElementById("notification").style.display = "block";
    document.getElementById("player").style.display = "block";
  } else {
    ["notification", "player", "actionsSection", "linkSection"].forEach(id => document.getElementById(id).style.display = "none");
  }
});

// ==========================
// YouTube API & Logique de Verrouillage
// ==========================
var player;
let videoTerminee = false;
let interactionFaite = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '240',
    width: '100%', // Adapté au mobile
    videoId: '9uPybhkqYw4', 
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // Quand la vidéo est finie
  if (event.data === YT.PlayerState.ENDED) {
    videoTerminee = true;
    document.getElementById("actionsSection").style.display = "block";
    document.getElementById("status").innerText = "✅ Vidéo terminée. Cliquez sur le bouton YouTube.";
  }
}

// --- FONCTION CRUCIALE AJOUTÉE ---
function allerSurYoutube() {
  interactionFaite = true;
  // Ouvre la vidéo ou votre chaîne dans un nouvel onglet
  window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
  document.getElementById("status").innerText = "👍 Interaction enregistrée. Vous pouvez vérifier l'accès.";
}

function verifierAcces() {
  if (videoTerminee && interactionFaite) {
    document.getElementById("linkSection").style.display = "block";
    document.getElementById("status").innerText = "🎉 Accès débloqué !";
    // Optionnel : Scroll automatique vers le lien
    document.getElementById("linkSection").scrollIntoView({ behavior: 'smooth' });
  } else {
    // Message d'alerte identique à votre capture d'écran
    alert("⚠️ Erreur : Regardez la vidéo et agissez sur YouTube d'abord.");
    document.getElementById("status").innerText = "⚠️ Conditions non remplies.";
  }
}
