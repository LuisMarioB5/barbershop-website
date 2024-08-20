import { setSignoutButton } from '../auth.js';
import { parseJwt } from '../utils.js';

export function setButtons() {
    const accountBtns = document.getElementById("account-btns");
    let loginBtn = null;
    let signupBtn = null;
    let panelBtn = null;
    let logoutBtn = null;

    if (accountBtns) {
        loginBtn = accountBtns.children[0];
        signupBtn = accountBtns.children[1];
        panelBtn = accountBtns.children[2];
        logoutBtn = accountBtns.children[3];

        const areBtnsNullOrUndefined = !loginBtn || !signupBtn || !logoutBtn;
        if (!areBtnsNullOrUndefined) {
            loginBtn.addEventListener('click', () => {
                window.location.href = '../login.html';
            });
            
            signupBtn.addEventListener('click', () => {
                window.location.href = '../signup.html';
            });

            panelBtn.addEventListener('click', () => {
                const jwt = localStorage.getItem('JWT');
                if (jwt) {
                    const userRole = parseJwt(jwt).role;
                    
                    if (userRole) {
                        if (userRole === 'ROLE_ADMIN') {
                            window.location.href = 'userpage/users.html';
                        } else if (userRole === 'ROLE_BARBER') {
                            window.location.href = 'userpage/reservations.html';
                        } else {
                            window.location.href = '../index.html';
                        }
                    }
                }
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
        if (loginBtn && signupBtn && panelBtn && logoutBtn) {
            const JWT = localStorage.getItem('JWT');
            if (JWT === null) {
                loginBtn.style.display = "flex";
                signupBtn.style.display = "flex";
                panelBtn.style.display = "none";
                logoutBtn.style.display = "none";
            } else {
                loginBtn.style.display = "none";
                signupBtn.style.display = "none";
                panelBtn.style.display = "flex";
                logoutBtn.style.display = "flex";
            }
        }
    }
    
    // Función para configurar el dom correspondiente a cerrar sesión
    function setSignout(signoutBtn) {
        // Cierra sesión
        setSignoutButton(signoutBtn);
    
        // Actualiza los botones de login, signup y logout
        updateButtons();
    }
}
