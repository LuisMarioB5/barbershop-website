import { setUsers } from './users.js';
import { setReservations } from './reservations.js';
import { setSignoutButtons } from '../../auth.js';
import { parseJwt, isTokenExpired } from '../../utils.js';

export function setUserPage() {
    setSignoutButtons(document.getElementById('signout-btn'));

    const token = localStorage.getItem('JWT');
    const body = document.querySelector('body');
    if (isTokenExpired(token)) {
        body.innerHTML = '';
        Swal.fire({
            icon: 'warning',
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = '../login.html';
        });

    } else if (parseJwt(token).role === 'ROLE_ADMIN' || parseJwt(token).role === 'ROLE_BARBER') {
        if(window.location.pathname.endsWith('reservations.html')) {
            setReservations();
        }

        if (parseJwt(token).role === 'ROLE_ADMIN') {
            if(window.location.pathname.endsWith('users.html')){
                setUsers();
            }  
        }

    } else {
        body.innerHTML = '';
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No tienes los permisos necesarios para visualizar esta página.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = 'index.html';
        });
    }
}

export function setToggleSwitch() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch');

    toggleSwitches.forEach(toggleSwitch => {
        toggleSwitch.addEventListener('click', () => {
            // Alternar la clase activa/inactiva
            toggleSwitch.classList.toggle('inactive');
            toggleSwitch.classList.toggle('active');
            
            // // Log del estado actual
            // const state = toggleSwitch.classList.contains('active');
            // console.log('Estado:', state ? 'Activo (true)' : 'Inactivo (false)');
        });
    });
}

export function setCheckboxes() {
    const checkboxes = document.querySelectorAll('.select-user');
    const selectAllCheckbox = document.getElementById('select-all');
    selectAllCheckbox.checked = false;
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);

            if (allChecked) {
                selectAllCheckbox.checked = true;
            } else {
                selectAllCheckbox.checked = false;
            }

            toggleEditState(checkbox);
        });
    });

    selectAllCheckbox.addEventListener('change', (event) => {
        checkboxes.forEach(checkbox => {
            checkbox.checked = event.target.checked;
            toggleEditState(checkbox);
        });
    });
}

export function toggleEditState(checkbox) {
    const row = checkbox.closest('tr');
    const inputs = row.querySelectorAll('input[type="text"], input[type="email"], input[type="datetime-local"], select, button');
    const toggleCell = row.querySelector('.toggle-switch');
    const toggleTd = toggleCell.closest('td');

    if (checkbox.checked) {
        // Habilitar edición
        inputs.forEach(input => {
            input.removeAttribute('disabled');
            if (input.tagName.toLowerCase() === 'button') {
                input.style.cursor = 'pointer'; // Indica que el botón es clicable
            } else if (input.tagName.toLowerCase() === 'select') {
                input.style.cursor = 'pointer'; // Indica que el selector es interactivo
            } else {
                input.style.cursor = 'text'; // Indica que el input es editable
            }
        });
        toggleTd.style.cursor = 'auto'; // Indica que el toggle (el td) no es interactivo
        toggleCell.style.pointerEvents = 'auto'; // Permitir interacción con el toggle
        toggleCell.style.cursor = 'pointer'; // Indica que el toggle es clicable
    } else {
        // Deshabilitar edición
        inputs.forEach(input => {
            input.setAttribute('disabled', 'true');
            input.style.cursor = 'not-allowed'; // Indica que el elemento no es interactivo
        });
        toggleCell.style.pointerEvents = 'none'; // Impedir interacción con el toggle
        toggleTd.style.cursor = 'not-allowed'; // Indica que el toggle (el td) no es interactivo
    }
}



export function cancelChanges(resetFunction) {
    document.querySelector('#button-container button:last-of-type').addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario
        
        // Revertir a los datos originales
        resetFunction(); // Volver a cargar la tabla con los datos originales
        Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'Los cambios se han cancelado.',
            confirmButtonText: 'Aceptar'
        });
    });
}
