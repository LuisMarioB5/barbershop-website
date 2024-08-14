import { setSignoutButtons } from '../auth.js';

export function setButtons() {
    const accountBtns = document.getElementById("account-btns");
    let loginBtn = null;
    let signupBtn = null;
    let logoutBtn = null;

    if (accountBtns) {
        loginBtn = accountBtns.children[0];
        signupBtn = accountBtns.children[1];
        logoutBtn = accountBtns.children[2];

        const areBtnsNullOrUndefined = !loginBtn || !signupBtn || !logoutBtn;
        if (!areBtnsNullOrUndefined) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
            signupBtn.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
            setSignout(logoutBtn);
        } else {
            console.warn('Some account buttons are missing');
        }

        const bookingBtn = document.querySelector("#home-content button");
        if (bookingBtn) {
            bookingBtn.addEventListener('click', () => {
                window.location.href = '#reservation';
            });
        }

        updateButtons();
    } else {
        console.warn('Account buttons container not found');
    }
    
    function updateButtons() {
        if (loginBtn && signupBtn && logoutBtn) {
            const JWT = localStorage.getItem('JWT');
            if (JWT === null) {
                loginBtn.style.display = "flex";
                signupBtn.style.display = "flex";
                logoutBtn.style.display = "none";
            } else {
                loginBtn.style.display = "none";
                signupBtn.style.display = "none";
                logoutBtn.style.display = "flex";
            }
        }
    }
    
    // Función para configurar el dom correspondiente a cerrar sesión
    function setSignout(signoutBtn) {
        // Cierra sesión
        setSignoutButtons(signoutBtn);
    
        // Actualiza los botones de login, signup y logout
        updateButtons();
    }
}
