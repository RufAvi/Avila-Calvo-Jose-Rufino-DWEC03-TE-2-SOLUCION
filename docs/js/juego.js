/**
 * Controlador del Tablero de Juego
 * Carga el estado de la partida, baraja las cartas e inyecta el HTML dinámico.
 */

import {
    crearBaraja,
    sonPareja,
    sumarPuntosPareja,
    aplicarPenalizacionPista
} from './services/juego.service.js';
import { jsonTarjetas } from './data/tarjetas.js';
import { STORAGE_KEYS, leerJSON, guardarJSON } from './services/storage.service.js';

const nombresNivel = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
};




// Generador del HTML de las cartas
function crearElementoCarta(carta, indice) {
    // Pinta el número con dos cifras (01, 02...)
    const numeroOrden = String(indice + 1).padStart(2, '0');

    // Estructura 3D de la carta (reverso + anverso)
    const plantillaHTML = `
        <button
        class="carta"
        type="button"
        data-symbol="${carta.id}"
        aria-label="Carta ${indice + 1} tapada"
        >
        <div class="interior-carta">
        
            <!-- Cara A: Reverso (Boca abajo / Cubierta con interrogante) -->
            <div class="cara-carta reverso-carta">
                <span class="numero-carta">#${numeroOrden}</span>
                <span class="icono-carta" aria-hidden="true">?</span>
                <span class="estado-carta">Tapada</span>
                <span class="marca-carta" hidden>❓Duda</span>
            </div>
            <!-- Cara B: Anverso (Boca arriba / Descubierta con el icono tecnológico) -->
            <div class="cara-carta anverso-carta">
                <span class="numero-carta">#${numeroOrden}</span>
                <span class="icono-carta" aria-hidden="true">${carta.icono}</span>
                <span class="nombre-carta">${carta.nombre}</span>
                <span class="estado-carta">Revelada</span>
            </div>
        </div>
        </button>
    `;

    // Devolvemos el string convertido en objeto jQuery para inyectarlo luego
    return $(plantillaHTML);
}

