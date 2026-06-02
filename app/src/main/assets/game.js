// --- Android Native Interface Bridge Helpers ---
function playSFX(name) {
    if (window.AndroidInterface) {
        try {
            window.AndroidInterface.playSFX(name);
        } catch (e) {
            console.error("Error calling playSFX:", e);
        }
    }
}

function startBGMusic() {
    if (window.AndroidInterface) {
        try {
            window.AndroidInterface.startMusic();
        } catch (e) {
            console.error("Error calling startMusic:", e);
        }
    }
}

function pauseBGMusic() {
    if (window.AndroidInterface) {
        try {
            window.AndroidInterface.pauseMusic();
        } catch (e) {
            console.error("Error calling pauseMusic:", e);
        }
    }
}

function toggleMuteState() {
    if (window.AndroidInterface) {
        try {
            return window.AndroidInterface.toggleMute();
        } catch (e) {
            console.error("Error calling toggleMute:", e);
        }
    }
    return false;
}

function isGameMuted() {
    if (window.AndroidInterface) {
        try {
            return window.AndroidInterface.isMuted();
        } catch (e) {
            console.error("Error calling isMuted:", e);
        }
    }
    return false;
}

function saveGameProgress(level, score) {
    if (window.AndroidInterface) {
        try {
            window.AndroidInterface.saveProgress(level, score);
        } catch (e) {
            console.error("Error calling saveProgress:", e);
        }
    }
}

class Paddle {
    constructor(game) {
        this.game = game;
        this.width = 120;
        this.height = 20;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - 40;
        this.speed = 0;
        this.maxSpeed = 8;
        this.color = '#8b5cf6';
        this.baseWidth = 120;
        this.isInverted = false;
    }

    update(mouseX) {
        if (mouseX !== undefined) {
            if (this.isInverted) {
                // Inverted paddle movement relative to screen center
                this.x = (this.game.width - mouseX) - this.width / 2;
            } else {
                this.x = mouseX - this.width / 2;
            }
        }

        // Clamp to screen bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;
    }

    draw(ctx) {
        // Neon Glow effect
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.roundRect(this.x + 5, this.y + 2, this.width - 10, this.height / 2 - 2, 5);
        ctx.fill();
    }
}

class Ball {
    constructor(game) {
        this.game = game;
        this.size = 24; // Ball diameter / Emoji size
        this.radius = this.size / 2;
        this.emoji = '🏐'; // Default ball emoji
        this.speedMultiplier = 1;
        this.damage = 1;
        this.isFireball = false;
        
        // Elastic squash & stretch animation factors
        this.stretchX = 1.0;
        this.stretchY = 1.0;
        
        this.reset();
    }

    reset() {
        this.x = this.game.width / 2;
        this.y = this.game.height - 60;
        
        // Base speed in pixels per second
        // Progressively increases with level
        const levelSpeedMultiplier = 1 + Math.min(0.8, (this.game.level - 1) * 0.05); // +5% speed per level, capped at +80%
        const baseSpeed = 480 * levelSpeedMultiplier;
        
        // Launch at an angle between 35 and 55 degrees from vertical
        const angle = (35 + Math.random() * 20) * Math.PI / 180;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        this.speedX = baseSpeed * Math.sin(angle) * direction;
        this.speedY = -baseSpeed * Math.cos(angle);
        
        this.active = false; // Waiting for launch
        this.speedMultiplier = 1;
        this.damage = 1;
        this.isFireball = false;
        this.emoji = '🏐';
        
        this.stretchX = 1.0;
        this.stretchY = 1.0;
    }

    squash(horizontal = false) {
        if (horizontal) {
            this.stretchX = 0.55;
            this.stretchY = 1.45;
        } else {
            this.stretchX = 1.45;
            this.stretchY = 0.55;
        }
    }

    clone() {
        const b = new Ball(this.game);
        b.x = this.x;
        b.y = this.y;
        b.speedMultiplier = this.speedMultiplier;
        b.damage = this.damage;
        b.isFireball = this.isFireball;
        b.emoji = this.emoji;
        b.active = true;

        // Redirect with a slight deviation (+/- 15 degrees)
        const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        const angle = Math.atan2(this.speedX, -this.speedY) + (Math.random() * 0.5 - 0.25);
        
        b.speedX = speed * Math.sin(angle);
        b.speedY = -speed * Math.cos(angle);

        return b;
    }

