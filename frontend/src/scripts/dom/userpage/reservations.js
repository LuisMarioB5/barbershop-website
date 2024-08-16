import { setToggleSwitch, setCheckboxes, toggleEditState, cancelChanges } from "./main.js";
import { memoizeFetch, formatDate } from '../../utils.js';
import { fetchActiveServices } from "../services.js";
import { fetchActiveBarbers } from "../barbers.js";

const fetchReservations = memoizeFetch(getReservations);

export function setReservations() {
    console.log('hola')
    setReservationCount();
    setReservationsTbody();
}

// Obtiene las reservas desde el backend
async function getReservations() {
    try {
        const response = await fetch('http://localhost:8080/reservation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue 200');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al cargar las reservas desde el backend:', error);
    }
}

async function setReservationCount() {
    const reservations = await fetchReservations();
    const actives = reservations.filter(reservation => reservation.isActive === true);
    const disabled = reservations.filter(reservation => reservation.isActive === false);
    
    setCountAndTitle(reservations, 'Total');
    setCountAndTitle(actives, 'Activas');
    setCountAndTitle(disabled, 'Desactivas');
    
    function setCountAndTitle(reservationList, title) {
        const listLength = reservationList.length;
    
        const li = document.createElement('li');
        li.innerHTML = `<p>${listLength}</p>
        <p>${title}</p>`;
    
        const ul = document.querySelector('#reservations-content ul');
        ul.appendChild(li);
    }
}

