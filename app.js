const _supabase = supabase.createClient(
  "https://xkyynzbbatglctgdtqyu.supabase.co",
  "sb_publishable_pcrDzFZ9rkilVIw12_0uvw_2CcdtvLB"
);

function togglePassword() {
  const pwd = document.getElementById('password');
  pwd.type = pwd.type === "password" ? "text" : "password";
}

async function sinscrire() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !email || !password) {
    alert('Tous les champs sont obligatoires');
    return;
  }

  const { data, error } = await _supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) {
    alert("Erreur : " + error.message);
    return;
  }

  // Afficher le pop-up explicatif
  document.getElementById('popup').classList.remove('hidden');
}

async function connexion() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Erreur : " + error.message);
    return;
  }

  document.getElementById('user-info').classList.remove('hidden');
  document.getElementById('user-info').innerHTML = `Connecté : ${data.user.email}`;
}

async function logout() {
  await _supabase.auth.signOut();
  document.getElementById('user-info').classList.add('hidden');
  document.getElementById('user-info').innerHTML = '';
  alert('Déconnecté');
}

async function resetPassword() {
  const email = document.getElementById('email').value.trim();
  if (!email) {
