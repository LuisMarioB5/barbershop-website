import { handleLogout } from '../auth.js';
import { updateAccountButtons } from '../utils.js';

export function setAccountButtons() {
    const accountBtns = document.getElementById("account-btns");

    if (accountBtns) {
        const loginBtn = accountBtns.children[0];
        const signupBtn = accountBtns.children[1];
        const logoutBtn = accountBtns.children[2];
    
        updateAccountButtons(loginBtn, signupBtn, logoutBtn);
    }
}

export function setButtons() {
    const accountBtns = document.getElementById("account-btns");
    if (accountBtns) {
        const loginBtn = accountBtns.children[0];
        const signupBtn = accountBtns.children[1];
        const logoutBtn = accountBtns.children[2];
    
        const areBtnsNullOrUndefined = !loginBtn || !signupBtn || !logoutBtn;
        
        if (!areBtnsNullOrUndefined) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
            signupBtn.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
            logoutBtn.addEventListener('click', setupLogout);
        } else {
            console.warn('Some account buttons are missing');
        }
    } else {
        console.warn('Account buttons container not found');
    }
    
    const bookingBtn = document.querySelector("#home-content button");
    if (bookingBtn) {
        bookingBtn.addEventListener('click', () => {
            window.location.href = '#booking';
        });
    }
}

// Función para configurar el dom correspondiente a cerrar sesión
function setupLogout() {
    // Cierra sesión
    handleLogout();

    // Actualiza los botones de login, signup y logout
    setAccountButtons();
}
