import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = "https://xkyynzbbatglctgdtqyu.supabase.co";
const supabaseKey = "sb_publishable_pcrDzFZ9rkilVIw12_0uvw_2CcdtvLB";
const supabase = createClient(supabaseUrl, supabaseKey);

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

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { username: username } }
        });
        if (error) {
            alert("Erreur lors de l'inscription: " + error.message);
            console.error("Erreur d'inscription:", error);
            return;
        }
        alert("Inscription réussie! Vérifiez votre email pour confirmer.");
        document.getElementById("signup-form").reset();
    } catch (err) {
        alert("Erreur inattendue: " + err.message);
        console.error("Erreur:", err);
    }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) {
            alert("Erreur de connexion: " + error.message);
            console.error("Erreur de connexion:", error);
            return;
        }
        alert("Connexion réussie!");
        window.location.href = "dashboard.html";
    } catch (err) {
        alert("Erreur inattendue: " + err.message);
        console.error("Erreur:", err);
    }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Erreur de déconnexion: " + error.message);
            return;
        }
        alert("Déconnecté avec succès!");
        window.location.href = "index.html";
    } catch (err) {
        alert("Erreur: " + err.message);
    }
});

document.getElementById("forgot-btn").addEventListener("click", async () => {
    const email = prompt("Entrez votre adresse email:");
    if (!email) return;
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            alert("Erreur: " + error.message);
            return;
        }
        alert("Lien de réinitialisation envoyé à " + email);
    } catch (err) {
        alert("Erreur: " + err.message);
    }
});
