// Configuration Firebase
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

// Inscription
function inscrire() {
  const email = document.getElementById("emailInscription").value;
  const mdp = document.getElementById("mdpInscription").value;
  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .then(u => alert("Inscription réussie : " + u.user.email))
    .catch(e => {
      console.error("Erreur Firebase:", e.code);
      alert("Erreur : " + e.code + " - " + e.message);
    });
}

// Connexion
function connecter() {
  const email = document.getElementById("emailConnexion").value;
  const mdp = document.getElementById("mdpConnexion").value;
  firebase.auth().signInWithEmailAndPassword(email, mdp)
    .then(u => alert("Connexion réussie : " + u.user.email))
    .catch(e => {
      console.error("Erreur Firebase:", e.code);
      alert("Erreur : " + e.code + " - " + e.message);
    });
}

// Déconnexion
function deconnecter() {
  firebase.auth().signOut()
    .then(() => {
      alert("Déconnexion réussie");
      // Effacer les champs du formulaire
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
    .catch(e => {
      console.error("Erreur Firebase:", e.code);
      alert("Erreur : " + e.code + " - " + e.message);
    });
}

// Surveiller état utilisateur
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

// YouTube API
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
  }
}

document.getElementById("likeBtn").addEventListener("click", () => {
  interactionFaite = true;
  verifierAcces();
});
document.getElementById("commentBtn").addEventListener("click", () => {
  interactionFaite = true;
  verifierAcces();
});

// Traductions multilingues
const traductions = {
  fr: {
    notification: "✅ Vous êtes connecté à LINK FLOW ! Pour accéder à Victor Automatic, vous devez d’abord regarder la vidéo et interagir (like ou commentaire). Cette étape est essentielle : elle permet de stimuler l’algorithme YouTube, d’augmenter la visibilité de notre contenu et d’assurer la vitalité et la progression collective du réseau."
  },
  en: {
    notification: "✅ You are logged in to LINK FLOW! To access Victor Automatic, you must first watch the video and interact (like or comment). This step is crucial: it helps activate the YouTube algorithm, boost our content’s visibility, and ensure the network’s collective vitality and growth."
  },
  es: {
    notification: "✅ ¡Has iniciado sesión en LINK FLOW! Para acceder a Victor Automatic, primero debes ver el video e interactuar (like o comentario). Este paso es esencial: permite activar el algoritmo de YouTube, aumentar la visibilidad de nuestro contenido y asegurar la vitalidad y el progreso colectivo de la red."
  },
  pt: {
    notification: "✅ Você está conectado ao LINK FLOW! Para acessar Victor Automatic, primeiro assista ao vídeo e interaja (curtir ou comentar). Este passo é essencial: ajuda a ativar o algoritmo do YouTube, aumentar a visibilidade do nosso conteúdo e garantir a vitalidade e o crescimento coletivo da rede."
  },
  ln: { // Lingala
    notification: "✅ Ozali kokangama na LINK FLOW! Po na kozwa Victor Automatic, esengeli liboso otala vidéo mpe osala interaction (like to commentaire). Etape oyo ezali ya ntina: esalaka ete algorithme ya YouTube ebotola makasi, epusa visibilité ya contenu na biso mpe ezala garanti ya bomoi mpe bokoli ya réseau."
  },
  sw: { // Swahili
    notification: "✅ Umeingia kwenye LINK FLOW! Ili kufikia Victor Automatic, lazima kwanza utazame video na uhusike (like au comment). Hatua hii ni muhimu: inasaidia kuamsha algorithm ya YouTube, kuongeza mwonekano wa maudhui yetu na kuhakikisha uhai na maendeleo ya mtandao kwa pamoja."
  }
};