    update(dt) {
        if (!this.active) {
            this.x = this.game.paddle.x + this.game.paddle.width / 2;
            this.y = this.game.paddle.y - this.radius - 5;
            return;
        }

        // Apply movement using delta time
        this.x += this.speedX * this.speedMultiplier * dt;
        this.y += this.speedY * this.speedMultiplier * dt;

        // Smoothly interpolate squash/stretch back to normal 1.0
        this.stretchX += (1.0 - this.stretchX) * 15 * dt;
        this.stretchY += (1.0 - this.stretchY) * 15 * dt;

        // Wall collisions (Left/Right)
        if (this.x - this.radius < 0) {
            this.speedX = Math.abs(this.speedX);
            this.x = this.radius;
            this.squash(true);
            playSFX('bounce');
        } else if (this.x + this.radius > this.game.width) {
            this.speedX = -Math.abs(this.speedX);
            this.x = this.game.width - this.radius;
            this.squash(true);
            playSFX('bounce');
        }

        // Wall collisions (Top)
        if (this.y - this.radius < 0) {
            this.speedY = Math.abs(this.speedY);
            this.y = this.radius;
            this.squash(false);
            playSFX('bounce');
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.stretchX, this.stretchY);

        // Flash shadow effect on impact squeeze
        if (Math.abs(this.stretchX - 1.0) > 0.15) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#ffffff';
        }

        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();
    }
}

class Block {
    constructor(game, x, y, type, health = 1) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 25;
        this.type = type;
        this.active = true;
        this.maxHealth = health;
        this.health = health;

        // Moving blocks mechanic (levels >= 20).
        // 25% of breakable blocks move horizontally in upper levels
        this.isMoving = (game.level >= 20 && health !== Infinity && (x + y) % 4 === 0);
        this.vx = this.isMoving ? (Math.random() > 0.5 ? 90 : -90) : 0; // speed in pixels per second

        this.updateAppearance();
    }

    updateAppearance() {
        if (this.health === Infinity) {
            this.color = '#475569'; // Dark Slate Gray (indestructible)
            this.emoji = '🪨';
        } else if (this.health === 3) {
            this.color = '#0891b2'; // Cyan/Diamond (3 hits)
            this.emoji = '💎';
        } else if (this.health === 2) {
            this.color = '#ea580c'; // Dark orange (2 hits)
            this.emoji = '🧱';
        } else {
            // health = 1
            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
            this.color = colors[this.type % colors.length];
            const emojis = ['❤️', '🍊', '🍋', '🍏', '⚽', '🍇', '🌸'];
            this.emoji = emojis[this.type % emojis.length];
        }
    }

    onHit() {
        this.updateAppearance();
    }

    update(dt) {
        if (!this.active || !this.isMoving) return;

        this.x += this.vx * dt;

        // Bounce back if touching boundaries (with 10px buffer)
        if (this.x < 10) {
            this.vx = Math.abs(this.vx);
            this.x = 10;
        } else if (this.x + this.width > this.game.width - 10) {
            this.vx = -Math.abs(this.vx);
            this.x = this.game.width - this.width - 10;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Draw block base with rounded rect and glow
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 5);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset glow

        // Inner bevel/border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw emoji inside block
        ctx.font = "16px serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);

        // Draw cracks for damaged blocks
        if (this.health === 2 && this.maxHealth === 3) {
            // Mild crack
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 6);
            ctx.lineTo(this.x + 20, this.y + 18);
            ctx.stroke();
        } else if (this.health === 1 && this.maxHealth >= 2) {
            // Heavy crack
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 6);
            ctx.lineTo(this.x + 22, this.y + 18);
            ctx.lineTo(this.x + 35, this.y + 10);
            ctx.lineTo(this.x + 50, this.y + 20);
            ctx.stroke();
        }
    }
}

class PowerUp {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type; // 'life', 'long', 'short', 'fireball', 'multiball', 'fast', 'inverted'
        this.speedY = 180; // Speed in pixels per second
        this.active = true;

