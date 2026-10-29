//docs/js/models/Usuario.model.js
export default class Usuario {
    //usando la desestructuración de objetos,
    constructor({ id, nombre, apellido, usuario}) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.usuario = usuario;
    }

}