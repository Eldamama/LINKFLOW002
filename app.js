// ================== FIREBASE CONFIG ==================
const firebaseConfig = {
  apiKey: "TA_VRAIE_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  databaseURL: "https://TON_PROJET-default-rtdb.firebaseio.com",
  projectId: "TON_PROJET_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let player;
let currentUser = null;

// ================== UTIL ==================
function notify(msg, type="info"){
  const el = document.getElementById("notification");
  el.innerText = msg;
  el.className = type;
}

// ================== AUTH ==================
auth.onAuthStateChanged(async user => {
  if(!user){
    document.getElementById("authSection").classList.remove("hidden");
    return;
  }

  currentUser = user;
  document.getElementById("authSection").classList.add("hidden");

  const refCode = new URLSearchParams(location.search).get("ref");

  const userRef = db.ref("users/" + user.uid);
  const snap = await userRef.once("value");

  if(!snap.exists()){
    const myCode = Math.random().toString(36).substring(2,8);

    await userRef.set({
      email: user.email,
      refCode: myCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24*60*60*1000),
      hasClaimed: false,
      referredBy: refCode || null
    });

    await db.ref("referrals/" + myCode).set({
      owner: user.uid,
      clicks: 0
    });
  }

  document.getElementById("videoSection").classList.remove("hidden");
});

// ================== LOGIN ==================
function login(){
  auth.signInWithEmailAndPassword(
    emailInput.value,
    mdpInput.value
  ).catch(e => notify(e.message, "error"));
}

function register(){
  auth.createUserWithEmailAndPassword(
    emailInput.value,
    mdpInput.value
  ).catch(e => notify(e.message, "error"));
}

// ================== YOUTUBE ==================
function onYouTubeIframeAPIReady(){
  player = new YT.Player('player',{
    height:'200',
    width:'100%',
    videoId:'9uPybhkqYw4',
    events:{
      onStateChange: e=>{
        if(e.data === YT.PlayerState.ENDED){
          document.getElementById("videoSection").classList.add("hidden");
          document.getElementById("claimSection").classList.remove("hidden");
        }
      }
    }
  });
}

// ================== CLAIM ==================
async function claim(){
  const ref = db.ref("users/" + currentUser.uid);
  const snap = await ref.once("value");
  const data = snap.val();

  if(Date.now() > data.expiresAt){
    notify("Compte expiré", "error");
    await ref.remove();
    await auth.signOut();
    return;
  }

  if(data.hasClaimed){
    notify("Déjà utilisé", "error");
    return;
  }

  await ref.update({ hasClaimed: true });

  const link = "https://tonsite.com/?ref=" + data.refCode;

  window.open(link, "_blank");

  document.getElementById("claimSection").classList.add("hidden");
  document.getElementById("generateSection").classList.remove("hidden");
}

// ================== GENERATE ==================
async function generate(){
  const val = linkInput.value;
  if(!val) return notify("Lien vide", "error");

  const userSnap = await db.ref("users/"+currentUser.uid).once("value");
  const code = userSnap.val().refCode;

  const finalLink = location.origin + "?ref=" + code;

  document.getElementById("result").innerText = finalLink;
}
