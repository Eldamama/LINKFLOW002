import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("SUPABASE_URL", "SUPABASE_ANON_KEY");

let sessionId = null;
let timer = 180;
let interval = null;
let player = null;

/* =========================
   AUTH
========================= */

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return alert(error.message);

  await createProfile(data.user.id);

  showPopup();
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  document.getElementById("videoBox").style.display = "block";
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

async function reset() {
  const email = document.getElementById("loginEmail").value;

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) return alert(error.message);

  alert("Email de récupération envoyé");
}

/* =========================
   PROFIL (username)
========================= */

async function createProfile(userId) {
  const username = document.getElementById("username").value;

  await supabase.from("profiles").insert({
    id: userId,
    username: username
  });
}

/* =========================
   POPUP 10 SECONDES
========================= */

function showPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
    document.getElementById("videoBox").style.display = "block";

    startVideoSession();
  }, 10000);
}

/* =========================
   VIDEO SESSION SUPABASE
========================= */

async function startVideoSession() {
  const { data: user } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("video_sessions")
    .insert({
      user_id: user.user.id,
      started_at: new Date(),
      status: "active"
    })
    .select()
    .single();

  sessionId = data.id;
}

/* =========================
   TIMER 180s (RESET TOTAL)
========================= */

function startTimer() {
  clearInterval(interval);
  timer = 180;

  document.getElementById("claim").disabled = true;

  interval = setInterval(() => {
    timer--;
    document.getElementById("t").innerText = timer;

    if (timer <= 0) {
      clearInterval(interval);
      document.getElementById("claim").disabled = false;
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  timer = 180;
  document.getElementById("t").innerText = timer;
  document.getElementById("claim").disabled = true;
}

/* =========================
   CLAIM LINK
========================= */

function claim() {
  document.getElementById("linkZone").innerHTML = `
    <input id="victoryLink" placeholder="Coller lien Victory">
    <button onclick="validateLink()">Valider</button>
  `;
}

/* =========================
   VALIDATION LINK
========================= */

function validateLink() {
  const link = document.getElementById("victoryLink").value;

  if (!link) return alert("Lien requis");

  alert("Lien enregistré. Vérification en cours...");

  // ici tu peux envoyer vers Supabase
}

/* =========================
   YOUTUBE PLAYER
========================= */

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    videoId: "VIDEO_ID",
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

/* =========================
   LOGIQUE VIDÉO
========================= */

function onPlayerStateChange(event) {
  const state = event.data;

  // PLAY
  if (state === 1) {
    startTimer();
  }

  // PAUSE => RESET TOTAL
  if (state === 2) {
    resetTimer();
  }

  // FIN VIDÉO
  if (state === 0) {
    document.getElementById("claim").disabled = false;
  }
}

/* =========================
   EXPOSITION GLOBALE
========================= */

window.signup = signup;
window.login = login;
window.logout = logout;
window.reset = reset;
window.claim = claim;
window.validateLink = validateLink;
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
