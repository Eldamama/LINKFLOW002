// --- LINK FLOW Onboarding Logic ---
// Ce script gère l'activation du lien, le partage et l'interaction YouTube

document.addEventListener("DOMContentLoaded", function() {
  const activateBtn = document.getElementById("activateBtn");
  const shareBtn = document.getElementById("shareBtn");
  const youtubeBtn = document.getElementById("youtubeBtn");

  // Étape 1 : Activation du lien
  activateBtn.addEventListener("click", function() {
    alert("Lien activé ✅ Vous pouvez continuer.");
    // Ici tu peux ajouter une redirection ou débloquer une section
  });

  // Étape 2 : Partage obligatoire
  shareBtn.addEventListener("click", function() {
    alert("Merci d’avoir partagé 🔗 Accès validé.");
    localStorage.setItem("shared", "true");
  });

  // Étape 3 : Interaction YouTube
  youtubeBtn.addEventListener("click", function() {
    // Ouvre la vidéo YouTube dans une nouvelle fenêtre ou onglet
    window.open("https://www.youtube.com/watch?v=9uPybhkqYw4", "_blank");
    alert("Interaction YouTube confirmée 🎥");
    // Ici tu peux ajouter une logique pour vérifier l’ouverture ou débloquer une section
  });
});
