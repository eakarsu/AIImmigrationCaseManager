const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT d.*, c.case_number, cl.first_name || ' ' || cl.last_name as client_name FROM documents d LEFT JOIN cases c ON d.case_id = c.id LEFT JOIN clients cl ON d.client_id = cl.id ORDER BY d.created_at DESC");
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT d.*, c.case_number, cl.first_name || ' ' || cl.last_name as client_name FROM documents d LEFT JOIN cases c ON d.case_id = c.id LEFT JOIN clients cl ON d.client_id = cl.id WHERE d.id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { document_name, document_type, case_id, client_id, status, file_path, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO documents (document_name, document_type, case_id, client_id, status, file_path, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [document_name, document_type, case_id, client_id, status || 'pending', file_path, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { document_name, document_type, case_id, client_id, status, file_path, notes } = req.body;
    const result = await pool.query(
      'UPDATE documents SET document_name=$1, document_type=$2, case_id=$3, client_id=$4, status=$5, file_path=$6, notes=$7, updated_at=NOW() WHERE id=$8 RETURNING *',
      [document_name, document_type, case_id, client_id, status, file_path, notes, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM documents WHERE id = $1', [req.params.id]);
    res.json({ message: 'Document deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
