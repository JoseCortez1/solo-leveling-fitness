import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { generateToken, AuthRequest } from '../auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: '[SYSTEM] Name, email and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: '[SYSTEM] Password must be at least 6 characters' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;

  if (existing) {
    res.status(409).json({ error: '[SYSTEM] Email already registered' });
    return;
  }

  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);

  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(id, name, email, password_hash);

  const token = generateToken(id);
  res.status(201).json({ token, user: { id, name, email } });
});

// POST /api/auth/login
router.post('/login', (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: '[SYSTEM] Email and password are required' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: '[SYSTEM] Invalid email or password' });
    return;
  }

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, name: user.email } });
});

// GET /api/auth/me (requires auth middleware)
router.get('/me', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.userId) as any;

  if (!user) {
    res.status(404).json({ error: '[SYSTEM] User not found' });
    return;
  }

  res.json(user);
});

export default router;
