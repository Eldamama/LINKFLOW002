import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "SUPABASE_URL";
const supabaseKey = "SUPABASE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

// Inscription
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });

  if (error) {
    alert("Erreur inscription: " + error.message);
  } else {
    alert("Inscription réussie !");
  }
});

// Connexion
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Erreur connexion: " + error.message);
  } else {
    alert("Connexion réussie !");
  }
});

// Déconnexion
document.getElementById("logout-btn").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Erreur déconnexion: " + error.message);
  } else {
    alert("Déconnecté !");
  }
});

// Mot de passe oublié
document.getElementById("forgot-btn").addEventListener("click", async () => {
  const email = prompt("Entrez votre adresse e‑mail pour réinitialiser le mot de passe :");
  if (email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      alert("Erreur: " + error.message);
    } else {
      alert("Un email de réinitialisation a été envoyé !");
    }
  }
});
