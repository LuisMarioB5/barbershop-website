import { setToggleSwitch, setCheckboxes, toggleEditState, cancelChanges } from "./main.js";
import { capitalizeUserRoles, memoizeFetch } from '../../utils.js';

const fetchUsers = memoizeFetch(getUsers);
const fetchRoleUsers = memoizeFetch(getRoleUsers); 

export function setUsers() {
    setUserCount();
    setUsersTbody();
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
            `<td><input type="text" value="${user.userName}" style="cursor: not-allowed" disabled></td>`,
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
            `<td><input type="email" value="${user.email}" style="cursor: not-allowed" disabled></td>`
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
        select.style.cursor = 'not-allowed';
        
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

        row.querySelector('td:nth-of-type(3)').style.cursor = 'not-allowed';


        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(row);
    });

    // Configurar el interruptor de alternancia
    setToggleSwitch();
    
    // Configurar los checkboxes
    setCheckboxes();
    
    // Botón Guardar
    document.querySelector('#button-container button:first-of-type').addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir el envío del formulario
        await updateChanges();
    });

    async function updateChanges() {
        try {
            const rows = document.querySelectorAll('#user-form table tbody tr');
    
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                const checkbox = row.querySelector('.select-user');
                if (checkbox.checked) {
                    const userName = row.querySelector('input[type="text"]').value;
                    const email = row.querySelector('input[type="email"]').value;
                    const role = row.querySelector('select').value;
                    const isActive = row.querySelector('.toggle-switch').classList.contains('active') ? true : false;
    
                    const data = {
                        userName,
                        email,
                        role,
                        isActive
                    };
                    await updateUser(originalData[index], data, checkbox);
                }
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un problema al actualizar el usuario.'
            });
            console.log(`Error al tratar de actualizar los usuarios: ${error}`);
        }

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
    
    // Botón Cancelar
    cancelChanges(setUsersTbody);
}