import { STORAGE_KEYS, leerJSON, eliminarDeStorage } from './services/storage.service.js';

// Asigna la instancia global de jQuery cargada en el <head>
const $ = window.jQuery;
let estado;

// Carga inicial, Recuperamos la partida finalizada de la sesión
try {
    estado = leerJSON(sessionStorage, STORAGE_KEYS.game);
    
    } catch {

        estado = null;
    }

const nombresNivel = {

    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
};

// Control de seguridad, Si intentan forzar la URL sin jugar, vuelta al inicio
if (!estado || !estado.outcome) {

    window.location.replace('bienvenida.html');
    } else {
        // Inyección de datos en la interfaz (HUD)
        const mensajesResultado = {
            won: ['¡Enhorabuena, has ganado!', 'resultado-ganado'],
            timeout: ['¡Tiempo agotado, has perdido!', 'resultado-perdido']
        };

        // Asigna estado por defecto (timeout) si falla la lectura
        const [mensajeTexto, claseEstilo] = mensajesResultado[estado.outcome] ?? mensajesResultado.timeout;

        $('#mensaje-resultado').text(mensajeTexto).addClass(claseEstilo);
        $('#resultado-puntuacion').text(`${estado.score} puntos`);
        $('#resultado-tiempo').text(`${estado.elapsed ?? 0} segundos`);
        $('#resultado-nivel').text(nombresNivel[estado.level] ?? '—');
    }

// Eventos de navegación y limpieza
$('#boton-jugar-de-nuevo').on('click', () => {

    // Borramos solo la partida actual. El usuario sigue logueado y vuelve a elegir nivel.
    eliminarDeStorage(sessionStorage, STORAGE_KEYS.game);
});

$('#boton-salir').on('click', () => {

    // Cierre de sesión total: borramos partida y credenciales activas
    eliminarDeStorage(sessionStorage, STORAGE_KEYS.game);
    eliminarDeStorage(sessionStorage, STORAGE_KEYS.activeUser);
});