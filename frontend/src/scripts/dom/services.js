import { memoizeFetch } from '../utils.js';

const fetchServiceCategories = memoizeFetch(getActiveServiceCategories);
export const fetchActiveServices = memoizeFetch(getActiveServices);

// Obtiene las categorias de los servicios desde el backend y devuelve solo los activos
async function getActiveServiceCategories() {
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

        const categories = await response.json();
        const sortedServiceCategories = categories
        .filter(category => category.isActive)
        .sort((a, b) => {
          // Convertir los nombres a minúsculas para hacer la comparación insensible a mayúsculas
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          
          if (nameA < nameB) {
            return -1; // a debe aparecer antes que b
          }
          if (nameA > nameB) {
            return 1; // a debe aparecer después que b
          }
          return 0; // Los nombres son iguales
        });
        
        return sortedServiceCategories;
    } catch (error) {
        console.error('Error al cargar las categorias de los servicios desde el backend:', error);
    }
}

// Obtiene los servicios desde el backend y devuelve solo los activos
async function getActiveServices() {
    try {
        const response = await fetch('http://localhost:8080/service', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const services = await response.json();
        const sortedServices = services
        .filter(service => service.isActive)
        .sort((a, b) => {
          // Convertir los nombres a minúsculas para hacer la comparación insensible a mayúsculas
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          
          if (nameA < nameB) {
            return -1; // a debe aparecer antes que b
          }
          if (nameA > nameB) {
            return 1; // a debe aparecer después que b
          }
          return 0; // Los nombres son iguales
        });
        
        return sortedServices;
    } catch (error) {
        console.error('Error al cargar los servicios desde el backend:', error);
    }
}

export async function setServices() {
    // Estableciendo la sección inicial de los servicios
    await setServicesSection();

    const serviceRenderer = createServicePrincingRenderer();
    // Estableciendo la sección de los precios dentro de los servicios
    await setPricingCategories(serviceRenderer);
    // Establecer los detalles de los servicios
    await setPricingDetails(serviceRenderer); 
}

async function setServicesSection() {
    try {
        // Categorías de los servicios activas
        const categories = await fetchServiceCategories();

        // Top 6 Categorías activas
        const top6Categories = categories.slice(0, 6);

        // Contenedor principal del contenido de los servicios
        const servicesContent = document.getElementById('services-content');
        
        // Lista de las categorías
        const categoriesList = document.querySelector('#services-content ul');

        // Agregando las categorías al DOM
        top6Categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${category.imagePath}" alt="${category.imageDescription}">
                <p>${category.name}</p>
            `;
            categoriesList && categoriesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al agregar las categorías de los servicios al DOM:', error);
    }
}

async function setPricingCategories(serviceRenderer) {
    const activeCategories = await fetchServiceCategories();

    const pricingContent = document.getElementById('pricing-content');
    const serviceTags = document.createElement('div');
    serviceTags.id = 'service-tags';
    pricingContent && pricingContent.appendChild(serviceTags);

    const prevArrow = createArrowsSvg("rotate(-90 40 40)", "M46 50.9999L34.3871 39.6259L46 29.0644");
    serviceTags.appendChild(prevArrow);

    const carousel = document.createElement('ul');
    serviceTags.appendChild(carousel);

    const nextArrow = createArrowsSvg("rotate(90 40 40)", "M34 29.0001L45.6129 40.3741L34 50.9356");
    serviceTags.appendChild(nextArrow);

    const all = { name: "Todos", imagePath: "resources/icons/hair-clipper.png", imageDescription: "Imagen png de una máquina de pelar." };
    activeCategories.unshift(all);

    let currentIndex = 0;
    let selectedIndex = 0;
    let visibleCategories = calculateVisibleCategories();

    renderCategories();

    // Recalcula las categorías visibles al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        visibleCategories = calculateVisibleCategories();
        renderCategories();
    });

    function calculateVisibleCategories() {
        const windowWidth = document.documentElement.clientWidth;

        if (windowWidth < 500) return 4; // Móviles
        return 5; // Pantallas grandes
    }

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

            li.addEventListener('click', async () => {
                selectedIndex = categoryIndex;
                renderCategories();

                const services = await fetchActiveServices();
                const filteredServices = services.filter(service => service.category.name === category.name);
                serviceRenderer.renderServices(category.name === 'Todos' ? services : filteredServices);
            });

            carousel.appendChild(li);
        }

        // Muestra u oculta las flechas según la cantidad de categorías visibles
        prevArrow.style.display = activeCategories.length > visibleCategories ? 'block' : 'none';
        nextArrow.style.display = activeCategories.length > visibleCategories ? 'block' : 'none';
    }

    prevArrow.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + activeCategories.length) % activeCategories.length;
        renderCategories();
    });

    nextArrow.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % activeCategories.length;
        renderCategories();
    });
}


function createArrowsSvg(transform, pathD) {
    const innerHtmlContent = `
        <circle cx="40" cy="40" r="39.5" transform="${transform}" fill="#708090" stroke="#708090"/>
        <path d="${pathD}" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    `;
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

async function setPricingDetails(serviceRenderer) {
    // Contenedor del carousel que contiene los detalles de los servicios
    const serviceDetails = document.createElement('div');
    serviceDetails.id = 'service-details';

    // Flecha izquierda
    const prevArrow = createArrowsSvg("rotate(-90 40 40)", "M46 50.9999L34.3871 39.6259L46 29.0644");
    serviceDetails.appendChild(prevArrow);

    // Lista de los servicios
    serviceDetails.appendChild(document.createElement('ul'));

    // Flecha derecha
    const nextArrow = createArrowsSvg("rotate(90 40 40)", "M34 29.0001L45.6129 40.3741L34 50.9356");
    serviceDetails.appendChild(nextArrow);
    
    // Contenedor principal de la sección de precios
    const pricingContent = document.getElementById('pricing-content');
    pricingContent && pricingContent.appendChild(serviceDetails);
    
    // Renderiza los servicios a mostrar
    serviceRenderer.renderServices(await fetchActiveServices());
}

function createServicePrincingRenderer() {
    let selectedId = null;
    let currentIndex = 0;
    let serviceToShow = calculateVisibleServices();
    let visibleServices = null;

    function calculateVisibleServices() {
        const windowWidth = document.documentElement.clientWidth;

        if (windowWidth < 500) return 1; // Móviles
        return 2; // Pantallas grandes
    }

    function renderServiceCards(services) {
        const serviceInput = document.querySelector('#reservation-content form input:not(input.iti__search-input):nth-of-type(4)');

        const carousel = document.querySelector('#service-details ul');
        if (carousel) carousel.innerHTML = '';

        visibleServices = Math.min(serviceToShow, services.length);

        for (let i = 0; i < visibleServices; i++) {
            const serviceIndex = (currentIndex + i) % services.length;
            const service = services[serviceIndex];
            const li = document.createElement('li');

            const img = document.createElement('img');
            img.src = service.imagePath;
            img.alt = service.imageDescription;
            li.appendChild(img);

            const div = document.createElement('div');
            li.appendChild(div);

            const divDetails = document.createElement('div');

            const pName = document.createElement('p');
            pName.textContent = service.name;
            divDetails.appendChild(pName);

            const pTime = document.createElement('p');
            pTime.textContent = service.estimatedTime + ' min.';
            pTime.classList.add('service-details-time');
            divDetails.appendChild(pTime);

            div.appendChild(divDetails);

            const pPrice = document.createElement('p');
            pPrice.classList.add('service-details-price');
            pPrice.textContent = `${service.price} DOP`;
            div.appendChild(pPrice);

            if (service.id === selectedId) {
                li.classList.add('service-details-active');
                if (serviceInput) {
                    serviceInput.value = pName.textContent;
                    serviceInput.dispatchEvent(new Event('input'));
                }
            }

            li.addEventListener('click', () => {
                selectedId = service.id;
                renderServiceCards(services);
            });

            carousel && carousel.appendChild(li);
        }

        // Actualizar la cantidad de servicios a mostrar cuando la ventana cambia de tamaño
        window.addEventListener('resize', () => {
            serviceToShow = calculateVisibleServices();
            renderServiceCards(services);
        });
    }

    function renderServices(services) {
        const arrows = document.querySelectorAll('#service-details svg');
        const prevArrow = arrows[0];
        const nextArrow = arrows[1];

        if (prevArrow && nextArrow) {
            const newPrevArrow = prevArrow.cloneNode(true);
            const newNextArrow = nextArrow.cloneNode(true);
            prevArrow.parentNode.replaceChild(newPrevArrow, prevArrow);
            nextArrow.parentNode.replaceChild(newNextArrow, nextArrow);

            newPrevArrow.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + services.length) % services.length;
                renderServiceCards(services);
            });

            newNextArrow.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % services.length;
                renderServiceCards(services);
            });

            if (visibleServices !== null) {
                if (visibleServices >= services.length) {
                    newPrevArrow.style.visibility = 'hidden';
                    newNextArrow.style.visibility = 'hidden';
                } else {
                    newPrevArrow.style.visibility = 'visible';
                    newNextArrow.style.visibility = 'visible';
                }
            }
        }

        renderServiceCards(services);
    }

    return {
        renderServices,
        getSelectedId: () => selectedId
    };
}
