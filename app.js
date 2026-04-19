const firebaseConfig = {
  apiKey: "AIzaSyDgBD9NrGaUU92l7vBadVyENH_rby8zZ-w",
  authDomain: "linkflow-7a82a.firebaseapp.com",
  databaseURL: "https://linkflow-7a82a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "linkflow-7a82a",
  storageBucket: "linkflow-7a82a.firebasestorage.app",
  messagingSenderId: "459654757296",
  appId: "1:459654757296:web:28354472d69ab6b8a7b475",
  measurementId: "G-WGT7RLTY17"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const functions = firebase.functions();

let player;
let refLink = "";

// Notification Helper
function notify(text, type = 'info') {
    const n = document.getElementById("notification");
    n.innerText = text;
    n.className = type;
}

// ===============================
// AUTH STATE
// ===============================
firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("videoSection").classList.remove("hidden");
    notify("Connecté : " + user.email, "success");

    const ref = new URLSearchParams(location.search).get("ref");
    await db.collection("users").doc(user.uid).set({
      updatedAt: Date.now(),
      refBy: ref || null
    }, { merge: true });

    refLink = "https://victoryautomatic.com/user/register/" + (ref || "default");
  } else {
    document.getElementById("authSection").classList.remove("hidden");
    document.getElementById("videoSection").classList.add("hidden");
    document.getElementById("claimSection").classList.add("hidden");
    document.getElementById("generateSection").classList.add("hidden");
    notify("Veuillez vous connecter", "info");
  }
});

// ===============================
// FONCTIONS BOUTONS
// ===============================
function connecter() {
  const email = document.getElementById("emailInput").value;
  const mdp = document.getElementById("mdpInput").value;
  if(!email || !mdp) return notify("Champs vides !", "error");
  
  firebase.auth().signInWithEmailAndPassword(email, mdp)
    .catch(e => notify(e.message, "error"));
}

function inscrire() {
  const email = document.getElementById("emailInput").value;
  const mdp = document.getElementById("mdpInput").value;
  if(!email || !mdp) return notify("Champs vides !", "error");

  firebase.auth().createUserWithEmailAndPassword(email, mdp)
    .catch(e => notify(e.message, "error"));
}

// ===============================
// YOUTUBE & ACTIONS
// ===============================
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '200', width: '100%', videoId: '9uPybhkqYw4',
    events: {
      'onStateChange': async (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          try {
            const fn = functions.httpsCallable("markVideoWatched");
            await fn();
            document.getElementById("videoSection").classList.add("hidden");
            document.getElementById("claimSection").classList.remove("hidden");
            notify("Vidéo validée !", "success");
          } catch(err) { notify("Erreur validation vidéo", "error"); }
        }
      }
    }
  });
}

async function claimVictory() {
  try {
    const fn = functions.httpsCallable("claimLink");
    await fn();
    window.open(refLink, "_blank");
    document.getElementById("claimSection").classList.add("hidden");
    document.getElementById("generateSection").classList.remove("hidden");
  } catch(e) { notify("Erreur claim", "error"); }
}

async function generateLink() {
  const val = document.getElementById("v_link_input").value;
  if(!val) return notify("Lien manquant", "error");
  
  try {
    const fn = functions.httpsCallable("generateSecureLink");
    const res = await fn({ link: val, origin: location.origin + location.pathname });
    document.getElementById("result").innerText = "Lien prêt !";
    notify("Succès !", "success");
  } catch(e) { notify("Erreur serveur", "error"); }
}
