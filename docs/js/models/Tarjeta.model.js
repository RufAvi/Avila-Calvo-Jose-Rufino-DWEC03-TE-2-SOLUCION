export default class Tarjeta {
    //usando la desestructuración de objetos,
    constructor({id, nombre, icono}, copy ){
        this.id = id;
        this.nombre = nombre;
        this.icono = icono;
        this.cardId = `${id}-${copy}`;
    }
}