# Trailerflix

API RESTful hecha con Node.js y Express para consultar un catálogo de películas y series a partir de un archivo JSON.

## Requisitos

- [Node.js](https://nodejs.org/) instalado (se puede comprobar con `node -v`).

## Cómo ejecutarlo

1. Clonar o descargar el proyecto y abrir una terminal dentro de la carpeta.
2. Instalar las dependencias (la carpeta `node_modules` no se comparte, se genera con este comando):

   ```
   npm install
   ```

3. Iniciar el servidor:

   ```
   npm start
   ```

   También se puede usar `npm run dev`, que reinicia el servidor solo cuando se modifica el código.

4. Abrir en el navegador: http://localhost:3008

## Configuración

El archivo `.env` ya está incluido en el proyecto y define:

| Variable    | Valor                          | Descripción                          |
| ----------- | ------------------------------ | ------------------------------------ |
| `PORT`      | `3008`                         | Puerto del servidor web              |
| `DATA_PATH` | `./database/trailerflix.json`  | Ruta del archivo JSON con los datos  |

## Endpoints

Todos son `GET` y responden en formato JSON.

| Endpoint          | Descripción                                                        | Ejemplo                                   |
| ----------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| `/`               | Página de bienvenida                                               | http://localhost:3008/                    |
| `/catalogo`       | Lista todo el contenido del catálogo                               | http://localhost:3008/catalogo            |
| `/titulo/:title`  | Títulos que contienen el texto indicado (total o parcial)          | http://localhost:3008/titulo/casa         |
| `/categoria/:cat` | Todo el contenido de una categoría (`serie` o `película`)          | http://localhost:3008/categoria/serie     |
| `/reparto/:act`   | Títulos donde participa la actriz o el actor indicado              | http://localhost:3008/reparto/pacino      |
| `/trailer/:id`    | Devuelve `id`, `titulo` y `trailer` del título con ese id          | http://localhost:3008/trailer/1           |

### Notas sobre las respuestas

- Las búsquedas por título, categoría y reparto **no distinguen mayúsculas ni acentos**: `/categoria/pelicula` encuentra las películas y `/titulo/irlandes` encuentra "El Irlandés".
- Si una búsqueda no tiene resultados, la API responde con estado `404` y un mensaje en JSON.
- Si un título no tiene trailer (por ejemplo `/trailer/2`), la API responde con un mensaje en JSON avisando que no está disponible.

## Estructura del proyecto

```
trailerflix/
├── database/
│   └── trailerflix.json   # Datos de películas y series
├── public/                # Página de bienvenida (HTML, CSS y JS)
├── .env                   # Puerto y ruta del archivo de datos
├── index.js               # Servidor y endpoints
└── package.json
```
