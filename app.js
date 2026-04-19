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
// AUTH STATE (Gère l'affichage)
// ===============================
firebase.auth().onAuthStateChanged(async user => {
  const statusEl = document.getElementById("status");
  const authSec = document.getElementById("authSection");
  const videoSec = document.getElementById("videoSection");

  if (user) {
    authSec.style.display = "none";
    videoSec.classList.remove("hidden");
    statusEl.innerText = "Connecté : " + user.email;

    const ref = new URLSearchParams(location.search).get("ref");
    await db.collection("users").doc(user.uid).set({
      createdAt: Date.now(),
      refBy: ref || null
    }, { merge: true });

    refLink = "https://victoryautomatic.com/user/register/" + (ref || "default");
  } else {
    authSec.style.display = "block";
    videoSec.classList.add("hidden");
    document.getElementById("claimSection").classList.add("hidden");
    document.getElementById("generateSection").classList.add("hidden");
    statusEl.innerText = "Connecte-toi";
  }
});

// ===============================
// FONCTIONS AUTH (Pour les boutons)
// ===============================
function connecter() {
  const email = document.getElementById("emailInput").value;
  const mdp
