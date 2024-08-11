import { fetchServices } from "./services.js";
import { fetchActiveBarbers } from "./barbers.js";
import { capitalize } from "../utils.js";

const inputs = document.querySelectorAll('#reservation-content form input:not(input.iti__search-input)');

export async function setDatalistsOnReservation() {
    // setSample();
    if (inputs) {
        const nameInput = inputs[0];
        const emailInput = inputs[1];
        const phoneInput = inputs[2];
        const serviceInput = inputs[3];
        const dateTimeInput = inputs[4];
    
        // setNameInput(nameInput);
        // setEmailInput(emailInput);
        // setPhoneInput(phoneInput);
        // await setServiceInput(serviceInput);
        setDateTimeInput(dateTimeInput);
    }
    await setBarbersOnReservation();
}

function setSample() {
    if (inputs) {
        // const nameInput = inputs[0];
        // const emailInput = inputs[1];
        // const phoneInput = inputs[2];
        // const serviceInput = inputs[3];
        // const dateInput = inputs[4];
        // const barberInput = inputs[5];
        // const termsInput = inputs[6];
        
        // console.log("nameInput: ", nameInput);
        // console.log("emailInput: ", emailInput);
        // console.log("phoneInput: ", phoneInput);
        // console.log("serviceInput: ", serviceInput);
        // console.log("dateInput: ", dateInput);
        // console.log("barberInput: ", barberInput);
        // console.log("termsInput: ", termsInput);

        

// form input:not([type="checkbox"]):invalid {
//     border-color: darkred;
// }

// form input:not([type="checkbox"]):valid {
//     border-color: transparent;
// }

        inputs.forEach(input => {
            input.setCustomValidity('Este campo es obligatorio, por favor seleccione un servicio.');
            input.addEventListener('input', () => {
                if (!input.validity.valueMissing) {
                    input.setCustomValidity('');
                }
            });
        });
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
    const services = await fetchServices();
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

// TODO ADEMAS DE VALIDAR SE DEBE DE JUGAR CON EL COLOR DEL TEXTO, YA QUE SI EL INPUT ES INVALIDO TOMARA UN COLOR QUE ES PARA LOS PLACEHOLDER
function setDateTimeInput(dateTimeInput) {
    console.log(dateTimeInput)
    if (dateTimeInput) {
        const defaultValidationMessage = 'Este campo es obligatorio, por favor ingrese la fecha y hora que desea realizar la cita.';

        // Establecer un mensaje de validación por defecto
        dateTimeInput.setCustomValidity(defaultValidationMessage);
        
        const svg = document.querySelector('#date-container svg');

        const fp = flatpickr(dateTimeInput, {
            clickOpens: false,
            enableTime: true,
            dateFormat: "d/m/Y H:i",
            minDate: "today", // No permitir fechas en el pasado
            allowInput: true,
            "disable": [
                function (date) {
                    // Desactivar domingos
                    return (date.getDay() === 0);
                },
                function (date) {
                    return (date.getDay() === 6 && (date.getHours() < 10 && date.getHours() > 17));
                }
            ],
            "locale": {
                "firstDayOfWeek": 0 // Comenzar la semana el domingo
            },
            "onChange": function(selectedDates, dateStr, instance) {
                const selectedDate = new Date(selectedDates[0]);
                validateDate(selectedDate);
            },
            "onClose": function(selectedDates, dateStr, instance) {
                const selectedDate = new Date(selectedDates[0]);
                validateDate(selectedDate);
            }
        });

        function validateDate(selectedDate) {
            if (selectedDate) {
                const hour = selectedDate.getHours();
                const day = selectedDate.getDay();
                let hasError = false;

                // No se  trabaja los domingos
                if (day === 0) {
                    dateTimeInput.setCustomValidity('La barbería no labora los domingos.');
                    hasError = true;
                }
                
                // No trabajar fuera del horario de 10:00 AM - 5:00 PM los sábados
                if (day === 6) {
                    if (hour < 10 || hour > 17) {
                        dateTimeInput.setCustomValidity('Los sábados no se aceptan citas para antes de las 10:00 A.M. Por favor, seleccione otro horario.');
                        hasError = true;
                    } else if (hour > 17) {
                        dateTimeInput.setCustomValidity('Los sábados no se aceptan citas para después de las 5:00 P.M. Por favor, seleccione otro horario.');
                        hasError = true;
                    }
                }
                
                // No trabajar fuera del horario de 9:00 AM - 7:00 PM los dias de semana
                if (day !== 0 && day !== 6) {
                    if (hour < 9 || hour > 19) {
                        dateTimeInput.setCustomValidity('Los días de semana no se aceptan citas para antes de las 9:00 A.M. Por favor, seleccione otro horario.');
                        hasError = true;
                    } else if (hour > 19) {
                        dateTimeInput.setCustomValidity('Los días de semana no se aceptan citas para después de las 7:00 P.M. Por favor, seleccione otro horario.');
                        hasError = true;
                    }
                }
                
                // Verificar solapamientos (simulación de verificación)
                if (checkForOverlap(selectedDate)) {
                    dateTimeInput.setCustomValidity('Este horario no está disponible. Por favor, seleccione otro.');
                    hasError = true;
                }

                if (!hasError) {
                    dateTimeInput.setCustomValidity('');
                }
            }
        }

        // Función para verificar solapamientos (simulación)
        function checkForOverlap(selectedDate) {
            // Simular una reserva ya existente
            const existingReservation = new Date('2024-08-21T14:00:00');
    
            // Compara las horas de las reservas
            return selectedDate.getTime() === existingReservation.getTime();
        }
        
        let isShowing = false;
        svg.addEventListener('click', () => {
            if (!isShowing) {
                fp.open();
                isShowing = true;
            } else {
                fp.close();
                isShowing = false;
            }
        });

        dateTimeInput.addEventListener('click', () => {fp.close();})
    }
}
async function setBarbersOnReservation() {
    const barbers = await fetchActiveBarbers();
    const datalist = document.getElementById('select-barber');
    datalist.innerHTML = '';

    barbers.forEach(barber => {
        const option = document.createElement('option');
        option.value = barber.name;
        datalist.appendChild(option);
    });

    
    // Validar el input para permitir solo valores del datalist
    const input = document.getElementById('dropdown-barber');
    input.addEventListener('input', () => {
        const options = Array.from(datalist.options).map(option => option.value);
        if (!options.includes(input.value)) {
            input.setCustomValidity('Por favor, seleccione un barbero válido.');
        } else {
            input.setCustomValidity('');
        }
    });
}
