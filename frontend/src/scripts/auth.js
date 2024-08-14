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
                if (paylout.role === "ROLE_USER") {
                    window.location.href = 'index.html';
                } else if(paylout.role === "ROLE_ADMIN") {
                    window.location.href = 'userpage.html';
                } else if(paylout.role === "ROLE_BARBER") {
                    window.location.href = 'userpage.html';
                }
            }, 1000);
        } else {
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

        if (response.ok) {
            await handleLogin(email, password);  // Inicia sesión automáticamente tras registrarse
        } else {
            console.error('Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Maneja el cierre de sesión
export function setSignoutButtons(signoutBtn) {
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
                window.location.href = 'index.html';
            } else {
                console.log("Cierre de sesión cancelado");
            }
        });
    });
}
