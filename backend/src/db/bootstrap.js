const fs = require("fs/promises");
const path = require("path");
const { pool } = require("./pool");

async function bootstrapDatabase() {
  console.log("[db] bootstrap started");
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");

  await pool.query(sql);

  await pool.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT",
  );
  await pool.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW()",
  );
  await pool.query(
    "CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique_idx ON users (LOWER(email))",
  );

  await pool.query(
    `SELECT setval(
      pg_get_serial_sequence('users', 'id'),
      COALESCE((SELECT MAX(id) FROM users), 1),
      (SELECT EXISTS (SELECT 1 FROM users))
    )`,
  );

  const { rows } = await pool.query(
    "SELECT to_regclass('public.users') AS users_table",
  );

  if (!rows[0]?.users_table) {
    throw new Error("Database bootstrap failed: public.users table not found");
  }

  console.log("[db] bootstrap completed");
}

module.exports = { bootstrapDatabase };
