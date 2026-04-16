const { pool } = require("./pool");

async function migrate() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        password_hash TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`,
    );

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

    console.log("Database migration completed.");
  } catch (error) {
    console.error("Database migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
