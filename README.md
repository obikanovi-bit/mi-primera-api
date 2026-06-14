# API de Tareas — Node.js + Express.js

API RESTful básica para gestionar una lista de tareas. Permite crear, leer, actualizar y eliminar tareas (CRUD) usando métodos HTTP estándar. Los datos se almacenan de forma persistente en el archivo `db.json`.

---

## Estructura del proyecto

```
mi-primera-api/
|-> index.js       # Servidor principal: configura Express y monta las rutas
|-> routes.js      # Define todos los endpoints CRUD de /tareas
|-> db.json        # Almacén de datos (persiste entre reinicios)
|-> package.json   # Dependencias del proyecto
|-> README.md      # Documentación
```

---

## Tecnologías utilizadas

- **Node.js** - entorno de ejecución JavaScript del lado del servidor
- **Express.js v5** - framework web para crear el servidor y gestionar rutas
- **Postman** - herramienta utilizada para probar los endpoints de la API

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/obikanovi-bit/mi-primera-api
cd mi-primera-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el servidor

```bash
npm start
```

Para desarrollo con recarga automática:

```bash
npm run dev
```

El servidor quedará disponible en `http://localhost:3000`.

---

## Endpoints disponibles

| Método | Ruta          | Descripción                  |
|--------|---------------|------------------------------|
| GET    | /tareas       | Listar todas las tareas      |
| GET    | /tareas/:id   | Obtener una tarea por ID     |
| POST   | /tareas       | Crear una nueva tarea        |
| PUT    | /tareas/:id   | Actualizar una tarea         |
| DELETE | /tareas/:id   | Eliminar una tarea           |

### Estructura de una tarea

```json
{
  "id": 1,
  "titulo": "Estudiar Express.js",
  "descripcion": "Revisar la documentación oficial de Express",
  "completada": false
}
```

---

## Pruebas con Postman

### Requisitos previos

1. Tener [Postman](https://www.postman.com/downloads/) instalado.
2. Tener el servidor corriendo con `npm start`.

---

### 1. GET - Listar todas las tareas

**Configuración en Postman:**
- Método: `GET`
- URL: `http://localhost:3000/tareas`
- No requiere Body

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Estudiar Express.js",
    "descripcion": "Revisar la documentación oficial de Express",
    "completada": true
  },
  {
    "id": 2,
    "titulo": "Aprender Express.js",
    "descripcion": "Seguir tutoriales y practicar con proyectos",
    "completada": false
  }
]
```

> 📸 [Resultado Esperado](image.png)

---

### 2. POST - Crear una nueva tarea

**Configuración en Postman:**
- Método: `POST`
- URL: `http://localhost:3000/tareas`
- Pestaña **Body** -> seleccionar **raw** -> tipo **JSON**
- Pegar el siguiente JSON en el campo de texto:

```json
{
  "titulo": "Documentar la Tarea",
  "descripcion": "Escribir el README completo",
  "completada": false
}
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 3,
  "titulo": "Documentar la Tarea",
  "descripcion": "Escribir el README completo",
  "completada": false
}
```

**Error - falta el campo `titulo` (400 Bad Request):**

Si se envía el body sin el campo `titulo`, el servidor responde:
```json
{
  "error": "El campo \"titulo\" es obligatorio y debe ser texto"
}
```

> 📸 [Resultado Esperado](image-1.png)

---

### 3. PUT - Actualizar una tarea existente

**Configuración en Postman:**
- Método: `PUT`
- URL: `http://localhost:3000/tareas/1`
- Pestaña **Body** -> seleccionar **raw** -> tipo **JSON**
- Pegar el siguiente JSON en el campo de texto:

```json
{
  "titulo": "Express.js dominado",
  "completada": true
}
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "titulo": "Express.js dominado",
  "descripcion": "Revisar la documentación oficial de Express",
  "completada": true
}
```

**Error - tarea no encontrada (404 Not Found):**

Si el ID no existe, el servidor responde:
```json
{
  "error": "Tarea no encontrada"
}
```

> 📸 [Resultado Esperado](image-2.png)

---

### 4. DELETE - Eliminar una tarea

**Configuración en Postman:**
- Método: `DELETE`
- URL: `http://localhost:3000/tareas/2`
- No requiere Body

**Respuesta esperada (200 OK):**
```json
{
  "mensaje": "Tarea eliminada correctamente",
  "tarea": {
    "id": 2,
    "titulo": "Aprender Express.js",
    "descripcion": "Seguir tutoriales y practicar con proyectos",
    "completada": true
  }
}
```

> 📸 [Resultado Esperado](image-3.png)

---

## Validaciones y manejo de errores

| Situación                            | Código HTTP  | Mensaje de respuesta                              |
|--------------------------------------|--------------|---------------------------------------------------|
| Operación exitosa (GET, PUT, DELETE) | 200 OK       | Datos del recurso                                 |
| Tarea creada correctamente           | 201 Created  | Datos de la nueva tarea                           |
| Falta el campo `titulo`              | 400          | "El campo titulo es obligatorio..."               |
| `completada` no es booleano          | 400          | "El campo completada debe ser un booleano..."     |
| ID no existe (GET, PUT, DELETE)      | 404          | "Tarea no encontrada"                             |
| Ruta no definida                     | 404          | "Ruta no encontrada"                              |

---

## Flujo de la aplicación

1. El cliente (Postman) envía una petición HTTP a un endpoint de `/tareas`.
2. `index.js` recibe la petición y la pasa a `routes.js` mediante `app.use()`.
3. `routes.js` identifica el método HTTP y la ruta, valida los datos del body y accede a `db.json` para leer, crear, actualizar o eliminar una tarea.
4. El resultado se devuelve al cliente en formato JSON con el código HTTP correspondiente.

---

## Decisiones de diseño

- Se usa **`db.json`** como almacén de datos para que las tareas persistan entre reinicios del servidor, sin necesidad de una base de datos externa.
- Las rutas se separan en `routes.js` para mantener `index.js` limpio y enfocado solo en la configuración del servidor.
- Se utiliza `express.json()` nativo en lugar de `body-parser`, ya que Express 5 lo incluye de forma integrada.
- El `id` se asigna automáticamente como `array.length + 1` al crear cada tarea.
- La validación verifica tanto la presencia como el tipo de cada campo obligatorio antes de procesar la solicitud.
- Adicionalmente, el proyecto incluye un archivo `requests.http` que permite verificar todos los endpoints directamente desde Visual Studio Code, sin necesidad de herramientas externas. Para utilizarlo, instala la extensión REST Client en VS Code, abre el archivo `requests.http` y haz clic en Send Request sobre cada bloque para ejecutar las peticiones GET, POST, PUT y DELETE.
