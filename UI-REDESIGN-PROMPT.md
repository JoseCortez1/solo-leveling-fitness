# 🎮 UI Design Prompt — Solo Leveling Training App

## Contexto y Dirección Estética

Rediseña la interfaz de esta training app siguiendo la estética del sistema de cazadores del anime/manhwa **Solo Leveling**. La UI debe sentirse como una pantalla holográfica flotante del sistema del Monarca — fría, tecnológica, misteriosa y poderosa. El usuario no es un atleta: **es un cazador que sube de nivel**.

---

## 🎨 Paleta de Colores

Usa **exclusivamente** estas variables CSS como sistema de color:

```css
:root {
  /* Fondos */
  --bg-void:        #03060F;   /* Negro abismal — fondo principal */
  --bg-panel:       #080D1A;   /* Panel oscuro semitransparente */
  --bg-card:        #0A1020CC; /* Cards con transparencia */

  /* Azules del sistema */
  --blue-core:      #1E90FF;   /* Azul eléctrico — acento principal */
  --blue-glow:      #00BFFF;   /* Cyan brillante — brillo y bordes activos */
  --blue-dim:       #1A3A5C;   /* Azul apagado — bordes inactivos */
  --blue-ghost:     #0D2040;   /* Azul fantasma — fills sutiles */

  /* Acento de peligro/penalización */
  --red-penalty:    #FF2D2D;   /* Rojo advertencia — penaltis y warnings */
  --red-glow:       #FF000066; /* Sombra roja */

  /* Texto */
  --text-primary:   #E8F4FF;   /* Blanco frío */
  --text-secondary: #7BA7CC;   /* Azul grisáceo */
  --text-muted:     #3D6080;   /* Texto desactivado */
  --text-accent:    #00CFFF;   /* Cyan para valores numéricos */

  /* Barras de estadísticas */
  --bar-hp:         #2ECC71;   /* Verde HP */
  --bar-mp:         #3B82F6;   /* Azul MP */
  --bar-xp:         #F59E0B;   /* Ámbar XP */

  /* Completado / éxito */
  --green-done:     #00FF88;
  --green-glow:     #00FF8844;
}
```

---

## 🔤 Tipografía

```
Display / Títulos:  "Orbitron" (Google Fonts) — MAYÚSCULAS, tracking muy amplio
Cuerpo / Labels:    "Rajdhani" (Google Fonts) — peso 500-600
Números/Stats:      "Share Tech Mono" — monoespaciado digital
```

**Reglas tipográficas:**
- Todos los títulos de sección en **MAYÚSCULAS** con `letter-spacing: 0.2em`
- Valores numéricos de stats siempre en Share Tech Mono, color `--text-accent`
- Labels de stats en Rajdhani peso 600, color `--text-secondary`
- Tamaños: títulos 11-13px (pantallas compactas de sistema), valores 24-32px bold

---

## 🖼️ Componentes Principales

### 1. Panel de Estadísticas (Stats Screen)

```
┌─────────────────────────────────────────────────────┐
│  HP ████████████████░░  100/100    MP ███░  10/10   │
│  FATIGUE: 0                                          │
├─────────────────────────────────────────────────────┤
│  ⚡ STR: 19        ♥ VIT: 10                        │
│  ⚡ AGI: 10        🧠 INT: 10                        │
│  ⚡ PER: 10    Available Ability Points: 3            │
└─────────────────────────────────────────────────────┘
```

**Estilo del panel:**
- Fondo: `--bg-panel` con `backdrop-filter: blur(12px)`
- Borde: `1px solid --blue-dim` con `box-shadow` exterior de `--blue-glow` a baja opacidad
- Esquinas: ligeramente cortadas (clip-path hexagonal en las 4 esquinas — `clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)`)
- Las barras HP/MP tienen borde interno y el fill tiene un brillo animado que se desliza de izquierda a derecha en loop (shimmer animation)
- Los iconos de stats tienen un glow pulsante muy sutil en `--blue-glow`

### 2. Quest Info / Daily Quest Panel

**Estructura:**
```
[ ! ]  QUEST INFO
─────────────────────────────────
[Daily Quest: Strength Training has arrived.]

            GOAL

Push-ups         [100/100] ✓
Sit-ups          [100/100] ✓
Squats           [100/100] ✓
Running          [10/10km] ✓

─────────────────────────────────
⚠ WARNING: Failure to complete the daily quest
  will result in an appropriate PENALTY.

                [✓ COMPLETE]
```

**Estilo:**
- El panel flota con `transform: perspective(800px) rotateX(3deg)` para dar sensación 3D
- Título con línea divisoria que se extiende con animación al cargar
- Items completados muestran `--green-done` con tachado + checkmark animado
- El texto WARNING parpadea en `--red-penalty` lentamente (opacity 1 → 0.5, 2s infinite)
- Botón de completar: borde `--blue-glow`, fondo transparente → on hover: fill azul + escala 1.02

### 3. Notification / Reward Modal

