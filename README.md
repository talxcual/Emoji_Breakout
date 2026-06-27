# Emoji Breakout 🎮🧱

<p align="center">
  <img src="screenshots/1.png" width="180" alt="Pantalla Principal"/>
  &nbsp;&nbsp;
  <img src="screenshots/2.png" width="180" alt="Gameplay"/>
  &nbsp;&nbsp;
  <img src="screenshots/3.png" width="180" alt="Power-ups"/>
  &nbsp;&nbsp;
  <img src="screenshots/4.png" width="180" alt="Tienda"/>
</p>

<p align="center">
  <strong>Un arcade rompe-ladrillos con estética neón, ranking global en tiempo real y poderes devastadores.</strong>
</p>

---

## ¿Qué es Emoji Breakout?

**Emoji Breakout** es un juego Android de estilo Breakout/Arkanoid construido sobre un WebView de alto rendimiento. Combina físicas fluidas en HTML5 Canvas con lógica nativa en Kotlin, integrando Firebase para rankings globales, una tienda de mejoras y un sistema de logros por rachas perfectas.

> 50 niveles. 5 zonas. Solo un campeón.

---

## ✨ Características

- 🧱 **50 Niveles Progresivos** — Velocidad y diseño de bloques crecen en dificultad por zona
- 🪨 **Bloques Especiales** — Indestructibles, Diamante (3 golpes) y Comunes (2 golpes)
- 🔀 **Bloques Móviles** — A partir del nivel 20 los bloques se desplazan lateralmente
- ⚡ **Power-ups y Debuffs** — Bola de Fuego, Multi-bola, Paleta Larga/Corta, Velocidad Extrema, Controles Invertidos
- 🛒 **Tienda de Mejoras** — Compra power-ups con monedas recolectadas en partida
- 🏆 **Ranking Global** — Clasificación mundial en tiempo real con Firebase Realtime Database
- 🏅 **Sistema de Logros** — Insignias Z1–Z5 por completar zonas enteras sin perder vidas
- 👤 **Perfiles y Foto** — Autenticación con foto de perfil visible en el ranking
- 🎵 **Audio Nativo** — SFX de baja latencia con SoundPool y música de fondo con MediaPlayer

---

## 📱 Pantallas

| Ranking | Niveles | Logros | Gameplay |
|------|----------|--------|---------|
| <img src="screenshots/5.png" width="180"/> | <img src="screenshots/6.png" width="180"/> | <img src="screenshots/7.png" width="180"/> | <img src="screenshots/8.png" width="180"/> |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Kotlin** | Lógica nativa Android, ciclo de vida y puente JS |
| **HTML5 Canvas + JavaScript** | Motor de físicas, animaciones y bucle del juego |
| **CSS3** | UI con estética neón, gradientes y animaciones |
| **WebView (Android)** | Renderizado del juego a alta velocidad |
| **Firebase Realtime Database** | Ranking global y sincronización de récords |
| **SoundPool / MediaPlayer** | Audio nativo de baja latencia |
| **@JavascriptInterface** | Puente de comunicación JS ↔ Kotlin |

---

## 🎨 Diseño

La UI está inspirada en la estética arcade competitiva moderna:
- **Fondo:** Dark mode con gradientes oscuros profundos
- **Acentos:** Neón verde, azul eléctrico y dorado vibrante
- **Tipografía:** Press Start 2P (pixelada retro) + Orbitron
- **Efectos:** Partículas al romper bloques, glow en insignias de logros
- **Ranking:** Insignias compactas de zona (Z1–Z5) alineadas con las filas

---

## 📂 Estructura del Proyecto

```
app/
├── src/main/assets/
│   ├── index.html               # UI del juego: menús, tienda, overlays
│   ├── style.css                # Estilos neón, leaderboard, badges
│   └── game.js                  # Motor de físicas, Firebase RTDB, GameLoop
└── src/main/java/com/ktoledo/emoji_breakout/
    ├── MainActivity.kt          # Entry point, WebView, ciclo de vida
    ├── GameInterface.kt         # @JavascriptInterface (puente JS ↔ Kotlin)
    └── SoundManager.kt          # Audio nativo con SoundPool y MediaPlayer
```

---

## 📈 Mejoras Completadas

- [x] Ranking global en tiempo real con Firebase RTDB
- [x] Tienda de ítems virtuales y sistema de monedas
- [x] Insignias de racha perfecta por zona (Z1 a Z5) en el ranking
- [x] Nivel Bonus tras completar zona sin perder vidas
- [x] Bola de Fuego y Bola Extra como power-ups comprables

## 🔮 Próximamente

- [ ] Más niveles con bloques de gravedad
- [ ] Editor de niveles personalizado desde la interfaz web

---

## 📜 Licencia

Proyecto privado — **Emoji Breakout** © 2026. Todos los derechos reservados.

---

<p align="center">
  Hecho con 🕹️ y mucho neón en Chile.
</p>
