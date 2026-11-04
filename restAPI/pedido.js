const express = require('express');
const router = express.Router();
const db = require('./firebase.js');
const comprobarToken = require('./comprobarToken');

router.get('/', comprobarToken, async (req, res) => {
  try {
    const docs = await db.collection('pedidos').where('cliente', '==', req.id).get();
    return res.json({ pedidos: docs.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    console.error('Error al listar pedidos:', error.message);
    return res.status(500).json({ status: 'error' });
  }
});

router.post('/', comprobarToken, async (req, res) => {
  const { fecha, articulos } = req.body || {};
  if (typeof fecha !== 'string' || !Array.isArray(articulos) || articulos.length === 0 ||
      !articulos.every(item => item && typeof item === 'object' && Number.isInteger(Number(item.cantidad)) && Number(item.cantidad) > 0)) {
    return res.status(400).json({ status: 'error', message: 'Pedido no válido' });
  }
  try {
    await db.collection('pedidos').add({ cliente: req.id, fecha, articulos });
    return res.status(201).json({ status: 'ok' });
  } catch (error) {
    console.error('Error al crear pedido:', error.message);
    return res.status(500).json({ status: 'error' });
  }
});
module.exports = router;
