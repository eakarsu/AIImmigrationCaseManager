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
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO users(email, password_hash, full_name, role, tenant_id)
     VALUES($1, $2, $3, 'admin', $4)
     ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,
       full_name=EXCLUDED.full_name,role=EXCLUDED.role,tenant_id=EXCLUDED.tenant_id`,
    [email, passwordHash, fullName, tenantId]
  );
  console.log('Initial administrator provisioned or refreshed');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