```
┌──────────────────────────────┐
│ [!]   NOTIFICATION           │
│                              │
│  You have received a reward. │
│  — [Penalty Quest: ...]      │
│                              │
│  Check your reward?          │
│                              │
│    [ No ]        [ Yes ]     │
└──────────────────────────────┘
```

**Estilo:**
- Aparece con animación: escala desde 0.85 + fade in, duración 300ms ease-out
- Bordes con efecto de líneas de luz en las esquinas (pseudo-elementos con gradiente)
- El ícono `[!]` en una caja cuadrada con fondo `--blue-ghost` y borde `--blue-glow`
- Botones: ambos con borde `--blue-dim`; "Yes" en hover se ilumina en `--blue-glow`; "No" en hover se oscurece

---

## ✨ Sistema de Efectos y Animaciones

### Efecto de aparición de pantallas del sistema

```css
/* Keyframe de entrada de todos los paneles */
@keyframes systemBoot {
  0%   { opacity: 0; transform: scaleY(0.02); filter: brightness(3); }
  15%  { opacity: 1; transform: scaleY(1.02); filter: brightness(1.5); }
  30%  { transform: scaleY(0.98); }
  100% { transform: scaleY(1); filter: brightness(1); }
}
/* Duración: 400ms ease-out */
```

### Glow pulsante en bordes activos

```css
@keyframes borderPulse {
  0%, 100% { box-shadow: 0 0 8px #1E90FF55, 0 0 20px #1E90FF22; }
  50%       { box-shadow: 0 0 14px #00BFFFAA, 0 0 35px #1E90FF44; }
}
/* Duración: 2.5s ease-in-out infinite */
```

### Shimmer en barras de progreso

```css
@keyframes barShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
/* Aplicar como overlay con: background: linear-gradient(90deg, transparent 0%, #ffffff22 50%, transparent 100%) */
/* background-size: 200% 100%; animation: barShimmer 2s linear infinite */
```

### Texto de nivel / XP ganado

```css
@keyframes floatUp {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-40px); }
}
/* Para mostrar "+XP" o "LEVEL UP!" que aparece y sube flotando */
```

### Escaneo de líneas (scanlines overlay)

Agrega un pseudo-elemento `::before` sobre los paneles con:
```css
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0, 150, 255, 0.03) 2px,
  rgba(0, 150, 255, 0.03) 4px
);
pointer-events: none;
```

---

## 🏗️ Layout y Composición

- **No uses bordes redondeados estándar** (`border-radius`). Usa clip-path hexagonal o cortes en esquinas
- Los paneles se superponen ligeramente en mobile (sensación de HUD multicapa)
- Separadores entre secciones: línea de `1px solid --blue-dim` con puntos de luz en los extremos (`::before`/`::after` con `background: --blue-glow; width: 4px; height: 4px; border-radius: 50%`)
- Iconos de stats: usa SVG custom o lucide-react con `filter: drop-shadow(0 0 4px --blue-glow)`

---

## 🎯 Estados Especiales

| Estado | Efecto visual |
|---|---|
| Quest completada | Panel border → `--green-done` + flash de 200ms |
| Penalización activa | Fondo rojo muy sutil (`--red-glow`) + texto warning parpadeante |
| Level Up | Overlay de partículas azules + texto "LEVEL UP" con systemBoot animation |
| Quest fallida | Panel se tiñe ligeramente rojo, icono `[!]` parpadea rápido |
| Stat aumentado | El número hace flip (rotateX 360°) y queda iluminado 1s |

---

## 📱 Mobile-first

- Paneles: `width: 100%; max-width: 480px; margin: 0 auto`
- Stats grid: 2 columnas con `gap: 16px`
- Fuente mínima de valores: 22px para legibilidad en móvil
- Touch targets de botones: mínimo 44px de altura
- El fondo `--bg-void` ocupa el 100vh con un radial gradient sutil centrado:
  ```css
  background: radial-gradient(ellipse at 50% 30%, #0D2040 0%, #03060F 70%);
  ```

---

## 🚫 Lo que NO hacer

- ❌ No usar `border-radius > 4px` en los paneles principales
- ❌ No usar colores cálidos (naranja, amarillo) salvo para barras XP
- ❌ No usar sombras marrones o grises — solo sombras azules o negras
- ❌ No usar Inter, Roboto, ni ninguna sans-serif genérica
- ❌ No usar gradientes púrpura/violeta (no es Solo Leveling, es otro anime)
- ❌ No animar todo al mismo tiempo — escalonar con `animation-delay`

---

## ✅ Checklist de implementación

- [ ] Fuentes Orbitron + Rajdhani + Share Tech Mono cargadas
- [ ] Variables CSS definidas en `:root`
- [ ] clip-path hexagonal en todos los paneles
- [ ] `systemBoot` animation en montaje de componentes
- [ ] `borderPulse` en paneles activos/en foco
- [ ] Shimmer en barras HP/MP/XP
- [ ] Scanlines overlay en todos los paneles
- [ ] Estados de quest (activa / completada / fallida) implementados
- [ ] Texto WARNING en rojo parpadeante para penalizaciones
- [ ] Modal de notificación con animación de entrada

