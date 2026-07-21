'use strict';

const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

async function main() {
  if (process.env.BOOTSTRAP_ACKNOWLEDGEMENT !== 'create-initial-admin') {
    throw new Error('BOOTSTRAP_ACKNOWLEDGEMENT=create-initial-admin is required');
  }
  const tenantId = String(process.env.TENANT_ID || '').trim();
  const email = String(process.env.PROVISION_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.PROVISION_ADMIN_PASSWORD || '');
  const fullName = String(process.env.PROVISION_ADMIN_NAME || '').trim();
  if (!tenantId || !email || !fullName || password.length < 12) {
    throw new Error('TENANT_ID, admin email/name, and a 12+ character admin password are required');
  }
  const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
  if (existing.rows[0]) {
    console.log('Administrator already exists; credentials and role were not changed');
    return;
  }
  const tenantUser = await pool.query('SELECT id FROM users WHERE tenant_id = $1 LIMIT 1', [tenantId]);
  if (tenantUser.rows[0]) throw new Error('Tenant already has users; bootstrap will not add another administrator');
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO users(email, password_hash, full_name, role, tenant_id)
     VALUES($1, $2, $3, 'admin', $4)`,
    [email, passwordHash, fullName, tenantId]
  );
  console.log('Initial administrator provisioned');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
