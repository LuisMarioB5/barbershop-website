import { capitalizeUserRoles, memoizeFetch, parseJwt, isTokenExpired } from '../utils.js';
import { setSignoutButtons } from '../auth.js';

let fetchUsers;
let fetchRoleUsers;

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
            window.location.href = 'login.html';
        });

    } else if (parseJwt(token).role === 'ROLE_ADMIN') {
        if(window.location.pathname.endsWith('users.html')){
            fetchUsers = memoizeFetch(getUsers);
            fetchRoleUsers = memoizeFetch(getRoleUsers);

            setUserCount();
            setUsersTbody();
        } else if(window.location.pathname.endsWith('reservations.html')) {
            console.log('hola')
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

// Obtiene los usuario desde el backend
async function getUsers() {
    try {
        const response = await fetch('http://localhost:8080/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue 200');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al cargar los usuarios desde el backend:', error);
    }
}

// Obtiene los roles de usuario desde el backend
async function getRoleUsers() {
    try {
        const response = await fetch('http://localhost:8080/user/roles', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('JWT')}`
            }
        });

        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue 200');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al cargar los usuarios desde el backend:', error);
    }
}

async function setUserCount() {
    const users = await fetchUsers();
    const adminRole = users.filter(user => user.role === 'ROLE_ADMIN');
    const barberRole = users.filter(user => user.role === 'ROLE_BARBER');
    const userRole = users.filter(user => user.role === 'ROLE_USER');
    
    setCountAndTitle(users);
    setCountAndTitle(adminRole);
    setCountAndTitle(barberRole);
    setCountAndTitle(userRole);

    const pTitle = document.querySelector('#user-content ul li:nth-of-type(1) p:nth-of-type(2)');
    pTitle.textContent = 'Total';
    
    function setCountAndTitle(roleList) {
        const roleLength = roleList.length;
        const role = roleList[0].role;
    
        let title;
        if (role === 'ROLE_ADMIN') {
            title = roleLength === 1 ? 'Administrador' : 'Administradores';
        } else if (role === 'ROLE_BARBER') {
            title = roleLength === 1 ? 'Barbero' : 'Barberos';
        } else if (role === 'ROLE_USER') {
            title = roleLength === 1 ? 'Usuario' : 'Usuarios';
        }
    
        const li = document.createElement('li');
        li.innerHTML = `<p>${roleLength}</p>
        <p>${title}</p>`;
    
        const ul = document.querySelector('#user-content ul');
        ul.appendChild(li);
    }
}
async function setUsersTbody() {
    const users = await fetchUsers();
    const roleUsers = await fetchRoleUsers();
    const tbody = document.querySelector('#user-form table tbody');
    tbody.innerHTML = '';
    // Almacenar los datos originales de los usuarios
    const originalData = JSON.parse(JSON.stringify(users));

    users.forEach(user => {
        // Crear una nueva fila
        const row = document.createElement('tr');
        
        // Crear celdas para la fila
        const cells = [
            `<td><input type="checkbox" class="select-user"></td>`,
            `<td><input type="text" value="${user.userName}" disabled></td>`,
            `<td>
                <div class="toggle-switch ${user.isActive === true ? 'active' : 'inactive'}" style="pointer-events: none;">
                    <!-- SVG para el estado activo -->
                    <svg class="active" xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 42 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 5.37258 5.37258 0 12 0H30C36.6274 0 42 5.37258 42 12C42 18.6274 36.6274 24 30 24H12C5.37258 24 0 18.6274 0 12Z" fill="#DAA520"/>
                        <rect class="circle" x="20" y="2" width="20" height="20" rx="10" fill="white"/>
                    </svg>
                    <!-- SVG para el estado inactivo -->
                    <svg class="inactive" xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 42 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 5.37258 5.37258 0 12 0H30C36.6274 0 42 5.37258 42 12C42 18.6274 36.6274 24 30 24H12C5.37258 24 0 18.6274 0 12Z" fill="#C8C9CC"/>
                        <rect class="circle" x="2" y="2" width="20" height="20" rx="10" fill="white"/>
                    </svg>
                </div>
            </td>`,
            `<td><input type="email" value="${user.email}" disabled></td>`
        ];

        // Agregar cada celda a la fila
        cells.forEach(cell => {
            const cellElement = document.createElement('td');
            cellElement.innerHTML = cell;
            row.appendChild(cellElement);
        });

        const tdSelect = document.createElement('td');
        const select = document.createElement('select');
        select.disabled = true;
        
        roleUsers.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = capitalizeUserRoles(role);

            if (user.role === option.value) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        tdSelect.appendChild(select);
        row.appendChild(tdSelect);

        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(row);
    });

    // Configurar el interruptor de alternancia
    setToggleSwitch();
    function setToggleSwitch() {
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

    // Configurar los checkboxes
    setCheckboxes();
    function setCheckboxes() {
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

    function toggleEditState(checkbox) {
        const row = checkbox.closest('tr');
        const inputs = row.querySelectorAll('input[type="text"], input[type="email"], select');
        const toggleSwitch = row.querySelector('.toggle-switch');

        if (checkbox.checked) {
            // Habilitar edición
            inputs.forEach(input => input.removeAttribute('disabled'));
            toggleSwitch.style.pointerEvents = 'auto';
        } else {
            // Deshabilitar edición
            inputs.forEach(input => input.setAttribute('disabled', 'true'));
            toggleSwitch.style.pointerEvents = 'none';
        }
    }
    
    // Botones Guardar y Cancelar
    document.querySelector('#button-container button:first-of-type').addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        updateChanges();
    });

    function updateChanges() {
        const rows = document.querySelectorAll('#user-form table tbody tr');

        let index = 0;
        rows.forEach(async row => {
            const checkbox = row.querySelector('.select-user');
            if (checkbox.checked) {
                const userName = row.querySelector('input[type="text"]').value;
                const email = row.querySelector('input[type="email"]').value;
                const role = row.querySelector('select').value;
                const isActive = row.querySelector('.toggle-switch').classList.contains('active') ? true : false;

                // Aquí puedes realizar una solicitud fetch para guardar los cambios
                const data = {
                    userName,
                    email,
                    role,
                    isActive
                };
                updateUser(originalData[index], data, checkbox);
            }
            index++;
        });

        async function updateUser(user, updatedData, checkbox) {
            if (user.userName === updatedData.userName && user.email === updatedData.email && user.role === updatedData.role && user.isActive === updatedData.isActive) {
                // Muestra el mensaje de exito pero no envia los datos al servidor ya que no es necesario
                successUpdate();
            } else {
                try {
                    const response = await fetch(`http://localhost:8080/user/${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    });
            
                    if (!response.ok) {
                        throw new Error(`Error al guardar los cambios aplicados al usuario ${updatedData.userName}`);
                    }
                    
                    // Modificando los datos iniales para que concidan con los nuevos
                    user.userName = updatedData.userName;
                    user.email = updatedData.email;
                    user.role = updatedData.role;
                    user.isActive = updatedData.isActive;

                    successUpdate();
            
                } catch (error) {
                    console.error('Error al actualizar el usuario:', error);
            
                    // Mostrar mensaje de error usando SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Hubo un problema al actualizar el usuario.'
                    });
                }
            }

            function successUpdate() {
                // Mostrar mensaje de éxito usando SweetAlert2
                Swal.fire({
                    title: 'Actualización exitosa',
                    text: 'Los cambios se han guardado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                checkbox.checked = false;
                toggleEditState(checkbox);

                const checkboxes = document.querySelectorAll('.select-user');
                let change = null;
                checkboxes.forEach(chkbox => {
                    if (!chkbox.checked) {
                        change = true;
                    }
                });
                
                if (change) {
                    const selectAllCheckbox = document.getElementById('select-all');
                    selectAllCheckbox.checked = false;
                }
            }
        }
    }

    document.querySelector('#button-container button:last-of-type').addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        cancelChanges();
    });
 
    function cancelChanges() {
        // Revertir a los datos originales
        setUsersTbody(); // Volver a cargar la tabla con los datos originales
        Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'Los cambios se han cancelado.',
            confirmButtonText: 'Aceptar'
        });
    }
}
