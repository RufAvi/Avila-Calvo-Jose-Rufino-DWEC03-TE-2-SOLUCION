// Reglas de negocio y lógica de autenticación (Login)

// Comprueba que la contraseña solo tenga letras y números (sin espacios ni símbolos)
export function esPasswordAlfanumerica(password) {
    
    const patronAlfanumerico = /^[a-zA-Z0-9]+$/;
    return patronAlfanumerico.test(password);
}

// Busca en el array si el usuario y la contraseña coinciden con alguien registrado
export function autenticarUsuario(usuarios, username, password) {

    const usuarioEncontrado = usuarios.find(
    (u) => u.usuario === username && u.contraseña === password
    );

    // Si lo encuentra devuelve el objeto del usuario, si no, null
    return usuarioEncontrado ?? null;
}

//Configuración de niveles
export const NIVELES = Object.freeze({

    principiante: Object.freeze({ cartas: 6, columnas: 3 }), //Matriz 2x3 ( 3 parejas)
    intermedio: Object.freeze({ cartas: 12, columnas: 4}),
    avanzado: Object.freeze({ cartas: 16, columnas: 4 }) //Matriz 4x4 (8 parejas) 
}) ;