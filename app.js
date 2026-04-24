import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// --- CONFIGURATION ---
// J'ai intégré ta clé publique ici. Pense à vérifier ton URL de projet dans Supabase.
const supabaseUrl = "https://xkyynzbbatglctgdtqyu.supabase.co"; 
const supabaseKey = "sb_publishable_pcrDzFZ9rkilVIw12_0uvw_2CcdtvLB";
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
