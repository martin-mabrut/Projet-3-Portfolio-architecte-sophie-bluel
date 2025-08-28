document.querySelector('.formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const errorBox = document.querySelector(".loginError");
    const bouton = document.querySelector(".btnSubmitLogin")
    
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const loginResponse = await response.json();
      const token = loginResponse.token;
      localStorage.setItem('token', token);
      window.location.href = 'index.html?mode=edit';
    } else {
      errorBox.innerText = "Identifiants invalides."
      errorBox.style.display = "flex";
      bouton.style.marginTop = "0"; 
    }
  } catch (err) {
    errorBox.innerText = "Une erreur est survenue. Réessayez ultérieurement."
    errorBox.style.display = "flex";
    bouton.style.marginTop = "0"; 
  }
});

