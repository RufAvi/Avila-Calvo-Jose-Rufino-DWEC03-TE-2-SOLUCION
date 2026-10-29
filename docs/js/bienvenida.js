// Controlador de la Pantalla de Bienvenida (Selección de dificultad)

import { NIVELES } from './services/juego.service.js';
import { STORAGE_KEYS, guardarJSON, leerJSON } from './services/storage.service.js';

// Funcion pricipal ejecuta la carga
$(function () {

    // Seguridad, si intentan entrar directamente a esta URL sin loguearse, al index
    const usuarioActivo = leerJSON(sessionStorage, STORAGE_KEYS.activeUser);
    if (!usuarioActivo) {
        window.location.href = 'index.html';
        return;
    }

    const $formularioNivel = $('#formulario-nivel');
    const $mensajeAviso = $('#mensaje-bienvenida');

    $formularioNivel.on('submit', function (evento) {
        evento.preventDefault();

        // Recogemos el valor del radio button que esté marcado
        const nivelSeleccionado = $formularioNivel.find('input[name="level"]:checked').val();
        const configuracion = NIVELES[nivelSeleccionado];

        // Control de errores por si manipulan el HTML y envían sin selección válida
        if (!configuracion) {
            $mensajeAviso
            .text('Por favor, selecciona un nivel de dificultad válido.')
            .removeAttr('hidden');
            return;
        }

        // Preparamos el objeto con el estado inicial de la partida
        const estadoPartida = {
            level: nivelSeleccionado,
            totalCards: configuracion.cartas,
            totalPairs: configuracion.cartas / 2, 
            columns: configuracion.columnas,
            score: 0,
            pairsFound: 0,
            timeLimit: 30 // Tiempo base del contador en segundos
        };

        // Guardamos la configuración en la sesión y lanzamos el juego
        guardarJSON(sessionStorage, STORAGE_KEYS.game, estadoPartida);
        window.location.href = 'juego.html';
    });
});