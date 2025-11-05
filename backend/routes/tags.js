const express = require('express');
const router = express.Router();
const { Tag } = require('../models');

router.get('/', async (req, res) => {
  const tags = await Tag.findAll();
  res.json(tags);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la etiqueta es obligatorio.' });
  }
  try {
    const newTag = await Tag.create({ name: name.trim() });
    return res.status(201).json(newTag);
  } catch (error) {
    console.error('Error al crear la etiqueta:', error);
    return res.status(500).json({ error: 'Fallo interno del servidor al crear la etiqueta.' });
  }
});

module.exports = router;