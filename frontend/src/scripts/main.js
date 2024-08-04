import { setupLoginForm, setupSignupForm, setAccountButtons, setButtons, setServices } from './dom.js';
import { manageIframeLoading, setPhonesInputs } from './utils.js';

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log("hola")
    // Determina la página actual por la URL y llama a las funciones correspondientes
    if (window.location.pathname.endsWith('login.html')) {
        setupLoginForm();
    } else if (window.location.pathname.endsWith('signup.html')) {
        setupSignupForm();
    } else {
        setPhonesInputs();
        manageIframeLoading();
        setAccountButtons();
        setButtons();
        setServices();
    }
});


