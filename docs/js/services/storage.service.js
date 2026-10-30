/**
 * Servicio de almacenamiento para Web Storage 
 * proporciona métodos de utilidad para serializar y parear objetos JSON
 */
//Objeto congelado que almacena las claves fijas para evitar errores tipográficos
export const STORAGE_KEYS = Object.freeze({
    users: 'parejasTIC.usuarios' ,//clave para guardar el catálogo en lcal Storage
    activeUser: 'parejasTIC.usuarioActivo',
    game: 'parejasTIC.partida'
});


//lee un valor de storage y lo convierte de texto JSON A objeto JavaScript
export function leerJSON ( storage, key) {
    //Recuperamos el texto plano almacenado en la memorio del navegador
    const valorTexto = storage.getItem(key);

    //Si no exite devuelve null
    if( valorTexto === null){
        return null;
    }

    //Convierte el string con formato JSON a un bjeteo/array real de javascript
    return JSON.parse(valorTexto);
}

//Convierte un ogjeto o dato de javaScript  a texto JOSN y lo guarda en storage
export function guardarJSON(storage, key, value){
    //JSON.stringify convierte el objeto Javascript en texto plano
    const textoParaGuardar = JSON.stringify(value);

    //Guarda el texto plano en el storage seleccionado
    storage.setItem(key, textoParaGuardar);
} 

//Elimina una clave concreta y sus datos asociados de storage
export function eliminarDeStorage(storage, key){
    //Ejecuta la función nativa del navegador removeItem para limpiar la clave
    storage.removeItem(key);
}