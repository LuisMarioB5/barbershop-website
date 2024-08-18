// Configura la entrada de teléfonos
export function setPhonesInputs() {
    const phones = document.querySelectorAll(".phone");
    
    phones.forEach(phone =>{
        window.intlTelInput(phone, {
            initialCountry: "do",
            nationalMode: true,
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.3.2/build/js/utils.js"
        });
    });
}

// Maneja la carga de iframes y su fallback
export function manageIframeLoading() {
    let iframeId = "iframe-map";
    let fallbackId = "map";
    let isIframeLoaded = false;

    function iframeLoaded() {
        isIframeLoaded = true;
        document.getElementById(iframeId).style.display = "flex";
        document.getElementById(fallbackId).style.display = "none";
    }

    document.getElementById(iframeId).addEventListener('load', iframeLoaded);

    setTimeout(function() {
        if (!isIframeLoaded) {
            document.getElementById(iframeId).style.display = "none";
            document.getElementById(fallbackId).style.display = "block";
        }
    }, 2000);
}

// Decodifica el JWT
export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

// Verifica si el token ha expirado
export function isTokenExpired(token) {
    const PAYLOAD = parseJwt(token);

    if (!PAYLOAD || !PAYLOAD.exp) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return PAYLOAD.exp < currentTime;
}

// Verifica si un usuario está logueado
export function isLoggedIn() {
    const JWT = localStorage.getItem('JWT');
    return JWT !== null;
}

export function memoizeFetch(fn) {
    let data; // Variable para almacenar los datos del servidor
    let isFetched = false; // Flag para controlar si la petición ya se realizó

    return async function() {
        if (!isFetched) {
            data = await fn(); // Realiza la petición al servidor
            isFetched = true; // Marca la petición como realizada
        }
        return data; // Devuelve los datos almacenados
    };
}

export function capitalize(text) {
    // Validar que no tenga dos espacios en blanco seguidos, de ser asi los elimina
    if (text.includes('  ')) {
        text = text.replace(/  /, '');
    }

    return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function capitalizeUserRoles(role) {
    // Validar que no tenga dos espacios en blanco seguidos, de ser asi los elimina
    if (role.includes('_')) {
        const roleParts = role.split('_');
        const roleName = roleParts[1];
        
        if (roleName == 'ADMIN') {
            return 'Administrador';
        }
        
        if (roleName == 'BARBER') {
            return 'Barbero';
        }
        
        if (roleName == 'USER') {
            return 'Usuario';
        }
    }
}

// Función para formatear un string (fecha) al formato dd/MM/YYYY, hh:mm a
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

// Combierte una fecha en string dd/MM/YYYY HH:mm a YYYY-MM-ddTHH:mm
export function parseDateStr(dateStr, durationMinutes) {
    const dateTimeParts = dateStr.split(' ');
    const date = dateTimeParts[0];
    const time = dateTimeParts[1];
    const format12Hr = dateTimeParts[2];

    if (format12Hr) {
        if (format12Hr === 'PM') {
            time += 12;
        }
    }

    const dateParts = date.split('/');
    const fixedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${time}`;

    const startDate = new Date(fixedDate);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return {
        start: formatDate(startDate),
        end: formatDate(endDate)
    };
}