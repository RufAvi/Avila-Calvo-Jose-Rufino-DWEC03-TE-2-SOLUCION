/**
 * Controlador del Tablero de Juego
 * Carga el estado de la partida, baraja las cartas e inyecta el HTML dinámico.
 */

import { crearBaraja } from './services/juego.service.js';
import { jsonTarjetas } from './data/tarjetas.js';
import { STORAGE_KEYS, leerJSON } from './services/storage.service.js';

const nombresNivel = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
};

// Control de seguridad recuperar estado de la partida
const estado = leerJSON(sessionStorage, STORAGE_KEYS.game);

// Si entran sin configurar nivel, de vuelta a bienvenida
if (!estado || !nombresNivel[estado.level]) {
    window.location.replace('bienvenida.html');
}

// Generador del HTML de las cartas
function crearElementoCarta(carta, indice) {
    // Pinta el número con dos cifras (01, 02...)
    const numeroOrden = String(indice + 1).padStart(2, '0');

    // Estructura 3D de la carta (reverso + anverso)
    const plantillaHTML = `
        <button
        class="carta"
        type="button"
        data-card-id="${carta.cardId}"
        data-symbol="${carta.id}"
        aria-label="Carta ${indice + 1} tapada"
        >
        <span class="interior-carta">
            <!-- Reverso (Boca abajo) -->
            <span class="cara-carta reverso-carta">
            <span class="numero-carta">#${numeroOrden}</span>
            <span class="icono-carta" aria-hidden="true">?</span>
            <span class="estado-carta">Tapada</span>
            <span class="marca-carta" hidden>❓ Duda</span>
            </span>
            <!-- Anverso (Boca arriba) -->
            <span class="cara-carta anverso-carta">
            <span class="numero-carta">#${numeroOrden}</span>
            <span class="icono-carta" aria-hidden="true">${carta.icono}</span>
            <span class="nombre-carta">${carta.nombre}</span>
            </span>
        </span>
        </button>
    `;

    // Devolvemos el string convertido en objeto jQuery para inyectarlo luego
    return $(plantillaHTML);
}

// 3. Inicialización del tablero principal
$(function () {
    const $tablero = $('#tablero');
    const $etiquetaNivel = $('#insignia-nivel');
    const $visorTiempo = $('#temporizador');
    const $visorParejas = $('#parejas');
    const $visorPuntos = $('#puntuacion');

    // Actualizamos el HUD superior con los datos de la sesión
    $etiquetaNivel.text(`Nivel: ${nombresNivel[estado.level]}`);
    $visorTiempo.text(String(estado.timeLimit));
    $visorParejas.text(`${estado.pairsFound} / ${estado.totalPairs}`);
    $visorPuntos.text(`${estado.score} pts`);

    // Pasamos el número de columnas (3 o 4) a la variable CSS Grid
    $tablero.css('--columns', estado.columns);

    // Generamos la baraja desordenada (Fisher-Yates)
    const baraja = crearBaraja(jsonTarjetas, estado.level);

    // Inyectamos las cartas en el DOM una a una
    baraja.forEach((carta, indice) => {
        $tablero.append(crearElementoCarta(carta, indice));
    });

    // 4. Temporizador regresivo (30 segundos)
    const momentoInicio = Date.now();
    let tiempoRestante = estado.timeLimit;

    const intervaloTemporizador = window.setInterval(function () {
        // Usamos Date.now() en lugar de restar 1 para evitar desajustes si el navegador suspende la pestaña
        const segundosTranscurridos = Math.floor((Date.now() - momentoInicio) / 1000);
        tiempoRestante = Math.max(0, estado.timeLimit - segundosTranscurridos);

        $visorTiempo.text(String(tiempoRestante));

        // Efecto visual de urgencia cuando quedan 10 segundos o menos
        $visorTiempo.closest('.caja-temporizador').toggleClass('tiempo-urgente', tiempoRestante <= 10);

        // Condición de derrota por tiempo agotado
        if (tiempoRestante === 0) {
            clearInterval(intervaloTemporizador);

            // Guardamos la derrota en la sesión y redirigimos
            estado.outcome = 'timeout';
            estado.timeSpent = estado.timeLimit;
            guardarJSON(sessionStorage, STORAGE_KEYS.game, estado);
            
            window.location.href = 'resultado.html';
        }
    }, 1000);


});

