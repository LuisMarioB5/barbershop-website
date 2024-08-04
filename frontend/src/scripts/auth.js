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
                if(paylout.role === "ROLE_USER") {
                    alert("Usuario ROLE_USER")
                } else if(paylout.role === "ROLE_ADMIN") {
                    alert("Usuario ROLE_ADMIN")
                } else if(paylout.role === "ROLE_BARBER") {
                    alert("Usuario ROLE_BARBER")
                } else {
                    alert("Usuario Invitado")
                }
                window.location.href = 'index.html';
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
export function handleLogout() {
    alert("Esta cerrando sesión...")
    localStorage.removeItem('JWT');
}
