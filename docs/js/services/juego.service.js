// Reglas de negocio y lógica de autenticación (Login) y logica para el minijuego PAREJAS TIC
import Tarjeta from '../models/Tarjeta.model.js';

// Comprueba que la contraseña solo tenga letras y números (sin espacios ni símbolos)
export function esPasswordAlfanumerica(password) {
    
    const patronAlfanumerico = /^[a-zA-Z0-9]+$/;
   // metodo RegExp.test 
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


/** 
* Generación de la baraja y algoritmo de barajado (Fisher-Yates)
* Prepara la baraja duplicando las cartas para crear parejas  y las mezcla aleatoriamente antes de inyectarlas al tablero.
*/
export function crearBaraja(simbolos, nivel, aleatorio = Math.random) {
    const configuracion = NIVELES[nivel];

    // Control de errores en caso de nivel inválido
    if (!configuracion) {
        throw new RangeError(`Nivel desconocido: ${nivel}`);
    }

    // Calculamos cuántas parejas distintas se necesitan según el nivel
    const totalParejas = configuracion.cartas / 2;

    // Recortamos el catálogo y creamos dos copias físicas de cada carta, 'html-a' y 'html-b'
    const baraja = simbolos.slice(0, totalParejas).flatMap((simbolo) => [
        new Tarjeta(simbolo, 'a'), 
        new Tarjeta(simbolo, 'b')  
    ]);

    // Algoritmo Fisher-Yates, Recorre la baraja de atrás hacia adelante intercambiando posiciones
    for (let i = baraja.length - 1; i > 0; i -= 1) {
        // Calculamos un índice aleatorio entre 0 y la posición actual 'i'
        const j = Math.floor(aleatorio() * (i + 1));

        // Intercambiamos los elementos usando desestructuración
        [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
    }

    return baraja;
}

// Reglas de juego, aciertos y puntuación

// Comprueba si dos cartas seleccionadas coinciden
export function sonPareja(primerSimbolo, segundoSimbolo) {
    return primerSimbolo === segundoSimbolo;
}

// Suma 100 puntos fijos por cada acierto
export function sumarPuntosPareja(puntuacionActual) {
    return puntuacionActual + 100;
}

// Penaliza con 50 puntos el uso de la pista por teclado
export function aplicarPenalizacionPista(puntuacionActual) {
  // Usamos Math.max para garantizar que el marcador nunca baje de 0
    return Math.max(0, puntuacionActual - 50);
}