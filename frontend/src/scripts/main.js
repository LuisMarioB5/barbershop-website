import { setBarbers } from './dom/barbers.js';
import { setAccountButtons, setButtons } from './dom/buttons.js';
import { setupLoginForm, setupSignupForm } from './dom/forms.js';
import { setGallery } from './dom/gallery.js';
import { setServicesSection, setPricingSection } from './dom/services.js';
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
        setAccountButtons();
        setButtons();
        setServicesSection();
        setPricingSection();
        setGallery();
        setBarbers();

        setPhonesInputs();
        manageIframeLoading();
    }
});


