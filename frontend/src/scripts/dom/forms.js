import { handleLogin, handleSignup } from '../auth.js';

// Configura los event listeners para el formulario de inicio de sesión
export function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;
            await handleLogin(login, password);
        });
    }
}

// Configura los event listeners para el formulario de registro
export function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userName = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await handleSignup(userName, email, password);
        });
    }
}
