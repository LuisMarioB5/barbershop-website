import { capitalizeUserRoles, memoizeFetch } from '../utils.js';
import { setSignoutButtons } from '../auth.js';

const fetchUsers = memoizeFetch(getUsers);
const fetchRoleUsers = memoizeFetch(getRoleUsers);

// Obtiene los usuario desde el backend
async function getUsers() {
    try {
        const jwt = localStorage.getItem('JWT');
        
        const response = await fetch('http://localhost:8080/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
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
        const jwt = localStorage.getItem('JWT');
        
        const response = await fetch('http://localhost:8080/user/roles', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
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

export function setUserPage() {
    setNavLinks();

    setSignoutButtons(document.getElementById('signout-btn'));

    setUserCount();

    setTbody();
}

function setNavLinks() {
    const sectionLinks = document.querySelectorAll('nav ul li a');

    sectionLinks.forEach(a => {
        a.addEventListener('click', () => {
            sectionLinks.forEach(a => a.classList.remove('active'));

            a.classList.add('active');
        });
    });
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

    const pTitle = document.querySelector('#panel-content ul li:nth-of-type(1) p:nth-of-type(2)');
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
    
        const ul = document.querySelector('#panel-content ul');
        ul.appendChild(li);
    }
}

async function setTbody() {
    const users = await fetchUsers();
    const roleUsers = await fetchRoleUsers();
    const tbody = document.querySelector('#user-form table tbody');
    tbody.innerHTML = '';

    users.forEach(user => {        
        // Crear una nueva fila
        const row = document.createElement('tr');

        // Crear celdas para la fila
        const cells = [
            `<td><input type="checkbox" class="select-user"></td>`,
            `<td><input type="text" value="${user.userName}" disabled></td>`,
            `<td>
                <div class="toggle-switch ${user.active ? 'active' : 'inactive'}" style="pointer-events: none;">
                    <!-- SVG para el estado activo -->
                    <svg class="${user.isActive === true ? 'active' : 'inactive'}" xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 42 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 5.37258 5.37258 0 12 0H30C36.6274 0 42 5.37258 42 12C42 18.6274 36.6274 24 30 24H12C5.37258 24 0 18.6274 0 12Z" fill="#DAA520"/>
                        <rect class="circle" x="20" y="2" width="20" height="20" rx="10" fill="white"/>
                    </svg>
                    <!-- SVG para el estado inactivo -->
                    <svg class="${user.isActive === false ? 'active' : 'inactive'}" xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 42 24" fill="none">
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
                toggleSwitch.classList.toggle('active');
                toggleSwitch.classList.toggle('inactive');
                
                // Log del estado actual
                const state = toggleSwitch.classList.contains('active');
                console.log('Estado:', state ? 'Activo (true)' : 'Inactivo (false)');
            });
        });
    }

    // Configurar los checkboxes
    setCheckboxes();

    function setCheckboxes() {
        const checkboxes = document.querySelectorAll('.select-user');
        const selectAllCheckbox = document.getElementById('select-all');
    
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
    }
    
}




// Revisar de aqui para abajo

// const originalData = [];

// function saveChanges() {
//     const rows = document.querySelectorAll("tbody tr");
//     rows.forEach((row, index) => {
//         const isChecked = row.querySelector(".select-user").checked;
//         if (isChecked) {
//             const userData = {
//                 username: row.cells[1].querySelector("input").value,
//                 status: row.cells[2].querySelector(".status-toggle").classList.contains("active") ? "activo" : "inactivo",
//                 email: row.cells[3].querySelector("input").value,
//                 role: row.cells[4].querySelector("select").value,
//             };
//             console.log(`Guardar: ${JSON.stringify(userData)}`);
//             // Aquí puedes enviar los datos al servidor para guardarlos
//         }
//     });
// }

// function cancelChanges() {
//     const rows = document.querySelectorAll("tbody tr");
//     rows.forEach((row, index) => {
//         const isChecked = row.querySelector(".select-user").checked;
//         if (isChecked) {
//             const originalUser = originalData[index];
//             row.cells[1].querySelector("input").value = originalUser.username;
//             const statusToggle = row.cells[2].querySelector(".status-toggle");
//             statusToggle.textContent = originalUser.status === "activo" ? "Activo" : "Inactivo";
//             statusToggle.classList.toggle("active", originalUser.status === "activo");
//             statusToggle.classList.toggle("inactive", originalUser.status === "inactivo");
//             row.cells[3].querySelector("input").value = originalUser.email;
//             row.cells[4].querySelector("select").value = originalUser.role;
//         }
//     });
// }

// document.getElementById("select-all").addEventListener("change", function() {
//     const checkboxes = document.querySelectorAll(".select-user");
//     checkboxes.forEach(checkbox => {
//         checkbox.checked = this.checked;
//     });
// });

// document.querySelectorAll(".status-toggle").forEach(button => {
//     button.addEventListener("click", function() {
//         const isActive = button.classList.contains("active");
//         button.textContent = isActive ? "Inactivo" : "Activo";
//         button.classList.toggle("active", !isActive);
//         button.classList.toggle("inactive", isActive);
//     });
// });

// window.addEventListener("DOMContentLoaded", () => {
//     const rows = document.querySelectorAll("tbody tr");
//     rows.forEach(row => {
//         const userData = {
//             username: row.cells[1].querySelector("input").value,
//             status: row.cells[2].querySelector(".status-toggle").classList.contains("active") ? "activo" : "inactivo",
//             email: row.cells[3].querySelector("input").value,
//             role: row.cells[4].querySelector("select").value,
//         };
//         originalData.push(userData);
//     });
// });