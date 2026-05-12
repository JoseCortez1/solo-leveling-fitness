import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'solo.db');

let db: SqlJsDatabase | null = null;
let SQL: SqlJsStatic | null = null;

export async function initDatabase(): Promise<void> {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');
  initSchema();
  saveDb();
}

function initSchema(): void {
  if (!db) throw new Error('Database not initialized');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS hunters (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      rank TEXT DEFAULT 'E',
      str INTEGER DEFAULT 5,
      sta INTEGER DEFAULT 5,
      agi INTEGER DEFAULT 5,
      vit INTEGER DEFAULT 5,
      difficulty TEXT DEFAULT 'D',
      streak INTEGER DEFAULT 0,
      last_active_date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS daily_quests (
      id TEXT PRIMARY KEY,
      hunter_id TEXT NOT NULL REFERENCES hunters(id),
      date TEXT NOT NULL,
      quest_index INTEGER NOT NULL,
      name TEXT NOT NULL,
      exercise TEXT NOT NULL,
      target_reps INTEGER NOT NULL,
      current_reps INTEGER DEFAULT 0,
      xp_reward INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      UNIQUE(hunter_id, date, quest_index)
    )
  `);
}

function saveDb(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('[SYSTEM] Database not initialized. Call initDatabase() first.');
  return db;
}

// Helper: query one row
export function queryOne(sql: string, params?: any[]): any | null {
  const database = getDb();
  const stmt = database.prepare(sql);
  if (params) stmt.bind(params);
  let result: any | null = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

// Helper: query all rows
export function queryAll(sql: string, params?: any[]): any[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  if (params) stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper: run a statement
export function execute(sql: string, params?: any[]): void {
  const database = getDb();
  if (params) {
    const stmt = database.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
  } else {
    database.run(sql);
  }
  saveDb();
}
