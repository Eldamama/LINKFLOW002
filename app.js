document.addEventListener('DOMContentLoaded', () => {
    
    // Sécurité pour attendre que Firebase soit bien chargé sur le Tecno
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.database) {
            clearInterval(checkFirebase);
            initApp();
        }
    }, 500);

    function initApp() {
        const auth = firebase.auth();
        const db = firebase.database();
        let timeLeft = 30;
        
        const btnAction = document.getElementById('btnAction');
        const notification = document.getElementById('notification');
        const emailInput = document.getElementById('userEmail');
        const passInput = document.getElementById('userPassword');
        const walletInput = document.getElementById('userWallet');

        // 1. Gestion du Compte à rebours
        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                btnAction.innerText = `Patientez (${timeLeft}s)...`;
            } else {
                clearInterval(timer);
                checkForm(); 
            }
        }, 1000);

        // 2. Vérification des conditions
        window.checkForm = function() {
            const user = auth.currentUser;
            const isLiked = document.getElementById('likeCheck').checked;
            const isCommented = document.getElementById('commentCheck').checked;
            const isSubbed = document.getElementById('subCheck').checked;

            if (timeLeft <= 0 && isLiked && isCommented && isSubbed) {
                if (!user) {
                    btnAction.innerText = "CRÉER MON COMPTE GMAIL";
                    btnAction.disabled = false;
                    btnAction.style.background = "#3b82f6"; 
                } else if (!user.emailVerified) {
                    btnAction.innerText = "ACTIVER VIA LIEN GMAIL";
                    btnAction.disabled = false;
                    btnAction.style.background = "#f59e0b"; 
                } else {
                    btnAction.innerText = "VALIDER & SAUVEGARDER";
                    btnAction.disabled = false;
                    btnAction.style.background = "linear-gradient(135deg, #22c55e, #10b981)";
                }
            } else {
                btnAction.disabled = true;
                if (timeLeft <= 0) {
                    btnAction.innerText = "Complétez les étapes";
                    btnAction.style.background = "#475569";
                }
            }
        };

        // Écouteurs pour mettre à jour le bouton
        auth.onAuthStateChanged(() => checkForm());
        document.querySelectorAll('input[type="checkbox"]').forEach(ck => ck.addEventListener('change', checkForm));

        // 3. Logique du Bouton Action
        btnAction.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passInput.value;
            const wallet = walletInput.value;
            const user = auth.currentUser;

            // ÉTAPE A : Création de compte / Connexion
            if (!user) {
                if (!email || !password || !wallet) {
                    alert("Veuillez remplir tous les champs (Email, Pass, Portefeuille).");
                    return;
                }
                try {
                    btnAction.innerText = "CRÉATION...";
                    await auth.createUserWithEmailAndPassword(email, password);
                    alert("Compte créé ! Cliquez à nouveau pour envoyer le lien d'activation.");
                } catch (error) {
                    if (error.code === 'auth/email-already-in-use') {
                        await auth.signInWithEmailAndPassword(email, password).catch(e => alert(e.message));
                    } else {
                        alert(error.message);
                    }
                }
                return;
            }

            // ÉTAPE B : Envoi du lien d'activation
            if (!user.emailVerified) {
                try {
                    await user.sendEmailVerification();
                    notification.innerText = "Lien envoyé ! Vérifiez vos courriels (et spams).";
                    notification.className = "success";
                    notification.classList.remove('hidden');
                    alert("Vérifiez votre boîte Gmail pour activer votre compte.");
                } catch (error) {
                    alert("Erreur d'envoi : " + error.message);
                }
                return;
            }

            // ÉTAPE C : Sauvegarde en Realtime Database et Finalisation
            try {
                btnAction.innerText = "SAUVEGARDE...";
                btnAction.disabled = true;

                // On enregistre les données sous l'ID unique de l'utilisateur
                await db.ref('users/' + user.uid).set({
                    email: user.email,
                    wallet: wallet,
                    status: "activé",
                    date: new Date().toLocaleString()
                });

                notification.innerText = "Profil activé et sauvegardé !";
                setTimeout(() => {
                    alert("Succès ! Votre profil est prêt.");
                    // window.location.href = "dashboard.html";
                }, 1500);

            } catch (error) {
                alert("Erreur Database : " + error.message);
                btnAction.disabled = false;
            }
        });
    }
});

function toggleLanguage() {
    // Logique de traduction si nécessaire
}
