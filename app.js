const supabaseClient = supabase.createClient(
  "https://xkyynzbbatglctgdtqyu.supabase.co",
  "sb_publishable_WdZlyuanXIGrg8RdcKcg_w_kN7YyO9a" // ✅ ta vraie Publishable anon key
);

let timer = 180;
let interval = null;
let player;
let sessionId = null;

function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

async function signup() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) { alert(error.message); return; }

  await supabaseClient.from("profiles").insert({ id: data.user.id, username });
  showPopup();
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) { alert(error.message); return; }

  document.getElementById("videoBox").style.display = "block";
  createVideoSession();
}

async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}

async function resetPassword() {
  const email = document.getElementById("loginEmail").value;
  if (!email) { alert("Entrez votre email de connexion"); return; }
  await supabaseClient.auth.resetPasswordForEmail(email);
  alert("Email envoyé");
}

function showPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "block";
  setTimeout(async () => {
    popup.style.display = "none";
    document.getElementById("videoBox").style.display = "block";
    await createVideoSession();
  }, 10000);
}

async function createVideoSession() {
  const { data: authData } = await supabaseClient.auth.getUser();
  const { data } = await supabaseClient
    .from("video_sessions")
    .insert({ user_id: authData.user.id, status: "active" })
    .select()
    .single();
  sessionId = data.id;
}

function startTimer() {
  clearInterval(interval);
  timer = 180;
  document.getElementById("claimBtn").disabled = true;
  document.getElementById("time").innerText = timer;

  interval = setInterval(() => {
    timer--;
    document.getElementById("time").innerText = timer;
    if (timer <= 0) {
      clearInterval(interval);
      document.getElementById("claimBtn").disabled = false;
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  timer = 180;
  document.getElementById("time").innerText = timer;
  document.getElementById("claimBtn").disabled = true;
}

async function claim() {
  const response = await fetch(
    "https://xkyynzbbatglctgdtqyu.supabase.co/functions/v1/dynamic-handler",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId })
    }
  );

  if (response.ok) {
    document.getElementById("linkZone").innerHTML = `
      <h3>Coller votre lien Victory</h3>
      <input id="victoryLink" placeholder="Lien Victory Automatic">
      <button onclick="validateVictoryLink()">Valider le lien</button>
    `;
  } else {
    alert("180 secondes non validées");
  }
}

function validateVictoryLink() {
  const link = document.getElementById("victoryLink").value;
  if (!link) { alert("Collez votre lien Victory"); return; }
  alert("Lien enregistré. Vérification généalogique en cours.");
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    videoId: "9uPybhkqYw4", // ✅ ta vidéo YouTube
    events: { onStateChange: onPlayerStateChange }
  });
}

function onPlayerStateChange(event) {
  const state = event.data;
  if (state === 1) startTimer();
  if (state === 2) resetTimer();
}
