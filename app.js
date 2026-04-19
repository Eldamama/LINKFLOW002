// ===============================
// CONFIG FIREBASE
// ===============================
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

// ===============================
// AUTH STATE
// ===============================
firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("videoSection").classList.remove("hidden");

    document.getElementById("status").innerText =
      "Connecté : " + user.email;

    // créer user en base si absent
    const ref = new URLSearchParams(location.search).get("ref");

    await db.collection("users").doc(user.uid).set({
      createdAt: Date.now(),
      refBy: ref || null
    }, { merge: true });

    refLink = "https://victoryautomatic.com/user/register/" + (ref || "default");

  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("videoSection").classList.add("hidden");
    document.getElementById("claimSection").classList.add("hidden");
    document.getElementById("generateSection").classList.add("hidden");

    document.getElementById("status").innerText =
      "Connecte-toi";
  }
});

// ===============================
// YOUTUBE
// ===============================
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '200',
    width: '100%',
    videoId: '9uPybhkqYw4', // ID de ta vidéo YouTube
    events: {
      'onStateChange': async (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          // appeler serveur sécurisé
          const fn = functions.httpsCallable("markVideoWatched");
          await fn();

          document.getElementById("videoSection").classList.add("hidden");
          document.getElementById("claimSection").classList.remove("hidden");

          document.getElementById("status").innerText =
            "Vidéo validée";
        }
      }
    }
  });
}

// ===============================
// CLAIM
// ===============================
async function claimVictory() {
  const fn = functions.httpsCallable("claimLink");
  await fn();

  window.open(refLink, "_blank");

  document.getElementById("claimSection").classList.add("hidden");
  document.getElementById("generateSection").classList.remove("hidden");
}

// ===============================
// GENERATE
// ===============================
async function generateLink() {
  const val = document.getElementById("v_link_input").value;
  const fn = functions.httpsCallable("generateSecureLink");

  const res = await fn({
    link: val,
    origin: location.origin + location.pathname
  });

  document
