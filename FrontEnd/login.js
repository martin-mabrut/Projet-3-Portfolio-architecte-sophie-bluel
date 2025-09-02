document.querySelector('.formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const errorBox = document.getElementById('loginError');
  errorBox.textContent = ''; // on vide l’erreur au cas où

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Accept': 'application/json'},
        body: JSON.stringify({ email: email, password: password })
    });

    if (response.ok) {

    const loginResponse = await response.json();

    const token = loginResponse.token; 
    localStorage.setItem('token', token);

    window.location.href = 'index.html?mode=edit';


    } else {
    errorBox.textContent = 'Identifiants invalides.';
  }
});