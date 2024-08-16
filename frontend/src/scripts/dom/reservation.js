import { fetchActiveServices } from "./services.js";
import { fetchActiveBarbers } from "./barbers.js";
import { capitalize } from "../utils.js";

const inputs = document.querySelectorAll('#reservation-content form input:not(input.iti__search-input)');

export async function setDatalistsOnReservation() {
    if (inputs) {
        const nameInput = inputs[0];
        const emailInput = inputs[1];
        const phoneInput = inputs[2];
        const serviceInput = inputs[3];
        const barberInput = inputs[4];
        const dateTimeInput = inputs[5];
        const termsInput = inputs[6];
    
        setNameInput(nameInput);
        setEmailInput(emailInput);
        setPhoneInput(phoneInput);
        await setServiceInput(serviceInput);
        await setBarberInput(barberInput);
        await setDateTimeInput(dateTimeInput, serviceInput, barberInput);
        setTermsInput(termsInput);
    }
}

function setNameInput(nameInput) {    
    if (nameInput) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor ingrese su nombre completo.';
        
        // Establecer un mensaje de validación por defecto
        nameInput.setCustomValidity(defaultValidationMessage);
        
        nameInput.addEventListener('input', () => {
            let value = nameInput.value;
            
            // Validar si el campo está vacío establecer el mensaje de validación por defecto
            if (value.length === 0) {
                nameInput.setCustomValidity(defaultValidationMessage);
            }
            // Validar si el campo contiene números
            else if (/\d/.test(value)) {
                nameInput.setCustomValidity('Este campo no permite números, por favor ingresélo correctamente.');
            }
            // Si no hay errores, limpiar cualquier mensaje de error previo
            else {
                nameInput.setCustomValidity('');
            }

            nameInput.value = capitalize(value);
        });
    }
}

function setEmailInput(emailInput) {
    if (emailInput) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor ingrese su correo electrónico.';

        // Establecer un mensaje de validación por defecto
        emailInput.setCustomValidity(defaultValidationMessage);
        
        emailInput.addEventListener('input', () => {
            const value = emailInput.value;

            // Validar si el campo está vacío establecer el mensaje de validación por defecto
            if (value.length === 0) {
                emailInput.setCustomValidity(defaultValidationMessage);
            }
            // Longitud mínima de 5 caracteres
            if (value.length < 5) {
                emailInput.setCustomValidity('El correo electrónico es demasiado corto.');
            } 
            // Debe incluir el simbolo '@'
            else if (!value.includes('@')) {
                emailInput.setCustomValidity('Al correo electrónico le falta el \'@\', por favor inclúyalo.');
            } 
            // Longitud máxima de 254 caracteres
            else if (value.length > 254) {
                emailInput.setCustomValidity('El correo electrónico es demasiado largo.');
            } 
            // Otras validaciones en la parte del dominio
            else {
                const [localPart, domainPart] = value.split('@');
                
                // Debe incluir un dominio luego del '@'
                if (!domainPart) {
                    emailInput.setCustomValidity('Al correo electrónico le falta el nombre del dominio luego del \'@\', por favor inclúyalo.');
                } 
                // El dominio debe incluir el simbolo '.'
                else if (!domainPart.includes('.')) {
                    emailInput.setCustomValidity('Al correo electrónico le falta el \'.\' luego del nombre del dominio, por favor inclúyalo.');
                }
                // otras validaciones en la parte del top level domain (TLD)
                else {
                    const [domainName, topLevelDomainName] = domainPart.split('.');
                    
                    // Debe tener un TLD
                    if (!topLevelDomainName) {
                        emailInput.setCustomValidity('Al correo electrónico le falta el nombre del TLD (Top Level Domain) luego del \'.\', por favor inclúyalo.');
                    } 
                    // Quita la alerta de validación
                    else {
                        emailInput.setCustomValidity('');
                    }   
                }
            }
        });
    }
}

