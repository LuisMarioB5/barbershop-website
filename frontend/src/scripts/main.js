import { setBarbers } from './dom/barbers.js';
import { setButtons } from './dom/buttons.js';
import { setupLoginForm, setupSignupForm } from './dom/authPage.js';
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
        setHamburgerMenu();
        
        setButtons();
        
        hideSections();

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
    const sectionsToHide = Array.of(reviews, reviewLink, contactUs, contactUsLink);
    
    sectionsToHide.forEach(element => {
        if (element) element.style.display = 'none';
    });
}

function setHamburgerMenu() {
    const hamburgerButton = document.querySelector('.hamburger-menu'); // Botón del menú hamburguesa
    const navMenu = document.querySelector('nav'); // Menú de navegación

    // Abre o cierra el menú al hacer clic en el botón del menú hamburguesa
    hamburgerButton.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.toggle('active');
            hamburgerButton.classList.toggle('open'); // Opcional: para cambiar la apariencia del botón cuando esté activo
        }
    });

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        // Verifica si el clic fue fuera del menú y del botón del menú
        if (navMenu && hamburgerButton) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnButton = hamburgerButton.contains(event.target);

            if (!isClickInsideMenu && !isClickOnButton && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerButton.classList.remove('open'); // Opcional: para desactivar la apariencia activa del botón
            }
        }
    });
}
