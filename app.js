// ================== VARIABLES ==================
let player;
let currentUser = null;

// ================== UTIL ==================
function notify(msg, type="info"){
  const el = document.getElementById("notification");
  el.innerText = msg;
  el.className = type;
}

// ================== AUTH (à remplacer par Supabase) ==================
async function handleAuth(user){
  if(!user){
    document.getElementById("authSection").classList.remove("hidden");
    return;
  }

  currentUser = user;
  document.getElementById("authSection").classList.add("hidden");

  const refCode = new URLSearchParams(location.search).get("ref");

  // TODO: remplacer ceci par Supabase
  // Vérifier si utilisateur existe en base
  // Créer utilisateur sinon

  document.getElementById("videoSection").classList.remove("hidden");
}

// ================== LOGIN ==================
async function login(){
  // TODO: Supabase login ici
  notify("Login à connecter à Supabase", "info");
}

async function register(){
  // TODO: Supabase signup ici
  notify("Register à connecter à Supabase", "info");
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
  // TODO: récupérer données utilisateur depuis Supabase

  // Simulation temporaire
  const data = {
    expiresAt: Date.now() + 1000,
    hasClaimed: false,
    refCode: "demo123"
  };

  if(Date.now() > data.expiresAt){
    notify("Compte expiré", "error");
    return;
  }

  if(data.hasClaimed){
    notify("Déjà utilisé", "error");
    return;
  }

  // TODO: update Supabase (hasClaimed = true)

  const link = "https://tonsite.com/?ref=" + data.refCode;

  window.open(link, "_blank");

  document.getElementById("claimSection").classList.add("hidden");
  document.getElementById("generateSection").classList.remove("hidden");
}

// ================== GENERATE ==================
async function generate(){
  const val = linkInput.value;
  if(!val) return notify("Lien vide", "error");

  // TODO: récupérer refCode depuis Supabase
  const code = "demo123";

  const finalLink = location.origin + "?ref=" + code;

  document.getElementById("result").innerText = finalLink;
}
