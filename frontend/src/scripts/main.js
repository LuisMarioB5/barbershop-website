import { setBarbers } from './dom/barbers.js';
import { setButtons } from './dom/buttons.js';
import { setupLoginForm, setupSignupForm } from './dom/forms.js';
import { setUserPage } from './dom/userpanel.js';
import { setServices } from './dom/services.js';
import { manageIframeLoading, setPhonesInputs } from './utils.js';

import { setDatalistsOnReservation } from './dom/reservation.js';

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log("hola")
    // Determina la página actual por la URL y llama a las funciones correspondientes
    if (window.location.pathname.endsWith('login.html')) {
        setupLoginForm();
    } else if (window.location.pathname.endsWith('signup.html')) {
        setupSignupForm();
    } else if (window.location.pathname.endsWith('userpage.html')) {
        setUserPage();
    } else if (window.location.pathname.endsWith('index.html')) {
        setButtons();
        setServices();
        setBarbers();
    
        setDatalistsOnReservation();

        setPhonesInputs();
        manageIframeLoading();
    }
});


