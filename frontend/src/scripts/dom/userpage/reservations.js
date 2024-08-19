import { setToggleSwitch, setCheckboxes, cancelChanges, toggleEditState } from "./main.js";
import { memoizeFetch, formatDate } from '../../utils.js';
import { fetchActiveServices } from "../services.js";
import { fetchActiveBarbers } from "../barbers.js";
import { validateAvailability } from "../reservation.js";

const fetchReservations = memoizeFetch(getReservations);

export function setReservations() {
    // Establecer el menu de hamburguesa
    document.querySelector('.hamburger-menu').addEventListener('click', () => {
        const navMenu = document.querySelector('nav');
        navMenu.classList.toggle('active');
    });
    
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
    const tbody = document.querySelector('#reservations-form table tbody');
    tbody.innerHTML = '';
    // Almacenar los datos originales de las reservas
    const originalData = JSON.parse(JSON.stringify(reservations));
    
    reservations.forEach(async (reservation) => {
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
            option.value = barber.id;
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
            option.value = service.id;
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
    
        // Función para mostrar el modal con los detalles de la reserva
        function showDetails(reservation) {
            // Verificar que las propiedades existan antes de usarlas
            const barberName = reservation.barber?.name || 'N/A';
            const serviceName = reservation.service?.name || 'N/A';
            const startDate = reservation.startDateTime ? formatDate(reservation.startDateTime) : 'N/A';
            const endDate = reservation.endDateTime ? formatDate(reservation.endDateTime) : 'N/A';
        
            Swal.fire({
                icon: "info",
                title: "Detalles de la Reserva",
                html: `<p><strong>Nombre del Cliente:</strong> ${reservation.contactName || 'N/A'}</p>
                       <p><strong>Email del Cliente:</strong> ${reservation.contactEmail || 'N/A'}</p>
                       <p><strong>Teléfono del Cliente:</strong> ${reservation.contactPhone || 'N/A'}</p>
                       <p><strong>Barbero:</strong> ${barberName}</p>
                       <p><strong>Servicio:</strong> ${serviceName}</p>
                       <p><strong>Fecha de inicio:</strong> ${startDate}</p>
                       <p><strong>Fecha de fin:</strong> ${endDate}</p>
                       <p><strong>¿Términos aceptados?</strong> ${
                           reservation.termsAccepted ? "Sí" : "No"
                       }</p>
                       <p><strong>¿Está activa?</strong> ${
                           reservation.isActive ? "Sí" : "No"
                       }</p>
                       ${reservation.message ? `<p><strong>Mensaje:</strong> ${reservation.message}</p>` : ''}`,
                confirmButtonText: "Cerrar",
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(`Se visualizó la reserva con el id: ${reservation.id}`);
                }
            });
        }
        
        row.querySelector('td:nth-of-type(6)').style.cursor = 'not-allowed';
    
        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(row);

        const dateTimeInput = row.querySelector('input[type="datetime-local"]');
        const serviceInput = row.querySelector('select:nth-of-type(2)');
        const barberInput = row.querySelector('select:first-of-type');

        dateTimeInput.addEventListener('input', async () => {
            if (!await validateAvailability(dateTimeInput, serviceInput, barberInput)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un problema al actualizar la reserva.'
                });
            }
        })
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
            const rows = document.querySelectorAll('#reservations-form table tbody tr');

            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                const checkbox = row.querySelector('.select-user');
                
                if (checkbox.checked) {
                    const contactName = row.querySelector('input[type="text"]:first-of-type').value;
                    const dateTimeInput = row.querySelector('input[type="datetime-local"]');
                    const selects = row.querySelectorAll('select');
                    const barberInput = selects[0];
                    const serviceInput = selects[1];
                    const isActive = row.querySelector('.toggle-switch').classList.contains('active');

                    const data = {
                        contactName: contactName,
                        dateTime: dateTimeInput.value,
                        serviceId: parseInt(serviceInput.value, 10),
                        barberId: parseInt(barberInput.value, 10),
                        isActive: isActive
                    };

                    // Usar el index para obtener el valor correcto de originalData
                    await updateReservation(originalData[index], data, checkbox);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un problema al actualizar la reserva.'
            });
            console.log(`Error al tratar de actualizar las reservas: ${error}`);
        }
    }

    async function updateReservation(reservation, newData, checkbox) {
        if (reservation.contactName === newData.contactName &&
            reservation.startDateTime === newData.dateTime &&
            reservation.service === newData.service &&
            reservation.barber === newData.barber &&
            reservation.isActive === newData.isActive) {

            successUpdate();
        } else {
            try {
                const response = await fetch(`http://localhost:8080/reservation/${reservation.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('JWT')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newData)
                });

                if (!response.ok) {
                    throw new Error(`Error al guardar los cambios aplicados a la reserva con id: ${reservation.id}`);
                }

                // Modificando los datos iniales para que concidan con los nuevos
                reservation.contactName = newData.contactName;
                reservation.startDateTime = newData.dateTime;
                reservation.service = newData.service;
                reservation.barber = newData.barber;
                reservation.isActive = newData.isActive;
                successUpdate();

            } catch (error) {
                console.error('Error al actualizar la reserva:', error);

                // Mostrar mensaje de error usando SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un problema al actualizar la reserva.'
                });
            }
        }

        function successUpdate() {
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

    // Botón Cancelar
    cancelChanges(setReservationsTbody);
}