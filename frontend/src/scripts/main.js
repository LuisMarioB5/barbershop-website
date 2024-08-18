import { setBarbers } from './dom/barbers.js';
import { setButtons } from './dom/buttons.js';
import { setupLoginForm, setupSignupForm } from './dom/forms.js';
import { setUserPage } from './dom/userpage/main.js';
import { setServices } from './dom/services.js';
import { manageIframeLoading, setPhonesInputs } from './utils.js';

import { setReservation } from './dom/reservation.js';

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Determina la página actual por la URL y llama a las funciones correspondientes
    if (window.location.pathname.endsWith('login.html')) {
        setupLoginForm();
    } else if (window.location.pathname.endsWith('signup.html')) {
        setupSignupForm();
    } else if (pathnameContains('userpage/reservations.html') || pathnameContains('userpage/users.html') || pathnameContains('userpage.html')) {
        setUserPage();
    } else if (window.location.pathname.endsWith('index.html')) {
        hideSections();

        setButtons();
        setServices();
        setBarbers();
    
        setReservation();

        setPhonesInputs();
        manageIframeLoading();
    }
});

function pathnameContains(pathname) {
    return window.location.pathname.endsWith(pathname)
}

function hideSections() {
    const reviews = document.getElementById('reviews');
    const reviewLink = document.querySelector('.sect-li:nth-of-type(6)');
    const contactUs = document.getElementById('contact-us');
    const contactUsLink = document.querySelector('.sect-li:nth-of-type(8)');
    const footerForm = document.querySelector('#footer-left-side form:first-of-type');
    const sectionsToHide = Array.of(reviews, reviewLink, contactUs, contactUsLink, footerForm);
    
    sectionsToHide.forEach(element => element.style.display = 'none');
}
