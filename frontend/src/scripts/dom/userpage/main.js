import { setUsers } from './users.js';
import { setReservations } from './reservations.js';
import { setSignoutButtons } from '../../auth.js';
import { parseJwt, isTokenExpired } from '../../utils.js';

export function setUserPage() {
    setSignoutButtons(document.getElementById('signout-btn'));

    const token = localStorage.getItem('JWT');
    const body = document.querySelector('body');

    // Verificar primero si el token existe
    if (!token) {
        body.innerHTML = ''; // Limpia el contenido del body

        // Muestra la alerta
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No has iniciado sesión para visualizar esta página. ¿Deseas iniciar sesión?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, iniciar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a la página de inicio de sesión
                window.location.href = '../login.html';
            } else {
                // Si el usuario cancela, redirigir a la página principal
                window.location.href = '../index.html';
            }
        });
        return; // Salir de la función si no hay token
    }

    // Verificar si el token ha expirado
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
        return; // Salir de la función si el token ha expirado
    }

    // Si el token es válido, verificar roles y permisos
    const userRole = parseJwt(token).role;

    if (userRole === 'ROLE_ADMIN') {
        if (window.location.pathname.endsWith('users.html')) {
            setUsers();
        } else if (window.location.pathname.endsWith('reservations.html')) {
            setReservations();
        }
    } else if (userRole === 'ROLE_BARBER') {
        if (window.location.pathname.endsWith('users.html')) {
            body.innerHTML = '';
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'No tienes los permisos necesarios para visualizar esta página.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = 'reservations.html';
            });
        } else if (window.location.pathname.endsWith('reservations.html')) {
            document.querySelector('nav ul li:first-of-type').style.display = 'none';
            setReservations();
        }
    } else {
        body.innerHTML = '';
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'No tienes los permisos necesarios para visualizar esta página.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = '../index.html';
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
    const inputs = Array.from(row.querySelectorAll('input[type="text"], input[type="email"], input[type="datetime-local"], select, button'));
    const button = inputs.pop();
    const toggleCell = row.querySelector('.toggle-switch');
    const toggleTd = toggleCell.closest('td');

    if (checkbox.checked) {
        if (!window.location.pathname.endsWith('reservations.html')) {
            // Habilitar edición
            inputs.forEach(input => {
                input.removeAttribute('disabled');
                if (input.tagName.toLowerCase() === 'select') {
                    input.style.cursor = 'pointer'; // Indica que el selector es interactivo
                } else {
                    input.style.cursor = 'text'; // Indica que el input es editable
                }
            });
        }
        button.removeAttribute('disabled');
        button.style.cursor = 'pointer';

        toggleTd.style.cursor = 'auto'; // Indica que el toggle (el td) es interactivo
        toggleCell.style.pointerEvents = 'auto'; // Permitir interacción con el toggle
        toggleCell.style.cursor = 'pointer'; // Indica que el toggle es clicable
    } else {
        if (!window.location.pathname.endsWith('reservations.html')) {
            // Deshabilitar edición
            inputs.forEach(input => {
                input.setAttribute('disabled', 'true');
                input.style.cursor = 'not-allowed'; // Indica que el elemento no es interactivo
            });
        }
        button.setAttribute('disabled', 'true');
        button.style.cursor = 'not-allowed';

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
