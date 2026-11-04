const express = require('express');
const router = express.Router();
const db = require('./firebase.js');
const comprobarToken = require('./comprobarToken');

function parseArticulo(body) {
  if (!body || typeof body.ean13 !== 'string' || !/^\d{13}$/.test(body.ean13) ||
      typeof body.nombre !== 'string' || !body.nombre.trim() ||
      body.precio === '' || body.precio == null || !Number.isFinite(Number(body.precio)) || Number(body.precio) < 0) return null;
  return { ean13: body.ean13, nombre: body.nombre.trim(), precio: Number(body.precio) };
}

router.get('/', comprobarToken, async (req, res) => {
  try {
    const docs = await db.collection('articulos').get();
    const articulos = docs.docs.map(doc => {
      const { ean13, nombre, precio } = doc.data();
      return { ean13, nombre, precio };
    });
    return res.json({ status: 'ok', articulos });
  } catch (error) {
    console.error('Error al listar artículos:', error.message);
    return res.status(500).json({ status: 'error' });
  }
});

router.get('/id', comprobarToken, async (req, res) => {
  if (typeof req.query.ean13 !== 'string') return res.status(400).json({ status: 'error', message: 'EAN requerido' });
  try {
    const docs = await db.collection('articulos').where('ean13', '==', req.query.ean13).limit(1).get();
    if (docs.empty) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
    const { ean13, nombre, precio } = docs.docs[0].data();
    return res.json({ status: 'ok', articulo: { ean13, nombre, precio } });
  } catch (error) {
    console.error('Error al buscar artículo:', error.message);
    return res.status(500).json({ status: 'error' });
  }
});

router.post('/', comprobarToken, async (req, res) => {
  const articulo = parseArticulo(req.body);
  if (!articulo) return res.status(400).json({ status: 'error', message: 'Datos del artículo no válidos (EAN de 13 dígitos)' });
  try {
    const docs = await db.collection('articulos').where('ean13', '==', articulo.ean13).limit(1).get();
    if (!docs.empty) return res.json({ status: 'error1', message: 'EAN ya existente' });
    await db.collection('articulos').add(articulo);
    return res.status(201).json({ status: 'ok' });
  } catch (error) {
    console.error('Error al crear artículo:', error.message);
    return res.status(500).json({ status: 'error2' });
  }
});

router.put('/', comprobarToken, async (req, res) => {
  const articulo = parseArticulo(req.body);
  if (!articulo) return res.status(400).json({ status: 'error', message: 'Datos del artículo no válidos' });
  try {
    const docs = await db.collection('articulos').where('ean13', '==', articulo.ean13).limit(1).get();
    if (docs.empty) return res.status(404).json({ status: 'error', message: 'Artículo no encontrado' });
    await docs.docs[0].ref.set(articulo);
    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error al actualizar artículo:', error.message);
    return res.status(500).json({ status: 'error' });
  }
});
module.exports = router;
