import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// --- CONFIGURATION ---
// J'ai intégré ta clé publique ici. Pense à vérifier ton URL de projet dans Supabase.
const supabaseUrl = "https://votre-projet-id.supabase.co"; 
const supabaseKey = "Sb_publishable_pcrDzFZ9rkilVIw12_0uvw_2CcdtvLB";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- LOGIQUE DE L'ŒIL MAGIQUE ---
document.querySelectorAll('.toggle-password').forEach(eye => {
  eye.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const input = document.getElementById(targetId);
    
    if (input.type === "password") {
      input.type = "text";
      this.classList.remove('fa-eye');
      this.classList.add('fa-eye-slash');
    } else {
      input.type = "password";
      this.classList.remove('fa-eye-slash');
      this.classList.add('fa-eye');
    }
  });
});

// --- INSCRIPTION ---
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: username } }
  });

  if (error) {
    alert("Erreur inscription : " + error.message);
  } else {
    alert("Inscription réussie ! Vérifiez vos mails.");
  }
});

// --- CONNEXION ---
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Erreur connexion : " + error.message);
  } else {
    alert("Connexion réussie !");
  }
});

// --- DÉCONNEXION ---
document.getElementById("logout-btn").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) alert("Déconnecté !");
});

// --- MOT DE PASSE OUBLIÉ ---
document.getElementById("forgot-btn").addEventListener("click", async () => {
  const email = prompt("E-mail pour réinitialisation :");
  if (email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    alert(error ? "Erreur : " + error.message : "Email envoyé !");
  }
});
