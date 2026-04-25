function togglePassword() {
  const x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

// N'oublie pas de l'exposer aussi
window.togglePassword = togglePassword;