        switch (type) {
            case 'life': this.emoji = '❤️'; break;
            case 'long': this.emoji = '📏'; break;
            case 'short': this.emoji = '🤏'; break;
            case 'fireball': this.emoji = '🔥'; break;
            case 'multiball': this.emoji = '🔮'; break;
            case 'fast': this.emoji = '💀'; break;
            case 'inverted': this.emoji = '🌀'; break;
        }
    }

    update(dt) {
        this.y += this.speedY * dt;

        if (this.y - 15 > this.game.height) {
            this.active = false;
        }

        // Collision with paddle
        if (this.active &&
            this.y + 15 >= this.game.paddle.y &&
            this.y - 15 <= this.game.paddle.y + this.game.paddle.height &&
            this.x >= this.game.paddle.x &&
            this.x <= this.game.paddle.x + this.game.paddle.width) {

            playSFX('powerup');
            this.applyEffect();
            this.active = false;
        }
    }

    applyEffect() {
        switch (this.type) {
            case 'life':
                this.game.lives++;
                break;
            case 'long':
                // Buff: Grow paddle
                this.game.paddle.width = this.game.paddle.baseWidth * 1.6;
                if (this.game.paddleTimeout) clearTimeout(this.game.paddleTimeout);
                this.game.paddleTimeout = setTimeout(() => {
                    this.game.paddle.width = this.game.paddle.baseWidth;
                }, 10000);
                break;
            case 'short':
                // Nerf: Shrink paddle
                this.game.paddle.width = this.game.paddle.baseWidth * 0.6;
                if (this.game.paddleTimeout) clearTimeout(this.game.paddleTimeout);
                this.game.paddleTimeout = setTimeout(() => {
                    this.game.paddle.width = this.game.paddle.baseWidth;
                }, 10000);
                break;
            case 'fireball':
                // Buff: Fireball (pierce blocks)
                this.game.balls.forEach(ball => {
                    ball.isFireball = true;
                    ball.emoji = '🔥';
                });
                if (this.game.fireballTimeout) clearTimeout(this.game.fireballTimeout);
                this.game.fireballTimeout = setTimeout(() => {
                    this.game.balls.forEach(ball => {
                        ball.isFireball = false;
                        if (ball.emoji === '🔥') ball.emoji = '🏐';
                    });
                }, 10000);
                break;
            case 'multiball':
                // Buff: 2 Extra balls
                if (this.game.balls.length > 0) {
                    const baseBall = this.game.balls[0];
                    if (!baseBall.active) baseBall.active = true;
                    
                    const ball1 = baseBall.clone();
                    const ball2 = baseBall.clone();
                    this.game.balls.push(ball1, ball2);
                }
                break;
            case 'fast':
                // Nerf: Dangerous speed
                this.game.balls.forEach(ball => {
                    ball.speedMultiplier = 1.7;
                    ball.emoji = '💀';
                });
                if (this.game.speedTimeout) clearTimeout(this.game.speedTimeout);
                this.game.speedTimeout = setTimeout(() => {
                    this.game.balls.forEach(ball => {
                        ball.speedMultiplier = 1.0;
                        if (ball.emoji === '💀') ball.emoji = '🏐';
                    });
                }, 6000); // 6 seconds
                break;
            case 'inverted':
                // Nerf: Inverted controls
                this.game.paddle.isInverted = true;
                this.game.paddle.color = '#dc2626'; // Visually show inverted status (Red)
                if (this.game.invertTimeout) clearTimeout(this.game.invertTimeout);
                this.game.invertTimeout = setTimeout(() => {
                    this.game.paddle.isInverted = false;
                    this.game.paddle.color = '#8b5cf6'; // Restore color
                }, 8000); // 8 seconds
                break;
        }
        this.game.updateUI();
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.font = "24px serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        
        // Random particle dimensions
        this.size = Math.random() * 4 + 2;
        
        // Velocities in pixels/second
        this.speedX = (Math.random() - 0.5) * 160; 
        this.speedY = (Math.random() - 0.7) * 180; 
        
        this.gravity = 350; // Gravity downward
        this.alpha = 1.0;
        this.lifeTime = Math.random() * 0.4 + 0.4; // 0.4s to 0.8s
        this.active = true;
    }

    update(dt) {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
        this.speedY += this.gravity * dt;

        // Fade out
        this.alpha -= dt / this.lifeTime;
        if (this.alpha <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Mini glow for particles
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.state = 'MENU';
        this.level = 1;
        this.score = 0;
        this.lives = 3;

        this.paddle = new Paddle(this);
        this.balls = [new Ball(this)]; // Multiple balls list
        this.blocks = [];
        this.powerUps = [];
        this.particles = [];
        
        // Time tracking for Delta Time
        this.lastTime = 0;
        
        // Timeouts for power-up effects
        this.paddleTimeout = null;
        this.fireballTimeout = null;
        this.speedTimeout = null;
        this.invertTimeout = null;

        // Screen shake settings
        this.shakeDuration = 0;
        this.shakeIntensity = 0;

        this.setupInputs();
        this.loop = this.loop.bind(this);
        
        // Init UI components
        this.showMainMenu();
        this.updateMuteButtonVisual();
        
        requestAnimationFrame((timestamp) => {
            this.lastTime = timestamp;
            requestAnimationFrame(this.loop);
        });
    }

    triggerShake(duration, intensity) {
        this.shakeDuration = duration;
        this.shakeIntensity = intensity;
    }

    setupInputs() {
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.state !== 'PLAYING') return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const mouseX = (e.clientX - rect.left) * scaleX;
            this.paddle.update(mouseX);
        });

        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.state !== 'PLAYING') return;
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const touchX = (e.touches[0].clientX - rect.left) * scaleX;
            this.paddle.update(touchX);
        }, { passive: false });

        this.canvas.addEventListener('click', () => {
            if (this.state === 'PLAYING') {
                this.balls.forEach(ball => {
                    if (!ball.active) ball.active = true;
                });
            }
        });

        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state === 'PLAYING') {
                let launched = false;
                this.balls.forEach(ball => {
                    if (!ball.active) {
                        ball.active = true;
                        launched = true;
                    }
                });
                if (launched) e.preventDefault();
            }
        }, { passive: false });

        // HUD Listeners
        document.getElementById('pause-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.pauseGame();
        });
        document.getElementById('mute-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });

        // Overlay Listeners
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('resume-btn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-pause-btn').addEventListener('click', () => {
            this.resumeGame();
            this.startGame();
        });
        document.getElementById('quit-btn').addEventListener('click', () => this.quitToMenu());
        document.getElementById('next-level-btn').addEventListener('click', () => this.loadNextLevel());
        
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document.getElementById('play-again-btn').addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.state = 'PLAYING';
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.updateUI();

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('level-cleared-screen').classList.add('hidden');

        // Clear all timeouts
        if (this.paddleTimeout) clearTimeout(this.paddleTimeout);
        if (this.fireballTimeout) clearTimeout(this.fireballTimeout);
        if (this.speedTimeout) clearTimeout(this.speedTimeout);
        if (this.invertTimeout) clearTimeout(this.invertTimeout);

        this.paddle = new Paddle(this);
        this.balls = [new Ball(this)];
        this.powerUps = [];
        this.particles = [];
        this.shakeDuration = 0;
        
        startBGMusic();
        this.updateMuteButtonVisual();
        this.loadLevel(this.level);
    }

    pauseGame() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        pauseBGMusic();
        document.getElementById('pause-screen').classList.remove('hidden');
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        startBGMusic();
        document.getElementById('pause-screen').classList.add('hidden');
    }

    quitToMenu() {
        this.state = 'MENU';
        pauseBGMusic();
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        this.showMainMenu();
    }

    showMainMenu() {
        const highScore = window.AndroidInterface ? window.AndroidInterface.getHighScore() : 0;
        document.getElementById('high-score-display').textContent = highScore;
    }

    toggleMute() {
        const muted = toggleMuteState();
        document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
    }

    updateMuteButtonVisual() {
        const muted = isGameMuted();
        document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
    }

    generateLevelLayout(level) {
        const cols = 11;
        // Rows grow from 4 to 9 as level increases
        const rows = Math.min(9, 4 + Math.floor((level - 1) / 10));
        const layout = [];
        
        // Select pattern type based on level (10 pattern types cycled)
        const patternType = (level - 1) % 10;
        
        for (let r = 0; r < rows; r++) {
            layout[r] = [];
            for (let c = 0; c < cols; c++) {
                let shouldPlace = false;
                
                const cSym = Math.min(c, cols - 1 - c);
                
                switch (patternType) {
                    case 0: // Full grid (or simple border for level > 25)
                        if (level < 25) {
                            shouldPlace = true;
                        } else {
                            shouldPlace = (r === 0 || r === rows - 1 || c === 0 || c === cols - 1);
                        }
                        break;
                    case 1: // Checkerboard
                        shouldPlace = (r + c) % 2 === 0;
                        break;
                    case 2: // Horizontal stripes
                        shouldPlace = r % 2 === 0;
                        break;
                    case 3: // Vertical stripes
                        shouldPlace = c % 2 !== 0;
                        break;
                    case 4: // Pyramid
                        shouldPlace = (c >= r && c <= cols - 1 - r);
                        break;
                    case 5: // Hourglass / Inverted pyramid
                        shouldPlace = (c <= r || c >= cols - 1 - r);
                        break;
                    case 6: // X-Shape + Center lines (Cross)
                        shouldPlace = (c === r || c === cols - 1 - r || c === Math.floor(cols / 2) || r === Math.floor(rows / 2));
                        break;
                    case 7: // Alien / Invader Shape
                        if (r === 0) shouldPlace = (cSym === 2 || cSym === 4 || cSym === 5);
                        else if (r === 1) shouldPlace = (cSym === 1 || cSym === 3 || cSym === 5);
                        else if (r === 2) shouldPlace = (cSym >= 2 && cSym <= 5);
                        else if (r === 3) shouldPlace = (cSym === 0 || cSym === 2 || cSym === 4 || cSym === 5);
                        else if (r === 4) shouldPlace = (cSym === 0 || cSym === 5);
                        else shouldPlace = (cSym % 2 === 0);
                        break;
                    case 8: // Shield / Emblem
                        if (r === 0) shouldPlace = (cSym >= 1 && cSym <= 4);
                        else if (r === 1) shouldPlace = (cSym >= 0 && cSym <= 5);
                        else if (r === 2) shouldPlace = (cSym >= 0 && cSym <= 4);
                        else if (r === 3) shouldPlace = (cSym >= 1 && cSym <= 3);
                        else if (r === 4) shouldPlace = (cSym >= 2 && cSym <= 2);
                        else shouldPlace = false;
                        break;
                    case 9: // Columns of rings
                        shouldPlace = (r === 0 || r === 2 || r === 4) && (cSym % 2 === 0);
                        if (r === 1 || r === 3) shouldPlace = (cSym === 0 || cSym === 5);
                        break;
                }
                layout[r][c] = shouldPlace;
            }
        }
        return { rows, cols, layout };
    }

    determineBlockHealth(level, r, c, rows, cols) {
        const cSym = Math.min(c, cols - 1 - c);
        
        // 1. Indestructible block placement (starts at level 10)
        if (level >= 10) {
            // Keep obstacles symmetrical and in safe areas (never on bottom row)
            if (r > 0 && r < rows - 1) {
                // Specific conditions for obstacles
                if (level % 5 === 0 && r % 2 === 1 && cSym === 2) {
                    return Infinity;
                }
                if (level % 7 === 0 && r % 2 === 0 && cSym === 0) {
                    return Infinity;
                }
                // Center blocks in later levels
                if (level >= 25 && r === Math.floor(rows / 2) && c === Math.floor(cols / 2)) {
                    return Infinity;
                }
            }
        }
        
        // 2. Health distribution based on level
        const hash = (level * 17 + r * 13 + cSym * 31) % 100;
        
        let p3 = 0; // Chance of 3-hit block
        let p2 = 0; // Chance of 2-hit block
        
        if (level >= 35) {
            p3 = 20;
            p2 = 45;
        } else if (level >= 20) {
            p3 = 10;
            p2 = 35;
        } else if (level >= 8) {
            p3 = 0;
            p2 = 25;
        }
        
        if (hash < p3) {
            return 3;
        } else if (hash < (p3 + p2)) {
            return 2;
        }
        
        return 1;
    }

    loadLevel(level) {
        this.blocks = [];
        this.powerUps = [];
        this.particles = [];
        
        // Clear power-up states
        this.paddle.width = this.paddle.baseWidth;
        this.paddle.isInverted = false;
        this.paddle.color = '#8b5cf6';
        
        this.balls = [new Ball(this)];

        const { rows, cols, layout } = this.generateLevelLayout(level);
        const padding = 6;
        const blockWidth = 60;
        const blockHeight = 25;
        
        const totalGridWidth = cols * blockWidth + (cols - 1) * padding;
        const offsetX = (this.width - totalGridWidth) / 2;
        const offsetY = 60;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (layout[r][c]) {
                    const health = this.determineBlockHealth(level, r, c, rows, cols);
                    const blockX = offsetX + c * (blockWidth + padding);
                    const blockY = offsetY + r * (blockHeight + padding);
                    this.blocks.push(new Block(this, blockX, blockY, r, health));
                }
            }
        }
    }

    loseLife() {
        this.lives--;
        this.updateUI();
        this.triggerShake(0.45, 18);
        playSFX('lost');
        
        if (this.lives <= 0) {
            this.state = 'GAMEOVER';
            pauseBGMusic();
            saveGameProgress(this.level, this.score);
            document.getElementById('final-score').textContent = this.score;
            document.getElementById('game-over-screen').classList.remove('hidden');
        } else {
            // Clean up power-up states
            this.paddle.width = this.paddle.baseWidth;
            this.paddle.isInverted = false;
            this.paddle.color = '#8b5cf6';
            
            // Spawn a fresh ball
            this.balls = [new Ball(this)];
        }
    }

    updateUI() {
        document.getElementById('level-display').textContent = this.level;
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('lives-display').textContent = '❤️'.repeat(Math.max(0, this.lives));
    }

    spawnPowerUp(x, y) {
        if (Math.random() > 0.18) return; // 18% chance

        const types = ['life', 'long', 'short', 'fireball', 'multiball', 'fast', 'inverted'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push(new PowerUp(this, x, y, type));
    }

    checkCollisions() {
        const paddle = this.paddle;
        
        this.balls.forEach(ball => {
            const radius = ball.radius;

            // 1. Paddle collision (Circle to Rectangle)
            const closestPaddleX = Math.max(paddle.x, Math.min(ball.x, paddle.x + paddle.width));
            const closestPaddleY = Math.max(paddle.y, Math.min(ball.y, paddle.y + paddle.height));

            const distPaddleX = ball.x - closestPaddleX;
            const distPaddleY = ball.y - closestPaddleY;
            const distPaddleSq = distPaddleX * distPaddleX + distPaddleY * distPaddleY;

            if (distPaddleSq < radius * radius) {
                ball.y = paddle.y - radius;
                ball.squash(false); // Squash vertically on paddle hit
                playSFX('bounce');

                const speed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
                const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2); // -1 to 1
                const maxAngle = 72 * Math.PI / 180;
                const angle = hitPoint * maxAngle;

                ball.speedX = speed * Math.sin(angle);
                ball.speedY = -speed * Math.cos(angle);
            }

            // 2. Block collision (Circle to Rectangle with Side-Specific Bounce)
            this.blocks.forEach(block => {
                if (!block.active) return;

                const closestBlockX = Math.max(block.x, Math.min(ball.x, block.x + block.width));
                const closestBlockY = Math.max(block.y, Math.min(ball.y, block.y + block.height));

                const distBlockX = ball.x - closestBlockX;
                const distBlockY = ball.y - closestBlockY;
                const distBlockSq = distBlockX * distBlockX + distBlockY * distBlockY;

                if (distBlockSq < radius * radius) {
                    let sideHitHorizontal = false;

                    // Fireball piercing logic: fireball does NOT bounce on breakable blocks, but DOES bounce on indestructible ones
                    if (!ball.isFireball || block.health === Infinity) {
                        const dist = Math.sqrt(distBlockSq) || 0.001;
                        const overlapX = radius - Math.abs(distBlockX);
                        const overlapY = radius - Math.abs(distBlockY);

                        if (distBlockX === 0) {
                            ball.speedY = (ball.y < block.y) ? -Math.abs(ball.speedY) : Math.abs(ball.speedY);
                            ball.y += (ball.y < block.y) ? -overlapY : overlapY;
                        } else if (distBlockY === 0) {
                            ball.speedX = (ball.x < block.x) ? -Math.abs(ball.speedX) : Math.abs(ball.speedX);
                            ball.x += (ball.x < block.x) ? -overlapX : overlapX;
                            sideHitHorizontal = true;
                        } else {
                            if (overlapX < overlapY) {
                                ball.speedX = (ball.x < block.x) ? -Math.abs(ball.speedX) : Math.abs(ball.speedX);
                                ball.x += (ball.x < block.x) ? -overlapX : overlapX;
                                sideHitHorizontal = true;
                            } else {
                                ball.speedY = (ball.y < block.y) ? -Math.abs(ball.speedY) : Math.abs(ball.speedY);
                                ball.y += (ball.y < block.y) ? -overlapY : overlapY;
                            }
                        }
                    }

                    // Apply squash/stretch to ball
                    ball.squash(sideHitHorizontal);

                    // Handle damage, screen shake, particles, and score
                    if (block.health !== Infinity) {
                        block.health -= ball.damage;
                        if (block.health <= 0) {
                            block.active = false;
                            this.score += 10 * (block.maxHealth || 1);
                            this.updateUI();
                            
                            playSFX('brick');

                            // Trigger screen shake based on brick weight
                            if (block.maxHealth >= 3) {
                                this.triggerShake(0.2, 9);
                            } else if (block.maxHealth === 2) {
                                this.triggerShake(0.14, 5);
                            } else {
                                this.triggerShake(0.08, 3);
                            }

                            // Spawn particle explosion of brick color
                            const particleCount = 12 + Math.floor(Math.random() * 8);
                            for (let i = 0; i < particleCount; i++) {
                                this.particles.push(new Particle(this, block.x + block.width / 2, block.y + block.height / 2, block.color));
                            }

                            this.spawnPowerUp(block.x + block.width / 2, block.y + block.height / 2);
                        } else {
                            // Non-lethal hit: small impact shake
                            this.triggerShake(0.08, 2);
                            playSFX('bounce');
                            block.onHit();

                            // Small dust particle burst
                            for (let i = 0; i < 4; i++) {
                                this.particles.push(new Particle(this, closestBlockX, closestBlockY, block.color));
                            }
                        }
                    } else {
                        // Impact against indestructible obstacle block
                        this.triggerShake(0.08, 3.5);
                        playSFX('bounce');
                        
                        // Spawn sparks/dust particles
                        for (let i = 0; i < 5; i++) {
                            this.particles.push(new Particle(this, closestBlockX, closestBlockY, '#94a3b8'));
                        }
                    }

                    // Check level win criteria
                    const breakablesLeft = this.blocks.some(b => b.active && b.health !== Infinity);
                    if (!breakablesLeft) {
                        this.levelUp();
                    }
                }
            });
        });
    }

    levelUp() {
        // Save progress to Shared Preferences
        saveGameProgress(this.level + 1, this.score);

        this.state = 'LEVEL_CLEARED';
        pauseBGMusic();
        playSFX('powerup');

        document.getElementById('cleared-score').textContent = this.score;
        document.getElementById('level-cleared-screen').classList.remove('hidden');
    }

    loadNextLevel() {
        document.getElementById('level-cleared-screen').classList.add('hidden');
        this.level++;
        if (this.level > 50) {
            this.state = 'VICTORY';
            document.getElementById('win-screen').classList.remove('hidden');
        } else {
            this.state = 'PLAYING';
            startBGMusic();
            this.loadLevel(this.level);
        }
        this.updateUI();
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        // Reduce screen shake duration
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt;
        }

        // Update moving blocks in levels >= 20
        this.blocks.forEach(block => block.update(dt));

        // Update all balls
        this.balls.forEach(ball => ball.update(dt));
        
        // Update paddle, powerups, and particles
        this.paddle.update();
        this.powerUps.forEach(p => p.update(dt));
        this.particles.forEach(p => p.update(dt));
        
        this.checkCollisions();

        // Remove balls that fall below screen
        this.balls = this.balls.filter(ball => ball.y - ball.radius <= this.height);
        
        // If all balls are lost, lose a life
        if (this.balls.length === 0) {
            this.loseLife();
        }

        this.powerUps = this.powerUps.filter(p => p.active);
        this.particles = this.particles.filter(p => p.active);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();

        // Apply Screen Shake if active
        if (this.shakeDuration > 0) {
            const dx = (Math.random() - 0.5) * this.shakeIntensity;
            const dy = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(dx, dy);
        }

        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
            this.paddle.draw(this.ctx);
            this.balls.forEach(ball => ball.draw(this.ctx));
            this.blocks.forEach(block => block.draw(this.ctx));
            this.powerUps.forEach(p => p.draw(this.ctx));
            this.particles.forEach(p => p.draw(this.ctx));
        }

        this.ctx.restore();
    }

    loop(timestamp) {
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to prevent massive jumps on lag spikes
        if (dt > 0.1) dt = 0.1;

        this.update(dt);
        this.draw();
        requestAnimationFrame(this.loop);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
