const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.full_name, role: user.role } });
  } catch (error) {
    console.error('Login unavailable:', error.message);
    res.status(503).json({ error: 'Authentication service unavailable' });
  }
});

router.post('/register', async (req, res) => {
  try {
    if (process.env.ALLOW_PUBLIC_REGISTRATION !== 'true') {
      return res.status(403).json({ error: 'Public registration is disabled' });
    }
    const { email, password, full_name } = req.body;
    if (!email || !full_name || typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({ error: 'Email, full name, and a 12+ character password are required' });
    }
    const tenantId = process.env.REGISTRATION_TENANT_ID;
    if (!tenantId) return res.status(503).json({ error: 'Registration tenant is not configured' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role, tenant_id',
      [email.trim().toLowerCase(), hash, full_name, 'case_worker', tenantId]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Registration unavailable:', error.message);
    res.status(503).json({ error: 'Registration service unavailable' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, tenant_id FROM users WHERE id = $1 AND tenant_id = $2 LIMIT 1',
      [req.user.id, req.user.tenant_id]
    );
    if (!result.rows[0]) return res.status(401).json({ error: 'Session identity is no longer active' });
    const user = result.rows[0];
    return res.json({ user: { id: user.id, email: user.email, name: user.full_name, role: user.role, tenant_id: user.tenant_id } });
  } catch (_error) {
    return res.status(503).json({ error: 'Authentication service unavailable' });
  }
});

module.exports = router;