function setPhoneInput(phoneInput) {
    if (phoneInput) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor ingrese su número telefónico de la Rep. Dom.';

        // Establecer un mensaje de validación por defecto
        phoneInput.setCustomValidity(defaultValidationMessage);
        
        // Arrow function para validar el número telefónico
        const validatePhoneNumber = (rawValue) => {
            const validPrefixes = ['809', '829', '849'];
            let value = rawValue.replace(/\D/g, '');

            // Validar si el campo está vacío establecer el mensaje de validación por defecto
            if (value.length === 0) {
                return defaultValidationMessage;
            }

            const prefix = value.substring(0, 3);
            if (!validPrefixes.includes(prefix)) {
                return 'El prefijo del número de teléfono debe ser 809, 829 u 849, por favor ingresélo correctamente.';
            }

            if (value.length !== 10) {
                return 'El número de teléfono debe tener exactamente 10 dígitos, por favor termine de ingresarlo.';
            }

            return ''; // Sin error
        };

        // Arrow function para formatear el número telefónico
        const formatPhoneNumber = (rawValue) => {
            let value = rawValue.replace(/\D/g, '').substring(0, 10);
            const cursorPosition = phoneInput.selectionStart;
            let formattedInput;
            
            // Iniciar el formateo del número con el prefijo
            formattedInput = '(' + value.substring(0, 3);
            if (value.length >= 4) {
                formattedInput += ') ' + value.substring(3, 6); // Formatear la siguiente sección
            }
            if (value.length >= 7) {
                formattedInput += '-' + value.substring(6, 10); // Formatear la última sección
            } 
            if (value.length == 0) {
                return value;
            }

            if (cursorPosition == 9) {
                if (formattedInput[9] == '-') {
                    formattedInput = formattedInput.substring(0, 9);
                }
                formattedInput = formattedInput.substring(0, 9);
            }
            
            if (cursorPosition == 6) {
                if (formattedInput[5] == ' ') {
                    formattedInput = formattedInput.substring(0, 4);
                }
                formattedInput = formattedInput.substring(0, 9);
            }

            return formattedInput;
        };

        phoneInput.addEventListener('input', () => {
            const cursorPosition = phoneInput.selectionStart;
            const previousLenght = phoneInput.value.length;

            let rawValue = phoneInput.value;
            let errorMessage = validatePhoneNumber(rawValue);
            phoneInput.setCustomValidity(errorMessage);

            phoneInput.value = formatPhoneNumber(rawValue);
            
            const newLenght = phoneInput.value.length;
            const lenghtDiff = newLenght - previousLenght;
            const newCursorPosition = cursorPosition + lenghtDiff;

            phoneInput.setSelectionRange(newCursorPosition, newCursorPosition);
        });
    }
}

async function setServiceInput(serviceInput) {
    const services = await fetchActiveServices();
    const datalist = document.getElementById('datalist-service');
    datalist.innerHTML = '';

    // Puebla el datalist con los servicios del back-end
    if (services) {
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.name;
            datalist.appendChild(option);
        });
    }

    // Validar el input para permitir solo valores del datalist
    if (serviceInput && datalist) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor seleccione el servicio que desea.';

        // Establecer un mensaje de validación por defecto
        serviceInput.setCustomValidity(defaultValidationMessage);
        
        serviceInput.addEventListener('input', () => {
            const value = serviceInput.value;
            const options = Array.from(datalist.options).map(option => option.value);

            // Validar si el campo está vacío establecer el mensaje de validación por defecto
            if (value.length === 0) {
                serviceInput.setCustomValidity(defaultValidationMessage);
            } else if (!options.includes(value)) {
                serviceInput.setCustomValidity('El nombre del servicio debe ser idéntico que en la lista, le recomendamos elegirlo directamente.');
            } else {
                serviceInput.setCustomValidity('');
            }
        });
    }
}

