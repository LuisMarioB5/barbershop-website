import { memoizeFetch } from "../utils.js";

const fetchActiveBarbers = memoizeFetch(getActiveBarbers);

// Obtiene los servicios desde el backend y devuelve solo los activos
async function getActiveBarbers() {
    try {
        const response = await fetch('http://localhost:8080/barber', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const barbers = await response.json();
        return barbers.filter(barber => barber.isActive);
    } catch (error) {
        console.error('Error al cargar los barberos desde el backend:', error);
    }
}

export async function setBarbers() {
    const barbersContent = document.getElementById('barbers-content');
    const activeBarbers = await fetchActiveBarbers();

    activeBarbers.forEach(barber => {
        const barberCard = document.createElement('div');
        barberCard.classList.add('barber-card');
        barberCard.style.backgroundImage = `url(${barber.imagePath})`;
        barberCard.style.backgroundSize = 'cover';
        barberCard.style.backgroundRepeat = 'no-repeat';
        barberCard.addEventListener('click', () => {
            const barberCards = document.querySelectorAll('.barber-card');
            barberCards.forEach(card => card.classList.remove('barber-card-selected'));
            
            barberCard.classList.add('barber-card-selected');
        })
        barbersContent.appendChild(barberCard);
        


        const barberCardDetails = document.createElement('div');
        barberCardDetails.classList.add('barber-card-details');
        barberCard.appendChild(barberCardDetails);
        
        const div = document.createElement('div');
        barberCardDetails.appendChild(div);

        const pName = document.createElement('p');
        pName.textContent = barber.name;
        div.appendChild(pName);

        const pPosition = document.createElement('p');
        pPosition.textContent = barber.position;
        div.appendChild(pPosition);

        const pDescription = document.createElement('p');
        pDescription.classList.add('barber-card-description');
        pDescription.textContent = barber.description;
        barberCardDetails.appendChild(pDescription);

        const barberCardSocialMedia = document.createElement('div');
        barberCardSocialMedia.classList.add('barber-card-social-media');
        barberCardDetails.appendChild(barberCardSocialMedia);

        const facebookSvg = createSvg("M27.5 15C27.5 8.1 21.9 2.5 15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.05 6.8 26.0875 12.5 27.25V18.75H10V15H12.5V11.875C12.5 9.4625 14.4625 7.5 16.875 7.5H20V11.25H17.5C16.8125 11.25 16.25 11.8125 16.25 12.5V15H20V18.75H16.25V27.4375C22.5625 26.8125 27.5 21.4875 27.5 15Z");
        const facebook = createAnchorWithSvg(barber.facebookLink, facebookSvg);
        barberCardSocialMedia.appendChild(facebook);

        const instagramSvg = createSvg("M9.75 2.5H20.25C24.25 2.5 27.5 5.75 27.5 9.75V20.25C27.5 22.1728 26.7362 24.0169 25.3765 25.3765C24.0169 26.7362 22.1728 27.5 20.25 27.5H9.75C5.75 27.5 2.5 24.25 2.5 20.25V9.75C2.5 7.82718 3.26384 5.98311 4.62348 4.62348C5.98311 3.26384 7.82718 2.5 9.75 2.5ZM9.5 5C8.30653 5 7.16193 5.47411 6.31802 6.31802C5.47411 7.16193 5 8.30653 5 9.5V20.5C5 22.9875 7.0125 25 9.5 25H20.5C21.6935 25 22.8381 24.5259 23.682 23.682C24.5259 22.8381 25 21.6935 25 20.5V9.5C25 7.0125 22.9875 5 20.5 5H9.5ZM21.5625 6.875C21.9769 6.875 22.3743 7.03962 22.6674 7.33265C22.9604 7.62567 23.125 8.0231 23.125 8.4375C23.125 8.8519 22.9604 9.24933 22.6674 9.54235C22.3743 9.83538 21.9769 10 21.5625 10C21.1481 10 20.7507 9.83538 20.4576 9.54235C20.1646 9.24933 20 8.8519 20 8.4375C20 8.0231 20.1646 7.62567 20.4576 7.33265C20.7507 7.03962 21.1481 6.875 21.5625 6.875ZM15 8.75C16.6576 8.75 18.2473 9.40848 19.4194 10.5806C20.5915 11.7527 21.25 13.3424 21.25 15C21.25 16.6576 20.5915 18.2473 19.4194 19.4194C18.2473 20.5915 16.6576 21.25 15 21.25C13.3424 21.25 11.7527 20.5915 10.5806 19.4194C9.40848 18.2473 8.75 16.6576 8.75 15C8.75 13.3424 9.40848 11.7527 10.5806 10.5806C11.7527 9.40848 13.3424 8.75 15 8.75ZM15 11.25C14.0054 11.25 13.0516 11.6451 12.3483 12.3483C11.6451 13.0516 11.25 14.0054 11.25 15C11.25 15.9946 11.6451 16.9484 12.3483 17.6516C13.0516 18.3549 14.0054 18.75 15 18.75C15.9946 18.75 16.9484 18.3549 17.6516 17.6516C18.3549 16.9484 18.75 15.9946 18.75 15C18.75 14.0054 18.3549 13.0516 17.6516 12.3483C16.9484 11.6451 15.9946 11.25 15 11.25Z");
        const instagram = createAnchorWithSvg(barber.facebookLink, instagramSvg);
        barberCardSocialMedia.appendChild(instagram);

        const xSvg = createSvg("M22.1887 3.75H26.0225L17.6475 13.2812L27.5 26.25H19.785L13.7437 18.3837L6.83 26.25H2.9925L11.9512 16.0563L2.5 3.75H10.41L15.8725 10.94L22.1887 3.75ZM20.8437 23.965H22.9687L9.255 5.915H6.975L20.8437 23.965Z");
        const x = createAnchorWithSvg(barber.facebookLink, xSvg);
        barberCardSocialMedia.appendChild(x);
    });
}

function createSvg(iconPath) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("xmlns", svgNamespace);
    svg.setAttribute("width", "30");
    svg.setAttribute("height", "30");
    svg.setAttribute("viewBox", "0 0 30 30");
    svg.setAttribute("fill", "none");

    const fillColor = "#DAA520";

    const path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("d", iconPath);
    path.setAttribute("fill", fillColor);

    svg.appendChild(path);
    return svg;
}

function createAnchorWithSvg(href, svgIcon) {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    anchor.setAttribute('target', '_blank');
    anchor.appendChild(svgIcon);
    return anchor;
}
