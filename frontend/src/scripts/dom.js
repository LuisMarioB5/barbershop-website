import { handleLogin, handleSignup, handleLogout } from './auth.js';
import { updateAccountButtons } from './utils.js';

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

// Función para configurar los botones de cuenta (login, registro, cerrar sesión)
export function setAccountButtons() {
    const accountBtns = document.getElementById("account-btns");

    if (accountBtns) {
        const loginBtn = accountBtns.children[0];
        const signupBtn = accountBtns.children[1];
        const logoutBtn = accountBtns.children[2];
    
        updateAccountButtons(loginBtn, signupBtn, logoutBtn);
    }
}

// Función para configurar los links de los botones de cuenta y el call to action de la seccion de inicio
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

// Función para configurar el dom corespondiente a cerrar sesion
function setupLogout() {
    // Cierra sessión
    handleLogout();

    // Actualiza los botones de login, signup y logout
    setAccountButtons();
}

export async function setServices() {
    try {
        const response = await fetch('http://localhost:8080/service/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const servicesContent = document.getElementById('services-content');
        // Imagen del barbero
        const servicesContentDiv = document.createElement('div');
        servicesContent.appendChild(servicesContentDiv);

        const categories = await response.json();
        // Filtrar las categorías activas
        const activeCategories = categories.filter(category => category.isActive);
        // Top 6 Categorias activas
        const top6Categories = activeCategories.slice(0, 6);
        
        // Lista de las categorias
        const servicesContentUl = document.createElement('ul');
        servicesContent.appendChild(servicesContentUl);
        const categoriesList = document.querySelector('#services-content ul');

        top6Categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${category.imagePath}" alt="${category.imageDescription}">
                <p>${category.name}</p>
            `;
            categoriesList.appendChild(li);
        });


        setPricing(activeCategories);
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

function setPricing(activeCategories) {
    const pricingContent = document.getElementById('pricing-content');
    const serviceTags = document.createElement('div');
    serviceTags.id = 'service-tags';
    pricingContent.appendChild(serviceTags);

    // Flecha izquierda
    const svgLeft = createPricingSvg("rotate(-90 40 40)", "M46 50.9999L34.3871 39.6259L46 29.0644");
    serviceTags.appendChild(svgLeft)
    
    // Lista de las categorias
    const serviceTagsUl = document.createElement('ul');
    serviceTags.appendChild(serviceTagsUl);

    // Flecha derecha
    const svgRight = createPricingSvg("rotate(90 40 40)", "M34 29.0001L45.6129 40.3741L34 50.9356");
    serviceTags.appendChild(svgRight)

    setCarousel(activeCategories);
    setPricingDetails();
}

function createPricingSvg(transform, pathD) {
    const innerHtmlContent = `
        <circle cx="40" cy="40" r="39.5" transform="${transform}" fill="#708090" stroke="#708090"/>
        <path d="${pathD}" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    `
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "80");
    svg.setAttribute("height", "80");
    svg.setAttribute("viewBox", "0 0 80 80");
    svg.setAttribute("fill", "none");
    svg.innerHTML = innerHtmlContent;
    svg.style.visibility = 'visible';

    return svg;
}

function setCarousel(activeCategories) {
    const all = { name: "Todos", imagePath: "resources/icons/hair-clipper.png", imageDescription: "Imagen png de una máquina de pelar." };
    activeCategories.unshift(all);

    const carousel = document.querySelector('#service-tags ul');

    const arrows = document.querySelectorAll('#service-tags svg');
    const prevArrow = arrows[0];
    const nextArrow = arrows[1];

    let currentIndex = 0;
    const categoriesToShow = 4;
    const visibleCategories = Math.min(categoriesToShow, activeCategories.length);
    let selectedIndex = 0;

    function renderCategories() {
        carousel.innerHTML = '';
        for (let i = 0; i < visibleCategories; i++) {
            const categoryIndex = (currentIndex + i) % activeCategories.length;
            const category = activeCategories[categoryIndex];
            const li = document.createElement('li');

            const img = document.createElement('img');
            img.src = category.imagePath;
            img.alt = category.imageDescription;
            li.appendChild(img);

            const p = document.createElement('p');
            p.textContent = category.name;
            li.appendChild(p);

            if (categoryIndex === selectedIndex) {
                li.classList.add('service-tag-active');
            }

            li.addEventListener('click', () => {
                selectedIndex = categoryIndex;
                renderCategories();
            });

            carousel.appendChild(li);
        }
    }

    prevArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + activeCategories.length) % activeCategories.length;
        renderCategories();
    });

    nextArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % activeCategories.length;
        renderCategories();
    });

    renderCategories();
}

function setPricingDetails() {
    // Todos los servicios a utilizar estan en la base de datos y los endpoints estan listos y provados, solo falta aplicar
    // todo en el DOM, asi como hacer funcionar el otro carousel de abajo.
}
