// On attend que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    
    // VERIFICATION DE SECURITE : On attend que Firebase soit prêt
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            clearInterval(checkFirebase); // Firebase est chargé, on arrête de chercher
            initApp(); // On lance l'application
        }
    }, 500); // On vérifie toutes les 0.5 secondes

    function initApp() {
        const auth = firebase.auth();
        let timeLeft = 30;
        
        const btnAction = document.getElementById('btnAction');
        const notification = document.getElementById('notification');
        const emailInput = document.getElementById('userEmail');
        const passInput = document.getElementById('userPassword');

        if (!btnAction) return;

        // 1. GESTION DU COMPTE À REBOURS (30s)
        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                btnAction.innerText = `Patientez (${timeLeft}s)...`;
            } else {
                clearInterval(timer);
                checkForm(); 
            }
        }, 1000);

        // 2. FONCTION DE VÉRIFICATION GLOBALE
        window.checkForm = function() {
            const user = auth.currentUser;
            const isLiked = document.getElementById('likeCheck').checked;
            const isCommented = document.getElementById('commentCheck').checked;
            const isSubbed = document.getElementById('subCheck').checked;

            // Une fois le temps écoulé
            if (timeLeft <= 0 && isLiked && isCommented && isSubbed) {
                if (!user) {
                    btnAction.innerText = "S'INSCRIRE / CONNECTER GMAIL";
                    btnAction.disabled = false;
                    btnAction.style.background = "#3b82f6"; // Bleu
                } else if (!user.emailVerified) {
                    btnAction.innerText = "ACTIVER MON GMAIL";
                    btnAction.disabled = false;
                    btnAction.style.background = "#f59e0b"; // Orange
                } else {
                    btnAction.innerText = "VALIDER MON FLUX";
                    btnAction.disabled = false;
                    btnAction.style.background = "linear-gradient(135deg, #22c55e, #10b981)"; // Vert
                }
            } else {
                btnAction.disabled = true;
                if (timeLeft <= 0) {
                    btnAction.innerText = "Complétez les étapes";
                    btnAction.style.background = "#475569";
                }
            }
        };

        // 3. ÉCOUTEURS D'ÉVÉNEMENTS
        auth.onAuthStateChanged(() => checkForm());
        
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', checkForm);
        });

        // 4. ACTION CLIC SUR LE BOUTON
        btnAction.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passInput.value;
            const user = auth.currentUser;

            // Étape A : Création ou Connexion
            if (!user) {
                if (!email || !password) {
                    alert("Veuillez saisir votre Gmail et un mot de passe.");
                    return;
                }
                try {
                    btnAction.innerText = "VÉRIFICATION...";
                    await auth.createUserWithEmailAndPassword(email, password);
                    alert("Compte créé avec succès ! Cliquez à nouveau pour recevoir le lien d'activation.");
                } catch (error) {
                    if (error.code === 'auth/email-already-in-use') {
                        try {
                            await auth.signInWithEmailAndPassword(email, password);
                        } catch (err) {
                            alert("Erreur de connexion : " + err.message);
                        }
                    } else {
                        alert("Erreur : " + error.message);
                    }
                }
                return;
            }

            // Étape B : Envoi du lien d'activation (Gmail)
            if (!user.emailVerified) {
                try {
                    await user.sendEmailVerification();
                    notification.innerText = "Lien d'activation envoyé à " + user.email;
                    notification.className = "success";
                    notification.classList.remove('hidden');
                    alert("Regardez votre boîte Gmail (et spams) pour cliquer sur le lien d'activation.");
                } catch (error) {
                    alert("Erreur d'envoi : " + error.message);
                }
                return;
            }

            // Étape C : Validation finale du flux
            notification.innerText = "Flux validé avec succès !";
            btnAction.disabled = true;
            btnAction.innerText = "CHARGEMENT...";
            
            setTimeout(() => {
                alert("Félicitations ! Votre profil est désormais sécurisé et actif.");
                // Redirection ici si besoin : window.location.href = "profil.html";
            }, 2000);
        });
    }
});

function toggleLanguage() {
    // Logique pour le sélecteur de langue si nécessaire
}
