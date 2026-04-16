const { Pool } = require("pg");
const { env } = require("../config/env");

function normalizeConnectionString(raw) {
  if (!raw) {
    return raw;
  }

  try {
    const url = new URL(raw);
    const sslMode = String(url.searchParams.get("sslmode") || "").toLowerCase();
    const usesLegacyAlias = ["prefer", "require", "verify-ca"].includes(
      sslMode,
    );

    // Avoid noisy pg warning by opting into current libpq-compatible behavior explicitly.
    if (usesLegacyAlias && !url.searchParams.has("uselibpqcompat")) {
      url.searchParams.set("uselibpqcompat", "true");
    }

    return url.toString();
  } catch {
    return raw;
  }
}

const usingConnectionString = Boolean(env.databaseUrl);
const connectionString = normalizeConnectionString(env.databaseUrl);

const pool = usingConnectionString
  ? new Pool({ connectionString })
  : new Pool({
      host: env.pgHost,
      port: env.pgPort,
      user: env.pgUser,
      password: env.pgPassword,
      database: env.pgDatabase,
    });

if (usingConnectionString) {
  try {
    const parsed = new URL(connectionString);
    console.log(
      `[db] using DATABASE_URL host=${parsed.hostname} port=${parsed.port || "5432"} db=${parsed.pathname.replace(/^\//, "")}`,
    );
  } catch {
    console.log("[db] using DATABASE_URL");
  }
} else {
  console.log(
    `[db] using PG* env host=${env.pgHost} port=${env.pgPort} db=${env.pgDatabase}`,
  );
}

module.exports = { pool };
