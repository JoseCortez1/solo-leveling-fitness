# METZTLI.md — Solo Leveling Training (solo-fitnessling)

## 🌙 Notas de Met

### Stack
- **Frontend:** React 19 + TypeScript + Vite 8 + CSS vanilla + Lucide React
- **Backend:** Node.js + Express 5 + TypeScript + sql.js (SQLite WASM, sin compilación nativa)
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **DB:** SQLite (vía sql.js, guardado automático en cada write)

### Repos
- **GitHub:** `JoseCortez1/solo-leveling-fitness` (branch `main`)
- **Producción:** `https://solo-fitnessling.educortez.com/` (puerto 443 SSL)
- **API directa:** `http://93.188.162.143:3001/` (sin SSL)

### Directorios
```
/var/www/solo-leveling-fitness/      ← Prod
/root/projects/solo-leveling-fitness/ ← Sandbox
```

### Deploy
El backend corre con nohup + disown:
```bash
cd /var/www/solo-leveling-fitness/server
nohup /usr/bin/npx tsx src/index.ts > /var/log/solo-leveling.log 2>&1 &
disown
```

Para reiniciar:
```bash
fuser -k 3001/tcp
# luego el comando de arriba
```

Para ver logs:
```bash
tail -f /var/log/solo-leveling.log
```

### Nginx
La configuración del dominio está en `/etc/nginx/sites-enabled/educortez-pm2` (se agregó al final del archivo).
- HTTP → redirect 301 a HTTPS
- HTTPS → proxy_pass a `http://127.0.0.1:3001`

### API Endpoints
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register (name, email, password) |
| POST | /api/auth/login | No | Login → JWT |
| GET | /api/auth/me | JWT | User info |
| POST | /api/hunter/activate | JWT | Crear hunter (name, stats, difficulty) |
| GET | /api/hunter | JWT | Perfil del hunter |
| PUT | /api/hunter/difficulty | JWT | Cambiar dificultad (1x/día) |
| GET | /api/quests | JWT | Quests diarios |
| PUT | /api/quests/:id/progress | JWT | Actualizar reps |
| POST | /api/quests/:id/complete | JWT | Completar quest + XP |

### Dificultades
| Rank | Nombre | Reps Multi | XP Multi | Descanso |
|------|--------|-----------|----------|---------|
| E | Casual | x0.5 | x0.75 | 90s |
| D | Normal | x1.0 | x1.0 | 60s |
| C | Hard | x1.5 | x1.25 | 45s |
| B | Veteran | x2.0 | x1.5 | 30s |
| A | Expert | x2.5 | x1.75 | 20s |
| S | Insane | x3.0 | x2.0 | 10s |

### Issues conocidos
1. **HTTP redirección:** El `default_server` + `landings-wildcard` regex causan conflicto de server_name en puerto 80. HTTPS funciona perfecto. Para arreglar: modificar el regex en `landings-wildcard` para excluir `solo-fitnessling`.
2. **Node.js:** Prod tiene Node 18 por defecto. El backend funciona con Node 18 gracias a sql.js (WASM puro, no necesita compilación nativa). No instalar Node 22 globalmente — rompe los otros proyectos.
3. **PM2:** La versión del sistema (6.x) está desactualizada vs la global (7.x). Por eso se usa `npx pm2` en vez de `pm2` directo. Actualmente no se usa PM2 para este proyecto — corre con nohup.
4. **sql.js vs better-sqlite3:** Se usa sql.js porque no necesita compilación nativa. La DB se guarda a disco en cada write vía `db.export()` + `fs.writeFileSync`.
5. **Express 5:** El wildcard `*` no funciona para SPA catch-all. Usar regex `/.*/` en `app.get()`.

### Lecciones aprendidas
- **Heredocs en SSH:** Los heredocs con `<< 'EOF'` dentro de comandos SSH con doble comilla EXPANDEN variables. Para evitar: escribir archivos localmente y scpearlos.
- **nginx reload vs restart:** `systemctl reload nginx` a veces no aplica cambios en este servidor. Usar `systemctl restart nginx` para forzar.
- **NO tocar default site:** El default site con `server_name _` + `default_server` es crítico para la infraestructura. Modificarlo rompe el ruteo de todos los subdominios.
- **El patrón de los proyectos:** Todos los proyectos siguen HTTP redirect → HTTPS + proxy_pass. Usar siempre este patrón en `educortez-pm2`.

### Frases del manwha integradas
- "[SYSTEM ACTIVATING...]" — al cargar
- "[The System has chosen you.]" — activation complete
- "[Quest Completed]" — al terminar quest
- "[LEVEL UP!]" — al subir nivel
- "[Arise]" — al completar todos los quests
- "The strong do what they can, the weak suffer what they must." — login screen

### Token almacenado
GitHub PAT almacenado en `~/.openclaw/.env` como `GITHUB_PAT`.
