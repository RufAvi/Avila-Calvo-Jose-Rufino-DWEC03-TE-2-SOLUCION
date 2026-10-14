# 📘 DWEC03 - Tarea de Evaluación [2/2]

## 📝 Descripción general

En esta segunda tarea llevarás a cabo el desarrollo del minijuego planteado en la tarea anterior.

## 🎯 Objetivos de aprendizaje

- Validar los datos introducidos mediante formularios.

- Gestionar eventos e interacciones del usuario.

- Manipular dinámicamente elementos del DOM.

- Gestionar información mediante Web Storage.

- Realizar la navegación entre las diferentes interfaces de la aplicación.

- Desarrollar mediante HTML y CSS las interfaces planificadas en la tarea anterior.

- Organizar el código respetando la arquitectura y la separación de responsabilidades estudiadas anteriormente.

## 📚 Antes de empezar

> [!NOTE]
> 
> - Recuerda que debes **respetar la arquitectura de la aplicación estudiada en la UD anterior**.
> 
> - Podrás obtener hasta 1,5 puntos por la mejora de la interfaz gráfica, valorándose especialmente la organización visual, la legibilidad, la coherencia entre interfaces y la calidad estética.

## 🛠️ Ejercicios

### Ejercicio 1: Inicio de Sesión

- **Acceso:** Crea un formulario de inicio de sesión que incluya los siguientes campos: `Usuario`, `Contraseña` y botón `Enviar`.

- **Validación del Usuario:**
  
  - Se proporciona un fichero `usuarios.json` con nombres de usuarios y contraseñas válidos para poder iniciar sesión.
  
  - Copia el contenido de `usuarios.json` y pégalo en una constante `jsonUsuarios` .

> [!NOTE]
> 
> Alternativamente, por si lo quieres utilizar, en el directorio `ejemplo-cargar-datos-json` del apartado de `recursos` te dejo un ejemplo de cómo cargar los datos de un fichero`.json` directamente en el código.

- Procesa ese contenido como JSON para obtener los registros del histórico.

- Almacéna los datos de los usuarios en el`localStorage`.

- Cuando el usuario pulse el botón de envío, verifica si las credenciales introducidas coinciden con las del fichero.

> [!IMPORTANT]
> 
> El inicio de sesión de esta tarea es una simulación realizada íntegramente desde el lado cliente con fines didácticos. En una aplicación real, las credenciales no se almacenarían ni validarían de esta manera.

- **Mensajes de Validación:**
  
  - Si el usuario y la contraseña son correctos, redirige a la interfaz de *Bienvenida*. Si no lo son, indícalo en la interfaz de la manera que prefieras.
  
  - La contraseña solo podrá contener caracteres alfanuméricos, es decir, letras y números. Si contiene caracteres no permitidos, muestra un mensaje de error. Utiliza `RegExp` para realizar esta validación.

### Ejercicio 2: Bienvenida

Esta interfaz introducirá al usuario en el juego y le permitirá seleccionar el nivel de dificultad. 

La interfaz debe contener lo siguiente:

- **Instrucciones del Juego:** área con las instrucciones básicas del juego, explicando sus objetivos y reglas.

- **Botón de Inicio:** permite al usuario empezar el juego. Al hacer clic, redirige a la interfaz de *Juego*.

- **Selección de Nivel:**
  
  - Cuadro de selección con tres niveles de dificultad: `principiante`, `intermedio` y `avanzado`.
  
  - Implementa las diferencias entre los tres niveles de dificultad que definiste en la tarea anterior.

### Ejercicio 3: Juego

Interfaz principal donde se desarrollará el juego. Debe incluir lo siguiente:

- **Estructura de la Interfaz:**
  
  - **Zona de Juego:** área principal donde el usuario interactuará-. Aquí se desarrollará la actividad central del juego.
  
  - **Zona de Información:** área donde se muestra información en tiempo real como puntuación, tiempo restante, etc.

- **Dinámica de Juego:**
  
  - Genera dinámicamente los elementos del área de juego al cargar la interfaz.
  
  - Implementa la mecánica principal del juego que definiste en la tarea anterior y los eventos asociados a ella, respetando el mínimo de tres tipos de eventos diferentes establecido en la fase de planificación.

- **Temporizador:**
  
  - Al acceder al juego, se iniciará una cuenta atrás de `30` segundos que estará visible en todo momento en la interfaz.
  
  - Si el temporizador llega a `0` antes de que finalice la partida, el usuario será redirigido automáticamente a la interfaz de *Resultados*.

- **Estado de la partida:**
  
  - Conserva en `sessionStorage` la información necesaria para mantener el estado de la partida entre las diferentes interfaces, como el nivel seleccionado, la puntuación, el tiempo o cualquier otro dato relevante para tu juego.

### Ejercicio 4: Resultados

El usuario será redirigido a esta interfaz al finalizar el juego. Es decir, cuando haya ganado, perdido o agotado el tiempo disponible para completar la partida.

La interfaz se dividirá en las siguientes áreas:

- **Resultado Final:** muestra si el usuario ha ganado o perdido, junto con un resumen relevante (puntuación obtenida, tiempo empleado, etc.).

- **Opciones de Reinicio o Salida:** incluye botones para:
  
  - Jugar de nuevo: redirige a la interfaz de *Bienvenida* para comenzar una nueva partida.
  
  - Salir: redirige a la interfaz de *Inicio de Sesión*.
