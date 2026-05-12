import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'solo.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

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
    );

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
    );
  `);
}
