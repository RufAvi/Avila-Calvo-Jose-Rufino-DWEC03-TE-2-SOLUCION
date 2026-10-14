export function cargarJSON(path, callback) {

    fetch(path)
        .then(response => {

            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${path}`);
            }

            return response.json();
        })
        .then(datos => {

            callback(datos);

        })
        .catch(error => {

            console.error('No se pudieron cargar los datos:', error);

        });
}