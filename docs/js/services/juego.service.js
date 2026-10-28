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