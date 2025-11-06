import { Pool, PoolClient } from 'pg';

// Create a singleton pool instance
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.DB_SSL_MODE === 'disable' ? false : { rejectUnauthorized: false },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }

  return pool;
}

// Helper function to execute queries with error handling
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a client from the pool for transactions
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return await pool.connect();
}

// Close pool connections (useful for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
