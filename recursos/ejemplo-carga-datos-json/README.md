# Carga de datos desde un fichero JSON

Este recurso permite cargar los datos de un fichero con extensión `.json` directamente de un fichero `JavaScript` .

>  [!IMPORTANT]
> 
> El fichero `cargar-datos.js` contiene las funciones necesarias para realizar la carga de datos. 
> 
> No modifiques este fichero.
> 
> Utilízalo únicamente como te explico en el ejemplo

A continuación te explico **el flujo de trabajo** que tendrás que realizar para cargar los datos:

- Guardar el módulo `cargar-datos.js` en tu proyecto
- Importar `cargarJSON()` en el fichero desde el que quieras hacer la carga
- Llamar a la función `cargarJSON()` pasándole la ruta del fichero `.json` con los datos que quieras cargar como parámetro
- Esperar el resultado
- Guardar los datos en una variable
- Trabajar con esos datos con normalidad

---

### Ejemplo de funcionamiento

- Como verás en el ejemplo la llamada a la función `cargarJSON()` se realiza de una manera diferente a como lo haces habitualmente. 

- Debajo del ejemplo tienes una intuición de cual es la mecánica de funcionamiento este tipo de funciones. 

- No es necesario que lo entiendas en profundidad de momento ya que es contenido especifico de la UD4.

```javascript
// importamr el módulo 
import { cargarJSON } from './cargar-datos.js';

// almacena la ruta del fichero '.json' con los datos
const JSON_PATH = './';

// variable para almacenar los datos del '.json'
let datosJSON = [];


// llamada a la funcion que carga los datos
cargarJSON(JSON_PATH , datos => {
    datosJSON = datos;
});
```

>  [!NOTE]
> 
> - El fichero `cargar-datos.js` hace uso interno de funciones *asíncronas.*
> 
> - El modo en que `javascript` permite trabajar con asincronía es mediante este tipo de funciones
> 
> - Se de denominan *funciones de callback*.
>   
>   *Un callback es una función que se pasa como argumento a otra función para que esta la ejecute cuando corresponda.*
> 
> ```javascript
> function funcionPrincipal(callback) {
>     // 1. La función principal realiza su trabajo
> 
>     callback();
>     // 2. Ejecuta la función que recibió como parámetro
> }
> ```