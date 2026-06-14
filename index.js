// index.js - Servidor principal de la API de Tareas

import express      from 'express';
import tareasRouter from './routes.js';

const app  = express();
const PORT = 3000;

// Middleware: permite leer JSON en el body (reemplaza body-parser)
app.use(express.json());

// Montar las rutas de tareas
app.use('/tareas', tareasRouter);

// Ruta raíz de confirmación
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje:  '¡Bienvenido a la API de Tareas!',
    version:  '1.0.0',
    endpoint: '/tareas'
  });
});

// Manejo de rutas no definidas (404 global)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
