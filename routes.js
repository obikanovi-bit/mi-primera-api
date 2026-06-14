// routes.js - Definición de todas las rutas de la API de Tareas

import express from 'express';
import fs      from 'fs';

const router = express.Router();

// ─────────────────────────────────────────────
// Funciones auxiliares para leer y escribir db.json
// ─────────────────────────────────────────────

const readData = () => {
  try {
    const data = fs.readFileSync('./db.json');
    return JSON.parse(data);
  } catch (error) {
    console.log('Error al leer db.json:', error);
    return { tareas: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error al escribir en db.json:', error);
  }
};

// ─────────────────────────────────────────────
// GET /tareas  →  Listar todas las tareas
// ─────────────────────────────────────────────
router.get('/', (req, res) => {
  const data = readData();
  res.status(200).json(data.tareas);
});

// ─────────────────────────────────────────────
// GET /tareas/:id  →  Obtener una tarea por ID
// ─────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const data  = readData();
  const id    = parseInt(req.params.id);
  const tarea = data.tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.status(200).json(tarea);
});

// ─────────────────────────────────────────────
// POST /tareas  →  Crear una nueva tarea
// ─────────────────────────────────────────────
router.post('/', (req, res) => {
  const { titulo, descripcion, completada } = req.body;

  // Validar campo obligatorio: titulo
  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El campo "titulo" es obligatorio y debe ser texto' });
  }

  // Validar tipo: completada debe ser booleano si se envía
  if (completada !== undefined && typeof completada !== 'boolean') {
    return res.status(400).json({ error: 'El campo "completada" debe ser un booleano (true o false)' });
  }

  const data       = readData();
  const nuevaTarea = {
    id:          data.tareas.length + 1,
    titulo:      titulo.trim(),
    descripcion: descripcion || '',
    completada:  completada !== undefined ? completada : false
  };

  data.tareas.push(nuevaTarea);
  writeData(data);
  res.status(201).json(nuevaTarea);
});

// ─────────────────────────────────────────────
// PUT /tareas/:id  →  Actualizar una tarea existente
// ─────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const data  = readData();
  const id    = parseInt(req.params.id);
  const index = data.tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { titulo, descripcion, completada } = req.body;

  // Validar que titulo no esté vacío si se envía
  if (titulo !== undefined && (typeof titulo !== 'string' || titulo.trim() === '')) {
    return res.status(400).json({ error: 'El campo "titulo" no puede estar vacío' });
  }

  // Validar tipo de completada si se envía
  if (completada !== undefined && typeof completada !== 'boolean') {
    return res.status(400).json({ error: 'El campo "completada" debe ser un booleano (true o false)' });
  }

  // Actualizar solo los campos recibidos
  if (titulo      !== undefined) data.tareas[index].titulo      = titulo.trim();
  if (descripcion !== undefined) data.tareas[index].descripcion = descripcion;
  if (completada  !== undefined) data.tareas[index].completada  = completada;

  writeData(data);
  res.status(200).json(data.tareas[index]);
});

// ─────────────────────────────────────────────
// DELETE /tareas/:id  →  Eliminar una tarea
// ─────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const data  = readData();
  const id    = parseInt(req.params.id);
  const index = data.tareas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const tareaEliminada = data.tareas.splice(index, 1)[0];
  writeData(data);
  res.status(200).json({
    mensaje: 'Tarea eliminada correctamente',
    tarea:   tareaEliminada
  });
});

export default router;
