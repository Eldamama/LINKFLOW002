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
let interactionFaite = false; // C'était la cause du blocage

// ==========================
// YouTube API
// ==========================
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '240',
    width: '320',
    videoId: '9uPybhkqYw4', 
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    videoTerminee = true;
    // On affiche la section des boutons d'action
    document.getElementById("actionsSection").style.display = "block";
    document.getElementById("status").innerText = "✅ Vidéo terminée. Cliquez sur le bouton YouTube ci-dessous.";
  }
}

// ==========================
// Logique de validation (Réparée)
// ==========================

// ÉTAPE 1 : L'utilisateur clique pour aller sur YouTube
function allerSurYoutube() {
  interactionFaite = true; // IMPORTANT : On valide l'interaction ici
  window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
  document.getElementById("status").innerText = "👍 Action enregistrée. Cliquez sur l'étape 2.";
}

// ÉTAPE 2 : On vérifie et on affiche le champ pour coller le lien Victory
function verifierAcces() {
  if (videoTerminee && interactionFaite) {
    // On affiche enfin la section pour coller le lien et générer le lien LINKFLOW
    document.getElementById("linkSection").style.display = "block";
    document.getElementById("status").innerText = "✅ Accès autorisé ! Collez votre lien Victory ci-dessous.";
  } else {
    // L'erreur que tu avais
    alert("⚠️ Erreur : Regardez la vidéo et agissez sur YouTube d'abord.");
  }
}

// ==========================
// Authentification simple
// ==========================
function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;

  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .then((userCredential) => {
      document.getElementById("status").innerText = "✅ Inscription réussie. Regardez la vidéo.";
      document.getElementById("player").style.display = "block"; // Affiche le lecteur
    })
    .catch((error) => {
      document.getElementById("status").innerText = "❌ Erreur : " + error.message;
    });
}
