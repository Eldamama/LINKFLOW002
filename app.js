const translations = {
    fr: { signup: "S'inscrire", login: "Connexion", user: "Nom", pass: "Mot de passe", have: "Membre ?", no: "Nouveau ?", watch: "Regardez jusqu'à la fin...", final: "Activation" },
    en: { signup: "Sign Up", login: "Login", user: "Name", pass: "Password", have: "Member?", no: "New?", watch: "Watch until the end...", final: "Link Activation" },
    ln: { signup: "Komisa nkombo", login: "Kota", user: "Nkombo", pass: "Mot de passe", have: "Oza déjà membre ?", no: "Oza sika ?", watch: "Tala tii na suka...", final: "Activation" }
};

function setLang(lang) {
    document.getElementById('lang-overlay').style.display = 'none';
    document.getElementById('main-ui').style.display = 'block';

    const t = translations[lang] || translations['en'];
    document.getElementById('t-signup').innerText = t.signup;
    document.getElementById('t-login').innerText = t.login;
    document.getElementById('l-user').innerText = t.user;
    document.getElementById('l-pass').innerText = t.pass;
    document.getElementById('l-pass2').innerText = t.pass;
    document.getElementById('t-have').innerText = t.have;
    document.getElementById('t-no').innerText = t.no;
    document.getElementById('t-watch').innerText = t.watch;
    document.getElementById('t-final').innerText = t.final;
}

function swap() {
    const signup = document.getElementById('signup-area');
    const login = document.getElementById('login-area');
    
    if (signup.style.display === 'none') {
        signup.style.display = 'block';
        login.style.display = 'none';
    } else {
        signup.style.display = 'none';
        login.style.display = 'block';
    }
}