async function setDateTimeInput(dateTimeInput, serviceInput, barberInput) {
    if (dateTimeInput) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor ingrese la fecha y hora que desea realizar la cita.';
        const svg = document.querySelector('#date-container svg');
        let calendarIsShowing = false;

        const fp = flatpickr(dateTimeInput, {
            clickOpens: false,
            enableTime: true,
            dateFormat: "d/m/Y H:i",
            minDate: "today", // No permitir fechas en el pasado
            allowInput: true,
            disable: [
                function (date) {
                    // Desactivar domingos
                    return (date.getDay() === 0);
                }
            ],
            locale: {
                firstDayOfWeek: 0 // Comenzar la semana el domingo
            },
            onOpen: function() {
                calendarIsShowing = true;
            },
            onClose: function() {
                calendarIsShowing = false;
            }
        });

        svg.addEventListener('click', () => {
            if (!calendarIsShowing) {
                fp.open();
            }
        });

        // Establecer un mensaje de validación por defecto
        dateTimeInput.setCustomValidity(defaultValidationMessage);

        dateTimeInput.addEventListener('input', async (event) => {
            const value = dateTimeInput.value;

            try {
                if (value.length === 16) {
                    await validateAvailability(value);
                } else if (value.length > 16) {
                    dateTimeInput.setCustomValidity('La longitud del formato de la fecha debe ser de 16 caracteres. d/m/Y');
                } else {
                    dateTimeInput.setCustomValidity(defaultValidationMessage);
                }
            } catch (error) {
                console.log('Error en el event listener: ', error);
                dateTimeInput.setCustomValidity('Formato de fecha y hora no válido.');
            }
        });

        async function validateAvailability(dateStr) {
            if (serviceInput && barberInput) {
                const activeServices = await fetchActiveServices();
                const activeBarbers = await fetchActiveBarbers();
                
                const serviceValue = serviceInput.value;
                const barberValue = barberInput.value;
                
                if (serviceValue.length !== 0) {
                    const activeService = activeServices.find(service => service.name === serviceValue);
                    const activeBarber = activeBarbers.find(barber => barber.name === barberValue);

                    if (activeService) {
                        let barberId = null;
                        if (activeBarber){
                            barberId = activeBarber.id;
                        }

                        const reservationDateTime = parseDateStr(dateStr, activeService.estimatedTime);
                        const start = reservationDateTime.start;
                        const end = reservationDateTime.end;
                        
                        const json = await reservationIsAvailable(barberId, start, end);
                        barberId = json.barberId;

                        if (!json.isAvailable) {
                            dateTimeInput.setCustomValidity('Este horario no está disponible. Por favor, seleccione otro.');
                        } else {
                            dateTimeInput.setCustomValidity('');
                        }
                    }
                }
                
            }
        }

        async function reservationIsAvailable(barberId, startDatetime, endDatetime) {
            if (!startDatetime || !endDatetime) {
                console.log('Los parámetros de inicio y fin de la reserva no pueden ser nulos.');
                return false;
            }

            try {
                const queryParams = new URLSearchParams({
                    barberId: barberId,
                    start: startDatetime,
                    end: endDatetime
                });

                const response = await fetch(`http://localhost:8080/reservation/isAvailable?${queryParams.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error: la respuesta del servidor no fue ok');
                }

                return await response.json();
            } catch (error) {
                console.log('Error al validar la disponibilidad de la reserva desde el backend:', error);
                return false;
            }
        }

        function parseDateStr(dateStr, durationMinutes) {
            const dateTimeParts = dateStr.split(' ');
            const date = dateTimeParts[0];
            const time = dateTimeParts[1];

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
    }
}

async function setBarberInput(barberInput) {
    const barbers = await fetchActiveBarbers();
    const datalist = document.getElementById('datalist-barber');
    datalist.innerHTML = '';

    if (barbers && datalist) {
        barbers.forEach(barber => {
            const option = document.createElement('option');
            option.value = barber.name;
            datalist.appendChild(option);
        });
        
        if (barberInput) {
            // Validar el input para permitir solo valores del datalist
            barberInput.addEventListener('input', () => {
                const options = Array.from(datalist.options).map(option => option.value);
                const value = barberInput.value;

                // Validar si el campo está vacío establecer el mensaje de validación por defecto
                if (value.length > 0 && !options.includes(value)) {
                    barberInput.setCustomValidity('El nombre del barbero debe ser idéntico que en la lista, le recomendamos elegirlo directamente.');
                } else {
                    barberInput.setCustomValidity('');
                }
            });
        }
    }
}

function setTermsInput(termsInput) {
    if (termsInput) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor acepte los términos y condiciones antes de continuar.';
        
        // Establecer un mensaje de validación por defecto
        termsInput.setCustomValidity(defaultValidationMessage);
        
        termsInput.addEventListener('input', () => {            
            // Validar si el campo está vacío establecer el mensaje de validación por defecto
            if (!termsInput.checked) {
                termsInput.setCustomValidity(defaultValidationMessage);
            } else {
                termsInput.setCustomValidity('');
            }
        });
    }
}