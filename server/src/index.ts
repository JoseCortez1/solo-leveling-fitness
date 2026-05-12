import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';
import { authMiddleware } from './auth.js';
import authRoutes from './routes/auth.js';
import hunterRoutes from './routes/hunter.js';
import questRoutes from './routes/quests.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());

// Init DB
getDb();
console.log('[SYSTEM] Database initialized');

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/hunter', authMiddleware, hunterRoutes);
app.use('/api/quests', authMiddleware, questRoutes);

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SYSTEM] Server error:', err);
  res.status(500).json({ error: '[SYSTEM] Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[SYSTEM] Solo Leveling API running on port ${PORT}`);
});
