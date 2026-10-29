export default class Tarjeta {
    //usando la desestructuración de objetos,
    constructor({id, nombre, icono}, copy ){
        this.id = id;
        this.nombre = nombre;
        this.incono = icono;
        this.cardId = `${id}-${copy}`;
    }
}