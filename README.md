# 🎮 Emoji Breakout

¡Bienvenido a **Emoji Breakout**! Este es un emocionante juego de estilo Breakout (rompe-ladrillos) diseñado para dispositivos Android, que combina la flexibilidad del desarrollo web (HTML5 Canvas + CSS3 + JavaScript) con la potencia de Kotlin nativo.

El juego cuenta con un total de **50 niveles** de dificultad progresiva, mecánicas interactivas de bloques móviles, físicas fluidas con deformación elástica de la bola, y efectos visuales de partículas.

---

## 🚀 Características Principales

### 🕹️ Jugabilidad Avanzada
* **50 Niveles Progresivos**: La velocidad de la bola y la complejidad del diseño de los bloques aumentan en cada nivel.
* **Bloques Especiales**:
  * 🪨 **Ladrillo Indestructible** (`Infinity` de vida): Bloques de roca que no se pueden romper.
  * 💎 **Ladrillo de Diamante** (3 golpes): Cambia de aspecto y se agrieta progresivamente con el daño.
  * 🧱 **Ladrillo Común** (2 golpes): Ladrillo resistente que requiere dos impactos.
  * 🍓🍊🍋🍏 **Ladrillos Simples** (1 golpe): Ladrillos de colores con frutas u objetos.
* **Bloques Móviles**: A partir del nivel 20, un porcentaje de los bloques se desplaza lateralmente para añadir dificultad.
* **Efectos de Partículas**: Animaciones de partículas al destruir bloques basadas en el color y tipo de bloque roto.

### ⚡ Power-ups y Debuffs (Efectos Especiales)
Al romper ciertos bloques, caerán ítems con efectos temporales que alteran el juego:
* ❤️ **Vida Extra (`life`)**: Añade un corazón a tus vidas disponibles.
* 📏 **Paleta Larga (`long`)**: Incrementa el tamaño de la barra en un 60% por 10 segundos.
* 🤏 **Paleta Corta (`short`)**: *Debuff* que reduce el tamaño de la barra en un 40% por 10 segundos.
* 🔥 **Bola de Fuego (`fireball`)**: La bola adquiere el emoji de fuego y atraviesa todos los bloques destruyéndolos de un solo golpe durante 10 segundos.
* 🔮 **Multi-bola (`multiball`)**: Duplica tu bola actual creando dos copias más en juego.
* 💀 **Velocidad Extrema (`fast`)**: *Debuff* que acelera la bola un 1.7x durante 6 segundos.
* 🌀 **Controles Invertidos (`inverted`)**: *Debuff* que invierte el movimiento de la barra (y la tiñe de color rojo) por 8 segundos.

### 📱 Integración Nativa Android (Kotlin ⇄ JavaScript)
El juego se renderiza en un `WebView` de alto rendimiento y se comunica con el sistema nativo a través de una interfaz de puente (`AndroidInterface`):
* **Sistema de Audio Nativo**: Controlado en Kotlin por un `SoundManager` nativo usando `SoundPool` para baja latencia (SFX de rebotes, golpes, pérdidas de vida y power-ups) y `MediaPlayer` para música de fondo en bucle.
* **Control de Música inteligente**: Pausa automáticamente la música de fondo si la aplicación pasa a segundo plano (`onPause`) y la reanuda al volver al primer plano (`onResume`).
* **Progreso de Juego**: Guardado y carga persistente del récord de puntuación y el nivel máximo alcanzado en el almacenamiento local con `SharedPreferences`.
* **Sincronización en la Nube (Mock)**: Estructura preparada mediante `ScoreRepository` y `FirebaseScoreRepository` para integrar fácilmente servicios en la nube como Firebase Firestore para tablas de clasificación global.

---

## 🛠️ Arquitectura y Estructura del Proyecto

El repositorio está organizado de la siguiente manera:

* **`/app/src/main/assets/`** - Contiene los recursos frontend del juego:
  * `index.html` - Interfaz principal del juego y overlays de menús.
  * `style.css` - Estilos modernos con paleta de colores vibrantes y soporte responsivo.
  * `game.js` - Núcleo del motor de físicas, animaciones en Canvas y el bucle del juego (`GameLoop`).
* **`/app/src/main/java/com/ktoledo/emoji_breakout/`** - Código fuente Kotlin nativo de Android:
  * `MainActivity.kt` - Punto de entrada principal que carga el `WebView` y conecta la app al ciclo de vida del sistema.
  * `GameInterface.kt` - El puente `@JavascriptInterface` que permite a JavaScript ejecutar funciones del dispositivo móvil.
  * `SoundManager.kt` - Administrador de sonidos y audio en segundo plano usando APIs nativas.
  * `ScoreRepository.kt` - Interfaz y mock de base de datos para almacenar récords locales e integrarse con Firebase en la nube.

---

## ⚙️ Configuración y Requisitos

### Requisitos Previos
* **Android Studio** (Koala o más reciente recomendado)
* **Android SDK** (Min API 26+)
* **JDK 17**

### Pasos para Ejecutar
1. Clona el repositorio:
   ```bash
   git clone https://github.com/talxcual/Emoji_Breakout.git
   ```
2. Abre el proyecto en **Android Studio**.
3. Deja que Gradle cargue e instale las dependencias del proyecto de forma automática.
4. Conecta un dispositivo físico o ejecuta un Emulador de Android.
5. Haz clic en **Run app** (botón verde de reproducción) para compilar y disfrutar del juego.

---

## 📈 Futuras Mejoras
* [ ] Conectar la base de datos de Firestore en `FirebaseScoreRepository` para activar el ranking global en tiempo real.
* [ ] Agregar más niveles interactivos y bloques con físicas de gravedad.
* [ ] Implementar un editor de niveles personalizado desde la interfaz web.