async function setReservationsTbody() {
    const reservations = await fetchReservations();
    const services = await fetchActiveServices();
    const barbers = await fetchActiveBarbers();
    const tbody = document.querySelector('#user-form table tbody');
    tbody.innerHTML = '';
    // Almacenar los datos originales de las reservas
    const originalData = JSON.parse(JSON.stringify(reservations));

    reservations.forEach((reservation) => {
        // Crear una nueva fila
        const row = document.createElement("tr");

        // Crear celdas para la fila
        const cells = [
            `<td><input type="checkbox" class="select-user"></td>`,
            `<td><input type="text" value="${reservation.contactName}" style="cursor: not-allowed" disabled></td>`,
            `<td><input type="datetime-local" value="${reservation.startDateTime}" style="cursor: not-allowed" disabled></td>`,
            `<td>
                <div class="toggle-switch ${
                    reservation.isActive === true ? "active" : "inactive"
                }" style="pointer-events: none;">
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
            `<td></td>`,
        ];

        // Agregar cada celda a la fila
        cells.forEach((cell) => {
            const cellElement = document.createElement("td");
            cellElement.innerHTML = cell;
            row.appendChild(cellElement);
        });

        // Crear celda para el selector de barberos
        const barberTd = document.createElement("td");
        const barberSelect = document.createElement("select");
        barberSelect.disabled = true;
        barberSelect.style.cursor = 'not-allowed';
        barbers.forEach((barber) => {
            const option = document.createElement("option");
            option.value = barber;
            option.textContent = barber.name;
    
            if (reservation.barber.name === barber.name) {
                option.selected = true;
            }
            barberSelect.appendChild(option);
        });
        barberTd.appendChild(barberSelect);
        row.insertBefore(barberTd, row.children[3]); // Inserta antes del toggle

        // Crear celda para el selector de servicios
        const serviceTd = document.createElement("td");
        const serviceSelect = document.createElement("select");
        serviceSelect.disabled = true;
        serviceSelect.style.cursor = 'not-allowed';
        services.forEach((service) => {
            const option = document.createElement("option");
            option.value = service;
            option.textContent = service.name;
    
            if (reservation.service.name === service.name) {
                option.selected = true;
            }
            serviceSelect.appendChild(option);
        });
        serviceTd.appendChild(serviceSelect);
        row.insertBefore(serviceTd, row.children[4]); // Inserta antes del botón

        const showMoreBtn = document.createElement("button");
        showMoreBtn.disabled = true;
        showMoreBtn.type = "button";
        showMoreBtn.textContent = "Ver Más";
        showMoreBtn.style.cursor = 'not-allowed';
        showMoreBtn.addEventListener("click", () => showDetails(reservation)); // Usa una función anónima

        const buttonTd = row.querySelector("td:last-of-type");
        buttonTd.appendChild(showMoreBtn);

        // Funcion para mostrar el modal con los detalles de la reserva
        function showDetails(reservation) {
            Swal.fire({
                icon: "info",
                title: "Detalles de la Reserva",
                html: `<p><strong>Nombre del Cliente:</strong> ${reservation.contactName}</p>
                       <p><strong>Email del Cliente:</strong> ${reservation.contactEmail}</p>
                       <p><strong>Teléfono del Cliente:</strong> ${reservation.contactPhone}</p>
                       <p><strong>Barbero:</strong> ${reservation.barber.name}</p>
                       <p><strong>Servicio:</strong> ${reservation.service.name}</p>
                       <p><strong>Fecha de inicio:</strong> ${formatDate(reservation.startDateTime)}</p>
                       <p><strong>Fecha de fin:</strong> ${formatDate(reservation.endDateTime)}</p>
                       <p><strong>Terminos aceptados?</strong> ${
                           reservation.termsAccepted ? "Sí" : "No"
                       }</p>
                       <p><strong>Está activa?</strong> ${
                           reservation.isActive ? "Sí" : "No"
                       }</p>
                       <p><strong>Mensaje:</strong> ${reservation.message}</p>`,
                confirmButtonText: "Cerrar",
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(`Se visualizo la reserva con el id: ${reservation.id}`);
                }
            });
        }
        
        row.querySelector('td:nth-of-type(6)').style.cursor = 'not-allowed';

        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(row);

    });

    // Configurar el interruptor de alternancia
    setToggleSwitch();

    // Configurar los checkboxes
    setCheckboxes();

    // // Botones Guardar y Cancelar
    // document.querySelector('#button-container button:first-of-type').addEventListener('click', (event) => {
    //     event.preventDefault(); // Prevenir el envío del formulario

    //     updateChanges();
    // });

    // function updateChanges() {
    //     const rows = document.querySelectorAll('#user-form table tbody tr');

    //     let index = 0;
    //     rows.forEach(async row => {
    //         const checkbox = row.querySelector('.select-user');
    //         if (checkbox.checked) {
    //             const userName = row.querySelector('input[type="text"]').value;
    //             const email = row.querySelector('input[type="email"]').value;
    //             const role = row.querySelector('select').value;
    //             const isActive = row.querySelector('.toggle-switch').classList.contains('active') ? true : false;

    //             // Aquí puedes realizar una solicitud fetch para guardar los cambios
    //             const data = {
    //                 userName,
    //                 email,
    //                 role,
    //                 isActive
    //             };
    //             updateUser(originalData[index], data, checkbox);
    //         }
    //         index++;
    //     });

    //     async function updateUser(user, updatedData, checkbox) {
    //         if (user.userName === updatedData.userName && user.email === updatedData.email && user.role === updatedData.role && user.isActive === updatedData.isActive) {
    //             // Muestra el mensaje de exito pero no envia los datos al servidor ya que no es necesario
    //             successUpdate();
    //         } else {
    //             try {
    //                 const response = await fetch(`http://localhost:8080/user/${user.id}`, {
    //                     method: 'PUT',
    //                     headers: {
    //                         'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify(updatedData)
    //                 });
            
    //                 if (!response.ok) {
    //                     throw new Error(`Error al guardar los cambios aplicados al usuario ${updatedData.userName}`);
    //                 }
                    
    //                 // Modificando los datos iniales para que concidan con los nuevos
    //                 user.userName = updatedData.userName;
    //                 user.email = updatedData.email;
    //                 user.role = updatedData.role;
    //                 user.isActive = updatedData.isActive;

    //                 successUpdate();
            
    //             } catch (error) {
    //                 console.error('Error al actualizar el usuario:', error);
            
    //                 // Mostrar mensaje de error usando SweetAlert2
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Oops...',
    //                     text: 'Hubo un problema al actualizar el usuario.'
    //                 });
    //             }
    //         }

    //         function successUpdate() {
    //             // Mostrar mensaje de éxito usando SweetAlert2
    //             Swal.fire({
    //                 title: 'Actualización exitosa',
    //                 text: 'Los cambios se han guardado correctamente.',
    //                 icon: 'success',
    //                 confirmButtonText: 'Aceptar'
    //             });
    //             checkbox.checked = false;
    //             toggleEditState(checkbox);

    //             const checkboxes = document.querySelectorAll('.select-user');
    //             let change = null;
    //             checkboxes.forEach(chkbox => {
    //                 if (!chkbox.checked) {
    //                     change = true;
    //                 }
    //             });
                
    //             if (change) {
    //                 const selectAllCheckbox = document.getElementById('select-all');
    //                 selectAllCheckbox.checked = false;
    //             }
    //         }
    //     }
    // }

    cancelChanges(setReservationsTbody);
}