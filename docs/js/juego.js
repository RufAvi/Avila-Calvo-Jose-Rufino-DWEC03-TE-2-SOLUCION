// Reglas de negocio y lógica de autentificación

export function esPasswordAlfanumerica(password){
    // ^ indica inicio de cadena, [a-zA-Z0-9]+ permite 1 o más caracteres alfanuméricos, $ indica fin de cadena
    const patronAlfanumerico = /^[a-zA-Z0-9]+$/;

    // Devuelve true solo si todo el texto encaja exactamente con el patrón 
    // metodo RegExp.test 
    return patronAlfanumerico.test(password);
}


export function autenticarUsuario(usuarios, username, password) {
    // Recorre el array buscando coincidencia exacta de usuario y contraseña
    const usuarioEncontrado = usuarios.find((u) => {
        return u.usuario === username && u.contraseña === password;
    });

    // Si lo encuentra devuelve el usuario; si find devuelve undefined, retornamos null
    return usuarioEncontrado ?? null;
}