// Inicialización del tablero principal
$(function () {

    // Control de seguridad recuperar estado de la partida
    const estado = leerJSON(sessionStorage, STORAGE_KEYS.game);

    // Si entran sin configurar nivel, de vuelta a bienvenida
    if (!estado || !nombresNivel[estado.level]) {
        window.location.replace('bienvenida.html');
        return;
    }
    
    const $tablero = $('#tablero');
    const $etiquetaNivel = $('#insignia-nivel');
    const $visorTiempo = $('#temporizador');
    const $visorParejas = $('#parejas');
    const $visorPuntos = $('#puntuacion');

    // Garantizamos coherencia si el usuario recarga la página: se reinicia con la nueva baraja
    estado.score = 0;
    estado.pairsFound = 0;
    guardarJSON(sessionStorage, STORAGE_KEYS.game, estado);

    // Actualizamos el HUD superior con los datos de la sesión
    $etiquetaNivel.text(`Nivel: ${nombresNivel[estado.level]}`);
    $visorTiempo.text(String(estado.timeLimit));
    $visorParejas.text(`0 / ${estado.totalPairs}`);
    $visorPuntos.text(`0 pts`);

    // Pasamos el número de columnas (3 o 4) al tablero
    $tablero.css('--columns', estado.columns);

    // Generamos la baraja desordenada (Fisher-Yates)
    const baraja = crearBaraja(jsonTarjetas, estado.level);

    // Inyectamos las cartas en el DOM una a una
    baraja.forEach((carta, indice) => {
        $tablero.append(crearElementoCarta(carta, indice));
    });

    // Temporizador regresivo (30 segundos)
    const momentoInicio = Date.now();
    let tiempoRestante = estado.timeLimit;
    
    //VAriables de control de estado del juego para eventos
    let primeraCarta = null;         // Guarda la primera carta volteada de la pareja
    let tableroBloqueado = false;     // Bloquea nuevos clics mientras se comparan cartas
    let temporizadorPista = null;     // Referencia del temporizador del comodín de pista

    // Función para guardar el estado actual de la partida en sessionStorage
    function guardarEstadoPartida() {
        guardarJSON(sessionStorage, STORAGE_KEYS.game, estado);
    }

    // Función para terminar la partida (victoria o tiempo agotado) y redirigir
    function finalizarPartida(resultado) {
        clearInterval(intervaloTemporizador);
        if (temporizadorPista) clearTimeout(temporizadorPista);

        estado.outcome = resultado;  // 'won' (victoria) o 'timeout' (derrota)
        estado.elapsed = estado.timeLimit - tiempoRestante;
        guardarJSON(sessionStorage, STORAGE_KEYS.game, estado);

        window.location.href = 'resultado.html';
    }

     // Intervalo que se ejecuta de forma síncrona cada 1000 ms (1 segundo)
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
            estado.elapsed = estado.timeLimit;
            guardarJSON(sessionStorage, STORAGE_KEYS.game, estado);
            
            window.location.href = 'resultado.html';
        }
    }, 1000);

    /**
    * EVENTOS DEL JUEGO
    */

    // 1. Mouseover / Mouseout: Efecto visual al enfocar una carta
    $tablero.on('mouseover', '.carta', function () {
        $(this).addClass('enfocada');
    });

    $tablero.on('mouseout', '.carta', function (evento) {
        // Evita el parpadeo (flickering) si el ratón se mueve por los elementos hijos de la carta
        if (!this.contains(evento.relatedTarget)) {
            $(this).removeClass('enfocada');
        }
    });

    // 2. Doble clic: Voltea la carta y comprueba si hay pareja
    $tablero.on('dblclick', '.carta', function () {
        const $cartaActual = $(this);
        const elementoCarta = this;

        // Bloqueos de seguridad
        if (
            tableroBloqueado ||
            temporizadorPista ||
            $cartaActual.hasClass('girada') ||
            $cartaActual.hasClass('emparejada')
        ) {
            return;
        }   

        $cartaActual.addClass('girada');

        if (!primeraCarta) {
            primeraCarta = elementoCarta;
            return;
        }

        // Segunda carta levantada: bloqueamos tablero y comparamos
        const segundaCarta = elementoCarta;
        tableroBloqueado = true;

        const simbolo1 = primeraCarta.dataset.symbol;
        const simbolo2 = segundaCarta.dataset.symbol;

        if (sonPareja(simbolo1, simbolo2)) {
            // ¡ACIERTO!
            $(primeraCarta).removeClass('girada').addClass('emparejada');
            $(segundaCarta).removeClass('girada').addClass('emparejada');

            $(primeraCarta).find('.estado-carta').text('Emparejada');
            $(segundaCarta).find('.estado-carta').text('Emparejada');

            estado.pairsFound += 1;
            estado.score = sumarPuntosPareja(estado.score);

            $visorParejas.text(`${estado.pairsFound} / ${estado.totalPairs}`);
            $visorPuntos.text(`${estado.score} pts`);

            primeraCarta = null;
            tableroBloqueado = false;
            guardarEstadoPartida();

            // Condición de victoria
            if (estado.pairsFound === estado.totalPairs) {
                finalizarPartida('won');
            }
        } else {
            // ¡FALLO! Mantenemos las cartas a la vista casi un segundo
            setTimeout(function () {
                $(primeraCarta).removeClass('girada');
                $(segundaCarta).removeClass('girada');

                primeraCarta = null;
                tableroBloqueado = false;
            }, 850);
        }
    });

    // Soporte de teclado: Enter para voltear la carta enfocada
    $tablero.on('keydown', '.carta', function (evento) {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            $(this).trigger('dblclick');
        }
    });

    // Clic derecho, Marca la carta de duda
    $tablero.on('contextmenu', '.carta', function (evento) {
        evento.preventDefault(); // Evitamos que salga el menú del navegador SIEMPRE
        const $carta = $(this);

        if ($carta.hasClass('emparejada')) return;

        $carta.toggleClass('marcada');
        const estaMarcada = $carta.hasClass('marcada');

        const $marcaTexto = $carta.find('.marca-carta');
        if (estaMarcada) {
            $marcaTexto.removeAttr('hidden').text('❓ Duda');
        } else {
            $marcaTexto.attr('hidden', true).text('');
        }
    });

    // Barra espaciadora,  Comodín (penaliza puntos, levanta todo 1s)
    $(document).on('keydown', function (evento) {
        if (evento.code !== 'Space' || evento.originalEvent.repeat) return;

        evento.preventDefault(); // Evitamos que la página haga scroll hacia abajo

        if (tableroBloqueado || temporizadorPista || tiempoRestante <= 0) return;

        estado.score = aplicarPenalizacionPista(estado.score);
        $visorPuntos.text(`${estado.score} pts`);

        const $cartasNoEmparejadas = $tablero.find('.carta:not(.emparejada)');
        $cartasNoEmparejadas.addClass('en-pista');

        temporizadorPista = setTimeout(function () {
            $cartasNoEmparejadas.each(function () {
                const elemento = this;
                $(elemento).removeClass('en-pista');

                if (elemento !== primeraCarta) {
                    $(elemento).removeClass('girada');
                }
                });

            temporizadorPista = null;
            guardarEstadoPartida();
        }, 1000);

        guardarEstadoPartida();
    });

});

