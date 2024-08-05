import { memoizeFetch } from '../utils.js';

const fetchServiceCategories = memoizeFetch(getActiveServiceCategories);
const fetchServices = memoizeFetch(getActiveServices);

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
        return categories.filter(category => category.isActive);
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
        return services.filter(service => service.isActive);
    } catch (error) {
        console.error('Error al cargar los servicios desde el backend:', error);
    }
}

export async function setServicesSection() {
    try {
        // Categorías de los servicios activas
        const categories = await fetchServiceCategories();

        // Top 6 Categorías activas
        const top6Categories = categories.slice(0, 6);

        // Contenedor principal del contenido de los servicios
        const servicesContent = document.getElementById('services-content');
        
        // Imagen del barbero
        servicesContent.appendChild(document.createElement('div'));
        
        // Lista de las categorías
        servicesContent.appendChild(document.createElement('ul'));
        const categoriesList = document.querySelector('#services-content ul');

        // Agregando las categorías al DOM
        top6Categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${category.imagePath}" alt="${category.imageDescription}">
                <p>${category.name}</p>
            `;
            categoriesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al agregar las categorías de los servicios al DOM:', error);
    }
}

export async function setPricingSection() {
    const serviceRenderer = createServicePrincingRenderer();

    // Estableciendo la sección de los precios dentro de los servicios
    await setPricingCategories(serviceRenderer);
    // Establecer los detalles de los servicios
    await setPricingDetails(serviceRenderer);
}

async function setPricingCategories(serviceRenderer) {
    const activeCategories = await fetchServiceCategories();

    // Contenedor principal de la sección de precios
    const pricingContent = document.getElementById('pricing-content');

    // Contenedor del carousel que contiene las categorías de los servicios
    const serviceTags = document.createElement('div');
    serviceTags.id = 'service-tags';
    pricingContent.appendChild(serviceTags);

    // Flecha izquierda
    const prevArrow = createArrowsSvg("rotate(-90 40 40)", "M46 50.9999L34.3871 39.6259L46 29.0644");
    serviceTags.appendChild(prevArrow);
    
    // Lista de las categorías
    const carousel = document.createElement('ul');
    serviceTags.appendChild(carousel);

    // Flecha derecha
    const nextArrow = createArrowsSvg("rotate(90 40 40)", "M34 29.0001L45.6129 40.3741L34 50.9356");
    serviceTags.appendChild(nextArrow);

    const all = { name: "Todos", imagePath: "resources/icons/hair-clipper.png", imageDescription: "Imagen png de una máquina de pelar." };
    activeCategories.unshift(all);

    let currentIndex = 0;
    const categoriesToShow = 5;
    const visibleCategories = Math.min(categoriesToShow, activeCategories.length);
    let selectedIndex = 0;

    renderCategories();

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
                const selectedCategory = activeCategories[selectedIndex];
                renderCategories();

                const services = await fetchServices();
                const filteredServices = services.filter(service => service.category.name == selectedCategory.name);
                const filter = selectedCategory.name === 'Todos' ? services : filteredServices;
                console.log(filter);
                serviceRenderer.renderServices(filter);
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
    pricingContent.appendChild(serviceDetails);
    
    // Renderiza los servicios a mostrar
    serviceRenderer.renderServices(await fetchServices());
}

function createServicePrincingRenderer() {
    let selectedId = null;
    let currentIndex = 0;
    const serviceToShow = 2;

    function renderServiceCards(services) {
        const carousel = document.querySelector('#service-details ul');
        carousel.innerHTML = '';

        const visibleServices = Math.min(serviceToShow, services.length);

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
            }

            li.addEventListener('click', () => {
                selectedId = service.id;
                renderServiceCards(services);
            });

            carousel.appendChild(li);
        }
    }

    function renderServices(services) {
        const arrows = document.querySelectorAll('#service-details svg');
        const prevArrow = arrows[0];
        const nextArrow = arrows[1];

        // Remover anteriores event listeners, clonando los nodos
        const newPrevArrow = prevArrow.cloneNode(true);
        const newNextArrow = nextArrow.cloneNode(true);
        prevArrow.parentNode.replaceChild(newPrevArrow, prevArrow);
        nextArrow.parentNode.replaceChild(newNextArrow, nextArrow);

        // Agregar nuevos event listeners
        newPrevArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + services.length) % services.length;
            renderServiceCards(services);
        });

        newNextArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % services.length;
            renderServiceCards(services);
        });

        renderServiceCards(services);
    }

    return {
        renderServices,
        getSelectedId: () => selectedId
    };
}
