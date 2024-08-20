import { parseJwt } from "./utils.js";

// Maneja el inicio de sesión
export async function handleLogin(login, password) {
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('JWT', data.JWTToken);
            
            const paylout = parseJwt(data.JWTToken);

            // Redirecciona después de 1 segundo
            setTimeout(() => {
                if(paylout.isActive){
                    if (paylout.role === "ROLE_USER") {
                        window.location.href = 'index.html';
                    } else if(paylout.role === "ROLE_ADMIN") {
                        window.location.href = 'userpage/users.html';
                    } else if(paylout.role === "ROLE_BARBER") {
                        window.location.href = 'userpage/reservations.html';
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso Denegado',
                        text: 'No tienes los permisos necesarios para iniciar sesión.',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        localStorage.removeItem('JWT');
                        window.location.href = 'login.html';
                    });
                }
            }, 1000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'El inicio de sesión falló. Revisa que los datos ingresados sean correctos.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                localStorage.removeItem('JWT');
                window.location.href = 'login.html';
            });

            console.error('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
                            
// Maneja el registro de nuevos usuarios
export async function handleSignup(userName, email, password) {
    try {
        const response = await fetch('http://localhost:8080/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, email, password })
        });

        // Verificar si la respuesta no es exitosa        
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Cuenta creada',
                text: 'Su nueva cuenta se ha creado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(async () => {
                await handleLogin(email, password);  // Inicia sesión automáticamente tras registrarse
            });;
        } else {
            const errorMessage = await response.text();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage || 'Hubo un problema al tratar de registrar su cuenta.'
            });
            
            throw new Error(errorMessage || 'Error al tratar de registrar la nueva cuenta del usuario.');
        }
            
        
    } catch (error) {
        console.error('Error al guardar la reserva:', error.message);
    }
}

// Maneja el cierre de sesión
export function setSignoutButton(signoutBtn) {
    signoutBtn.addEventListener('click', () => {
        Swal.fire({
            title: '¿Estás seguro de que deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Lógica para cerrar sesión
                console.log("Sesión cerrada");
                localStorage.removeItem('JWT');
                window.location.href = '../index.html';
            } else {
                console.log("Cierre de sesión cancelado");
            }
        });
    });
}
