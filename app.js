// ==========================================
// 1. PROTECTION ANTI-TRICHE (Bloquer Inspecteur)
// ==========================================
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
  if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67))) {
    return false;
  }
};

// ==========================================
// 2. CONFIGURATION FIREBASE
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

// Variables d'état sécurisées
var player;
let _0x_vT = false; // Vidéo terminée
let _0x_iF = false; // Interaction YouTube faite

// ==========================================
// 3. SURVEILLANCE ET PROTECTION REDIRECTION
// ==========================================
firebase.auth().onAuthStateChanged(user => {
  const authSection = document.getElementById("authSection");
  const mainContent = ["notification", "player", "actionsSection"];

  if (user) {
    // Utilisateur connecté
    if(authSection) authSection.style.display = "none";
    document.getElementById("notification").style.display = "block";
    document.getElementById("notification").innerText = "👋 Bienvenue ! Regardez la vidéo pour débloquer l'outil.";
    document.getElementById("player").style.display = "block";
  } else {
    // Utilisateur déconnecté : on cache tout et on force la connexion
    mainContent.forEach(id => {
      if(document.getElementById(id)) document.getElementById(id).style.display = "none";
    });
    if(document.getElementById("linkSection")) document.getElementById("linkSection").style.display = "none";
    if(authSection) authSection.style.display = "block";
    document.getElementById("status").innerText = "Veuillez vous inscrire ou vous connecter.";
  }
});

// ==========================================
// 4. LOGIQUE YOUTUBE API
// ==========================================
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '240',
    width: '100%',
    videoId: '9uPybhkqYw4',
    events: { 'onStateChange': onPlayerStateChange }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    _0x_vT = true;
    document.getElementById("actionsSection").style.display = "block";
    document.getElementById("status").innerText = "✅ Vidéo finie ! Cliquez sur le bouton YouTube.";
  }
}

// ==========================================
// 5. ACTIONS ET DÉBLOCAGE DU LIEN
// ==========================================

function allerSurYoutube() {
  _0x_iF = true;
  window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
  document.getElementById("status").innerText = "👍 Interaction validée. Cliquez sur Étape 2.";
}

function verifierAcces() {
  if (_0x_vT && _0x_iF) {
    // DÉBLOCAGE : On affiche la section pour coller le lien Victory
    document.getElementById("linkSection").style.display = "block";
    document.getElementById("status").innerText = "🔓 Accès débloqué. Collez votre lien ci-dessous.";
    document.getElementById("linkSection").scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("⚠️ Erreur : Regardez la vidéo et agissez sur YouTube d'abord.");
  }
}

// ==========================================
// 6. FONCTIONS AUTHENTIFICATION
// ==========================================
function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;
  if(!email || !mdp) return alert("Remplissez les champs");

  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .catch(error => alert("Erreur: " + error.message));
}

function deconnecter() {
  firebase.auth().signOut().then(() => { location.reload(); });
}
