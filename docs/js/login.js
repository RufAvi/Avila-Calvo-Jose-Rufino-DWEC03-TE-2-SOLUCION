/**
 * Controlador de la pantalla de Inicio de Sesión.
 * Gestiona el formulario, validación y guardado en sesión de forma segura.
 */

import { jsonUsuarios } from './data/usuarios.js';
import Usuario from './models/Usuario.model.js';
import { guardarJSON, leerJSON, STORAGE_KEYS } from './services/storage.service.js';
import { esPasswordAlfanumerica, autenticarUsuario } from './services/juego.service.js';

/**
 * Carga el catálogo de usuarios por defecto en localStorage la primera vez que se entra.
 */
function inicializarUsuariosSiEsNecesario() {
    const usuariosGuardados = leerJSON(localStorage, STORAGE_KEYS.users);
    
    if (!usuariosGuardados) {
        guardarJSON(localStorage, STORAGE_KEYS.users, jsonUsuarios);
    }
    //Sincroniza los usuarios actuales en localStorage de jsonUsuarios
    guardarJSON(localStorage, STORAGE_KEYS.users, jsonUsuarios);
}

// Funciones auxiliares para la interfaz de errores
function mostrarMensajeError(texto) {
    const $cajaMensaje = $('#mensaje-login');
    $cajaMensaje.text(texto);
    $cajaMensaje.removeAttr('hidden');
}

function ocultarMensajeError() {
    $('#mensaje-login').attr('hidden', true).text('');
}

// Inicialización al cargar el documento (jQuery ready)
$(function () {
    inicializarUsuariosSiEsNecesario();

    //Escucha el evento submit del formulari con jQuery
    $('#formulario-login').on('submit', function (evento) {
        evento.preventDefault();
        ocultarMensajeError();

    // Lee y limpia los espacios en blanco del nombre de usuario
    const nombreUsuario = $('#usuario').val().trim();
    const password = $('#password').val().trim();

    // Campos obligatorios
    if (!nombreUsuario || !password) {
        mostrarMensajeError('Por favor, introduce el usuario y la contraseña.');
        return;
    }

    // Validación de formato mediante Expresión Regular
    if (!esPasswordAlfanumerica(password)) {
        mostrarMensajeError('La contraseña solo puede contener caracteres alfanuméricos (letras y números sin espacios).');
        return;
    }

    // Autenticación contra la base de datos local
    const catalogoUsuarios = leerJSON(localStorage, STORAGE_KEYS.users) || jsonUsuarios;
    const usuarioValido = autenticarUsuario(catalogoUsuarios, nombreUsuario, password);

    if (!usuarioValido) {
        mostrarMensajeError('Usuario o contraseña incorrectos.');
        return;
    }
    // Si todo es correcto , crea la 
    const usuarioSesion = new Usuario(usuarioValido);
    guardarJSON(sessionStorage, STORAGE_KEYS.activeUser, usuarioSesion);

    // Redirección a la interfaz del juego
    window.location.href = 'bienvenida.html';
    });
});