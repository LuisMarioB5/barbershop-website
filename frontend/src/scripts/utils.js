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
