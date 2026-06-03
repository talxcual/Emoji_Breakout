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

function saveSessionState(jsonState) {
    if (window.AndroidInterface && window.AndroidInterface.saveSession) {
        try {
            window.AndroidInterface.saveSession(jsonState);
        } catch (e) {
            console.error("Error calling saveSession:", e);
        }
    }
}

function loadSessionState() {
    if (window.AndroidInterface && window.AndroidInterface.loadSession) {
        try {
            return window.AndroidInterface.loadSession();
        } catch (e) {
            console.error("Error calling loadSession:", e);
        }
    }
    return null;
}

function clearSessionState() {
    if (window.AndroidInterface && window.AndroidInterface.clearSession) {
        try {
            window.AndroidInterface.clearSession();
        } catch (e) {
            console.error("Error calling clearSession:", e);
        }
    }
}

// --- Android Native Interface Bridge Helpers for Economy & Buffs ---
function getDoubleScoreCount() {
    if (window.AndroidInterface && window.AndroidInterface.getDoubleScoreCount) {
        try {
            return window.AndroidInterface.getDoubleScoreCount();
        } catch (e) {
            console.error("Error calling getDoubleScoreCount:", e);
        }
    }
    let dCount = parseInt(localStorage.getItem('player_double_score_count') || '0', 10);
    return isNaN(dCount) ? 0 : dCount;
}

function saveDoubleScoreCount(count) {
    if (window.AndroidInterface && window.AndroidInterface.saveDoubleScoreCount) {
        try {
            window.AndroidInterface.saveDoubleScoreCount(count);
            return;
        } catch (e) {
            console.error("Error calling saveDoubleScoreCount:", e);
        }
    }
    localStorage.setItem('player_double_score_count', count.toString());
}

function getSuperPowerCount() {
    if (window.AndroidInterface && window.AndroidInterface.getSuperPowerCount) {
        try {
            return window.AndroidInterface.getSuperPowerCount();
        } catch (e) {
            console.error("Error calling getSuperPowerCount:", e);
        }
    }
    let sCount = parseInt(localStorage.getItem('player_super_power_count') || '0', 10);
    return isNaN(sCount) ? 0 : sCount;
}

function saveSuperPowerCount(count) {
    if (window.AndroidInterface && window.AndroidInterface.saveSuperPowerCount) {
        try {
            window.AndroidInterface.saveSuperPowerCount(count);
            return;
        } catch (e) {
            console.error("Error calling saveSuperPowerCount:", e);
        }
    }
    localStorage.setItem('player_super_power_count', count.toString());
}

function getShopFirstPurchaseTime() {
    if (window.AndroidInterface && window.AndroidInterface.getShopFirstPurchaseTime) {
        try {
            return window.AndroidInterface.getShopFirstPurchaseTime();
        } catch (e) {
            console.error("Error calling getShopFirstPurchaseTime:", e);
        }
    }
    let val = parseInt(localStorage.getItem('shop_first_purchase_time') || '0', 10);
    return isNaN(val) ? 0 : val;
}

function getShopPurchaseCountToday() {
    if (window.AndroidInterface && window.AndroidInterface.getShopPurchaseCountToday) {
        try {
            return window.AndroidInterface.getShopPurchaseCountToday();
        } catch (e) {
            console.error("Error calling getShopPurchaseCountToday:", e);
        }
    }
    let val = parseInt(localStorage.getItem('shop_purchase_count_today') || '0', 10);
    return isNaN(val) ? 0 : val;
}

function saveShopLimits(countToday, firstPurchaseTime) {
    if (window.AndroidInterface && window.AndroidInterface.saveShopLimits) {
        try {
            window.AndroidInterface.saveShopLimits(countToday, firstPurchaseTime);
            return;
        } catch (e) {
            console.error("Error calling saveShopLimits:", e);
        }
    }
    localStorage.setItem('shop_purchase_count_today', countToday.toString());
    localStorage.setItem('shop_first_purchase_time', firstPurchaseTime.toString());
}

function getLastDailyGiftClaimTime() {
    if (window.AndroidInterface && window.AndroidInterface.getLastDailyGiftClaimTime) {
        try {
            return window.AndroidInterface.getLastDailyGiftClaimTime();
        } catch (e) {
            console.error("Error calling getLastDailyGiftClaimTime:", e);
        }
    }
    let val = parseInt(localStorage.getItem('last_daily_gift_claim_time') || '0', 10);
    return isNaN(val) ? 0 : val;
}

function saveLastDailyGiftClaimTime(time) {
    if (window.AndroidInterface && window.AndroidInterface.saveLastDailyGiftClaimTime) {
        try {
            window.AndroidInterface.saveLastDailyGiftClaimTime(time);
            return;
        } catch (e) {
            console.error("Error calling saveLastDailyGiftClaimTime:", e);
        }
    }
    localStorage.setItem('last_daily_gift_claim_time', time.toString());
}

class Paddle {
    constructor(game) {
        this.game = game;
        this.width = 100; // Adjusted for Portrait (was 120)
        this.height = 20;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - 40;
        this.speed = 0;
        this.maxSpeed = 8;
        this.color = '#8b5cf6';
        this.baseWidth = 100; // Adjusted for Portrait (was 120)
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
        this.width = 55; // Adjusted for Portrait (was 60)
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
        this.type = type; // 'life', 'long', 'short', 'fireball', 'multiball', 'fast', 'inverted', 'coin'
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
            case 'coin': this.emoji = '🪙'; break;
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

            if (this.type === 'coin') {
                playSFX('coin');
            } else {
                playSFX('powerup');
            }
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
                this.game.paddleTimer = 10.0;
                break;
            case 'short':
                // Nerf: Shrink paddle
                this.game.paddle.width = this.game.paddle.baseWidth * 0.6;
                this.game.paddleTimer = 10.0;
                break;
            case 'fireball':
                // Buff: Fireball (pierce blocks)
                this.game.balls.forEach(ball => {
                    ball.isFireball = true;
                    ball.emoji = '🔥';
                });
                this.game.fireballTimer = 10.0;
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
                this.game.speedTimer = 6.0;
                break;
            case 'inverted':
                // Nerf: Inverted controls
                this.game.paddle.isInverted = true;
                this.game.paddle.color = '#dc2626'; // Visually show inverted status (Red)
                this.game.invertTimer = 8.0;
                break;
            case 'coin':
                this.game.coinsCollected++;
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
        
        // 9:16 Portrait Aspect Ratio (replaces landscape 800x600)
        this.width = 540; 
        this.height = 960;
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
        
        // Timers for power-up effects
        this.paddleTimer = 0;
        this.fireballTimer = 0;
        this.speedTimer = 0;
        this.invertTimer = 0;
        this.doubleScoreTimer = 0;

        // Screen shake settings
        this.shakeDuration = 0;
        this.shakeIntensity = 0;

        // Virtual currency and Store Buffs
        this.coinsCollected = 0;
        this.doubleScoreCount = getDoubleScoreCount();
        this.superPowerCount = getSuperPowerCount();
        this.scoreMultiplier = 1;
        this.shopOpenedFrom = 'menu'; // Track if shop opened from 'menu' or 'pause'
        this.toastTimeout = null;

        // Set global game instance reference for native bridge access
        window.gameInstance = this;

        this.setupInputs();
        this.loop = this.loop.bind(this);
        
        // Init UI components
        this.showMainMenu();
        this.updateRecordDisplay();
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

        // Resume Saved Session Button
        const resumeSessionBtn = document.getElementById('resume-session-btn');
        if (resumeSessionBtn) {
            resumeSessionBtn.addEventListener('click', () => {
                const saved = loadSessionState();
                if (saved) {
                    this.loadGameState(saved);
                }
            });
        }

        // Leaderboard (Ranking Global) Buttons
        const leaderboardBtn = document.getElementById('leaderboard-btn');
        if (leaderboardBtn) {
            leaderboardBtn.addEventListener('click', () => {
                const tbody = document.getElementById('leaderboard-tbody');
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="4" style="color: #8b5cf6; text-align: center;">Cargando Ranking...</td></tr>`;
                }
                if (window.AndroidInterface && window.AndroidInterface.fetchLeaderboard) {
                    window.AndroidInterface.fetchLeaderboard();
                } else {
                    // Mock offline data for browser testing
                    const mockData = [
                        { name: "👑 EmojiKing", maxLevel: 50, score: 25000, profilePic: "" },
                        { name: "⚡ FlashClicker", maxLevel: 42, score: 18500, profilePic: "" },
                        { name: "🧱 BrickBreaker", maxLevel: 31, score: 14300, profilePic: "" },
                        { name: "⭐ ProBreaker", maxLevel: 25, score: 10200, profilePic: "" },
                        { name: "🎮 PlayerOne", maxLevel: 18, score: 8500, profilePic: "" }
                    ];
                    setTimeout(() => {
                        this.onLeaderboardLoaded(JSON.stringify(mockData));
                    }, 500);
                }
                document.getElementById('leaderboard-screen').classList.remove('hidden');
            });
        }

        const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
        if (closeLeaderboardBtn) {
            closeLeaderboardBtn.addEventListener('click', () => {
                document.getElementById('leaderboard-screen').classList.add('hidden');
            });
        }

        // Profile (Mi Perfil) Buttons and Listeners
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.loadUserProfile();
                document.getElementById('profile-screen').classList.remove('hidden');
            });
        }

        const closeProfileBtn = document.getElementById('close-profile-btn');
        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => {
                document.getElementById('profile-screen').classList.add('hidden');
            });
        }

        const googleLoginBtn = document.getElementById('google-login-btn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => {
                if (window.AndroidInterface && window.AndroidInterface.loginWithGoogle) {
                    window.AndroidInterface.loginWithGoogle();
                } else {
                    alert("Google Login solo está disponible en la app Android.");
                }
            });
        }

        const changeAvatarBtn = document.getElementById('change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                if (window.AndroidInterface && window.AndroidInterface.selectProfilePicture) {
                    window.AndroidInterface.selectProfilePicture();
                } else {
                    alert("La selección de imagen solo está disponible en la app Android.");
                }
            });
        }

        const saveProfileBtn = document.getElementById('save-profile-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.saveUserProfile();
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.AndroidInterface && window.AndroidInterface.logout) {
                    window.AndroidInterface.logout();
                } else {
                    alert("Cerrar sesión solo está disponible en la app Android.");
                }
            });
        }

        // Shop (Tienda) Buttons and Listeners
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                this.shopOpenedFrom = 'menu';
                this.loadShop();
                document.getElementById('shop-screen').classList.remove('hidden');
            });
        }

        const pauseShopBtn = document.getElementById('pause-shop-btn');
        if (pauseShopBtn) {
            pauseShopBtn.addEventListener('click', () => {
                this.shopOpenedFrom = 'pause';
                this.loadShop();
                document.getElementById('pause-screen').classList.add('hidden');
                document.getElementById('shop-screen').classList.remove('hidden');
            });
        }

        const closeShopBtn = document.getElementById('close-shop-btn');
        if (closeShopBtn) {
            closeShopBtn.addEventListener('click', () => {
                document.getElementById('shop-screen').classList.add('hidden');
                if (this.shopOpenedFrom === 'pause') {
                    document.getElementById('pause-screen').classList.remove('hidden');
                }
            });
        }

        const buyDoubleScoreBtn = document.getElementById('buy-double-score-btn');
        if (buyDoubleScoreBtn) {
            buyDoubleScoreBtn.addEventListener('click', () => {
                this.buyShopItem('doubleScore', 50);
            });
        }

        const buySuperPowerBtn = document.getElementById('buy-super-power-btn');
        if (buySuperPowerBtn) {
            buySuperPowerBtn.addEventListener('click', () => {
                this.buyShopItem('superPower', 100);
            });
        }

        // HUD Floating Buff Activation Listeners
        const actDoubleBtn = document.getElementById('activate-double-score-btn');
        if (actDoubleBtn) {
            actDoubleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activateDoubleScoreBuff();
            });
        }

        const actSuperBtn = document.getElementById('activate-super-power-btn');
        if (actSuperBtn) {
            actSuperBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activateSuperPowerBuff();
            });
        }

        // Daily Gift Button
        const dailyGiftBtn = document.getElementById('daily-gift-btn');
        if (dailyGiftBtn) {
            dailyGiftBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.claimDailyGift();
            });
        }

        // Extra Life Modal Buttons
        const buyExtraLifeBtn = document.getElementById('buy-extra-life-btn');
        if (buyExtraLifeBtn) {
            buyExtraLifeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.buyExtraLife();
            });
        }

        const declineExtraLifeBtn = document.getElementById('decline-extra-life-btn');
        if (declineExtraLifeBtn) {
            declineExtraLifeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.declineExtraLife();
            });
        }
    }

    startGame() {
        clearSessionState(); // Reset saved state when starting fresh
        this.state = 'PLAYING';
        this.level = 1;
        this.score = 0;
        this.lives = 3;

        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('level-cleared-screen').classList.add('hidden');

        // Reset all power-up timers
        this.paddleTimer = 0;
        this.fireballTimer = 0;
        this.speedTimer = 0;
        this.invertTimer = 0;
        this.doubleScoreTimer = 0;

        this.paddle = new Paddle(this);
        this.balls = [new Ball(this)];
        this.powerUps = [];
        this.particles = [];
        this.shakeDuration = 0;

        // Reset coins collected in this run
        this.coinsCollected = 0;

        // Reset score multiplier to 1 (activated manually in game)
        this.scoreMultiplier = 1;

        // Load buff stock from localStorage to ensure latest purchases are active
        this.doubleScoreCount = getDoubleScoreCount();
        this.superPowerCount = getSuperPowerCount();

        // Show floating buff buttons
        document.getElementById('game-buffs-container').classList.remove('hidden');
        this.updateBuffButtonsUI();
        
        this.updateUI();
        this.updateRecordDisplay();
        
        startBGMusic();
        this.updateMuteButtonVisual();
        this.loadLevel(this.level);
    }

    pauseGame() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        pauseBGMusic();
        document.getElementById('pause-screen').classList.remove('hidden');
        this.saveGameState(); // Auto-save on pausing
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        startBGMusic();
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-buffs-container').classList.remove('hidden');
        this.updateBuffButtonsUI();
    }

    quitToMenu() {
        this.state = 'MENU';
        pauseBGMusic();
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-buffs-container').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        this.showMainMenu();
    }

    showMainMenu() {
        const highScore = window.AndroidInterface ? window.AndroidInterface.getHighScore() : 0;
        document.getElementById('high-score-display').textContent = highScore;
        this.updateRecordDisplay();
        document.getElementById('game-buffs-container').classList.add('hidden');

        // Update daily gift button state
        this.updateDailyGiftUI();

        const saved = loadSessionState();
        const resumeBtn = document.getElementById('resume-session-btn');
        if (resumeBtn) {
            if (saved) {
                resumeBtn.classList.remove('hidden');
            } else {
                resumeBtn.classList.add('hidden');
            }
        }
    }

    toggleMute() {
        const muted = toggleMuteState();
        document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
    }

    updateMuteButtonVisual() {
        const muted = isGameMuted();
        document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
    }

    updateRecordDisplay() {
        const highScore = window.AndroidInterface ? window.AndroidInterface.getHighScore() : 0;
        const bottomHighScore = document.getElementById('bottom-high-score-display');
        if (bottomHighScore) {
            bottomHighScore.textContent = highScore;
        }
    }

    generateLevelLayout(level) {
        const cols = 8; // Narrower grid columns (was 11)
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
                    case 7: // Alien / Invader Shape adapted to cols=8 (cSym from 0 to 3)
                        if (r === 0) shouldPlace = (cSym === 1 || cSym === 3);
                        else if (r === 1) shouldPlace = (cSym === 0 || cSym === 2);
                        else if (r === 2) shouldPlace = (cSym >= 1 && cSym <= 3);
                        else if (r === 3) shouldPlace = (cSym === 0 || cSym === 1 || cSym === 3);
                        else if (r === 4) shouldPlace = (cSym === 0 || cSym === 3);
                        else shouldPlace = (cSym % 2 === 0);
                        break;
                    case 8: // Shield / Emblem adapted to cols=8
                        if (r === 0) shouldPlace = (cSym >= 1 && cSym <= 3);
                        else if (r === 1) shouldPlace = (cSym >= 0 && cSym <= 3);
                        else if (r === 2) shouldPlace = (cSym >= 0 && cSym <= 2);
                        else if (r === 3) shouldPlace = (cSym >= 1 && cSym <= 2);
                        else if (r === 4) shouldPlace = (cSym === 2);
                        else shouldPlace = false;
                        break;
                    case 9: // Columns of rings adapted to cols=8
                        shouldPlace = (r === 0 || r === 2 || r === 4) && (cSym % 2 === 0);
                        if (r === 1 || r === 3) shouldPlace = (cSym === 0 || cSym === 3);
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
        const blockWidth = 55; // Adjusted for Portrait
        const blockHeight = 25;
        
        const totalGridWidth = cols * blockWidth + (cols - 1) * padding;
        const offsetX = (this.width - totalGridWidth) / 2;
        const offsetY = 80; // Adjusted lower to account for safe area top padding

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
            let coins = 0;
            if (window.AndroidInterface && window.AndroidInterface.getCoins) {
                coins = window.AndroidInterface.getCoins();
            } else {
                coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
            }
            
            // Player coins + coins collected in the current run
            let totalAvailableCoins = coins + this.coinsCollected;

            if (totalAvailableCoins >= 10) {
                // Pause the game loop updates temporarily
                this.state = 'PAUSED';
                pauseBGMusic();
                document.getElementById('game-buffs-container').classList.add('hidden');
                document.getElementById('extra-life-modal').classList.remove('hidden');
            } else {
                this.state = 'GAMEOVER';
                pauseBGMusic();
                this.checkAndSaveScore();
            }
        } else {
            // Reset power-up states
            this.paddle.width = this.paddle.baseWidth;
            this.paddle.isInverted = false;
            this.paddle.color = '#8b5cf6';
            this.paddleTimer = 0;
            this.fireballTimer = 0;
            this.speedTimer = 0;
            this.invertTimer = 0;
            
            // Spawn a fresh ball
            this.balls = [new Ball(this)];
            this.saveGameState(); // Save state with one less life
        }
    }

    updateUI() {
        document.getElementById('level-display').textContent = this.level;
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('lives-display').textContent = '❤️'.repeat(Math.max(0, this.lives));
        const coinsDisplay = document.getElementById('coins-display');
        if (coinsDisplay) {
            coinsDisplay.textContent = this.coinsCollected;
        }
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
                
                // Limit maximum bounce angle to 60 degrees to prevent near-horizontal bounce
                const maxAngle = 60 * Math.PI / 180;
                const angle = hitPoint * maxAngle;

                ball.speedX = speed * Math.sin(angle);
                ball.speedY = -speed * Math.cos(angle);

                // Enforce a minimum vertical velocity to guarantee the ball moves with vertical energy
                const minYVelocity = speed * 0.4; // 40% of the ball's speed
                if (Math.abs(ball.speedY) < minYVelocity) {
                    ball.speedY = -minYVelocity;
                    // Recalculate speedX to preserve the magnitude of the velocity vector
                    ball.speedX = Math.sign(ball.speedX) * Math.sqrt(speed * speed - minYVelocity * minYVelocity);
                }
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
                            // Apply score multiplier if active (Double Score buff)
                            this.score += 10 * (block.maxHealth || 1) * (this.scoreMultiplier || 1);
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

                            // Drop a coin with 15% probability
                            if (Math.random() <= 0.15) {
                                this.powerUps.push(new PowerUp(this, block.x + block.width / 2, block.y + block.height / 2, 'coin'));
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
        // Persist collected coins before moving to next level
        this.persistCollectedCoins();
        document.getElementById('game-buffs-container').classList.add('hidden');

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
            this.checkAndSaveScore();
        } else {
            this.state = 'PLAYING';
            startBGMusic();
            this.loadLevel(this.level);
            this.saveGameState(); // Auto-save at the start of the next level
            document.getElementById('game-buffs-container').classList.remove('hidden');
            this.updateBuffButtonsUI();
        }
        this.updateUI();
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        // Reduce screen shake duration
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt;
        }

        // Decrement power-up timers
        if (this.paddleTimer > 0) {
            this.paddleTimer -= dt;
            if (this.paddleTimer <= 0) {
                this.paddle.width = this.paddle.baseWidth;
            }
        }
        if (this.fireballTimer > 0) {
            this.fireballTimer -= dt;
            if (this.fireballTimer <= 0) {
                this.balls.forEach(ball => {
                    ball.isFireball = false;
                    if (ball.emoji === '🔥') ball.emoji = '🏐';
                });
            }
        }
        if (this.speedTimer > 0) {
            this.speedTimer -= dt;
            if (this.speedTimer <= 0) {
                this.balls.forEach(ball => {
                    ball.speedMultiplier = 1.0;
                    if (ball.emoji === '💀') ball.emoji = '🏐';
                });
            }
        }
        if (this.invertTimer > 0) {
            this.invertTimer -= dt;
            if (this.invertTimer <= 0) {
                this.paddle.isInverted = false;
                this.paddle.color = '#8b5cf6';
            }
        }
        if (this.doubleScoreTimer > 0) {
            this.doubleScoreTimer -= dt;
            if (this.doubleScoreTimer <= 0) {
                this.scoreMultiplier = 1;
                this.updateBuffButtonsUI();
            }
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

    saveGameState() {
        // Only save if the game is in a playable/paused state
        if (this.state !== 'PLAYING' && this.state !== 'PAUSED') return;

        const stateObj = {
            level: this.level,
            score: this.score,
            lives: this.lives,
            paddle: {
                x: this.paddle.x,
                width: this.paddle.width,
                isInverted: this.paddle.isInverted,
                color: this.paddle.color
            },
            balls: this.balls.map(ball => ({
                x: ball.x,
                y: ball.y,
                speedX: ball.speedX,
                speedY: ball.speedY,
                speedMultiplier: ball.speedMultiplier,
                damage: ball.damage,
                isFireball: ball.isFireball,
                emoji: ball.emoji,
                active: ball.active
            })),
            blocks: this.blocks.map(block => ({
                x: block.x,
                y: block.y,
                type: block.type,
                health: block.health,
                maxHealth: block.maxHealth,
                active: block.active,
                isMoving: block.isMoving,
                vx: block.vx
            })),
            timers: {
                paddleTimer: this.paddleTimer,
                fireballTimer: this.fireballTimer,
                speedTimer: this.speedTimer,
                invertTimer: this.invertTimer,
                doubleScoreTimer: this.doubleScoreTimer
            },
            scoreMultiplier: this.scoreMultiplier,
            doubleScoreCount: this.doubleScoreCount,
            superPowerCount: this.superPowerCount
        };

        saveSessionState(JSON.stringify(stateObj));
    }

    loadGameState(jsonString) {
        try {
            const state = JSON.parse(jsonString);
            if (!state) return false;

            this.level = state.level;
            this.score = state.score;
            this.lives = state.lives;

            this.paddle = new Paddle(this);
            this.paddle.x = state.paddle.x;
            this.paddle.width = state.paddle.width;
            this.paddle.isInverted = state.paddle.isInverted;
            this.paddle.color = state.paddle.color;

            this.balls = state.balls.map(bData => {
                const ball = new Ball(this);
                ball.x = bData.x;
                ball.y = bData.y;
                ball.speedX = bData.speedX;
                ball.speedY = bData.speedY;
                ball.speedMultiplier = bData.speedMultiplier;
                ball.damage = bData.damage;
                ball.isFireball = bData.isFireball;
                ball.emoji = bData.emoji;
                ball.active = bData.active;
                return ball;
            });

            this.blocks = state.blocks.map(bData => {
                const block = new Block(this, bData.x, bData.y, bData.type, bData.health);
                block.maxHealth = bData.maxHealth;
                block.active = bData.active;
                block.isMoving = bData.isMoving;
                block.vx = bData.vx;
                return block;
            });

            if (state.timers) {
                this.paddleTimer = state.timers.paddleTimer || 0;
                this.fireballTimer = state.timers.fireballTimer || 0;
                this.speedTimer = state.timers.speedTimer || 0;
                this.invertTimer = state.timers.invertTimer || 0;
                this.doubleScoreTimer = state.timers.doubleScoreTimer || 0;
            } else {
                this.paddleTimer = 0;
                this.fireballTimer = 0;
                this.speedTimer = 0;
                this.invertTimer = 0;
                this.doubleScoreTimer = 0;
            }

            this.scoreMultiplier = state.scoreMultiplier || 1;
            // Always retrieve global stock from localStorage to prevent overwrite from stale session saves
            this.doubleScoreCount = getDoubleScoreCount();
            this.superPowerCount = getSuperPowerCount();

            this.powerUps = [];
            this.particles = [];
            this.shakeDuration = 0;

            this.state = 'PLAYING';
            this.updateUI();
            startBGMusic();
            this.updateMuteButtonVisual();

            // Display floating buffs HUD
            document.getElementById('game-buffs-container').classList.remove('hidden');
            this.updateBuffButtonsUI();

            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('game-over-screen').classList.add('hidden');
            document.getElementById('win-screen').classList.add('hidden');
            document.getElementById('pause-screen').classList.add('hidden');
            document.getElementById('level-cleared-screen').classList.add('hidden');

            return true;
        } catch (e) {
            console.error("Error parsing/loading saved state:", e);
            return false;
        }
    }

    checkAndSaveScore() {
        // Persist collected coins before saving scores
        this.persistCollectedCoins();

        const currentHighScore = window.AndroidInterface ? window.AndroidInterface.getHighScore() : 0;
        
        // Si hay una nueva puntuación récord, se solicita el apodo
        if (this.score > currentHighScore && window.AndroidInterface) {
            const savedNickname = window.AndroidInterface.getPlayerNickname() || "";
            document.getElementById('nickname-input').value = savedNickname;
            
            // Ocultar otras overlays y mostrar modal del apodo
            document.getElementById('game-over-screen').classList.add('hidden');
            document.getElementById('win-screen').classList.add('hidden');
            document.getElementById('nickname-modal').classList.remove('hidden');
            
            // Vincular evento al botón de guardado
            const saveBtn = document.getElementById('save-nickname-btn');
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            
            newSaveBtn.addEventListener('click', () => {
                let nickname = document.getElementById('nickname-input').value.trim();
                if (!nickname) nickname = "JugadorAnónimo";
                
                // Guardar local y en la nube con la foto de perfil actual
                const profilePic = window.AndroidInterface.getPlayerProfilePic() || "";
                window.AndroidInterface.saveProgressWithProfile(this.level, this.score, nickname, profilePic);
                clearSessionState();
                this.updateRecordDisplay();
                
                // Ocultar modal del apodo
                document.getElementById('nickname-modal').classList.add('hidden');
                
                // Mostrar pantalla final correspondiente
                this.showEndScreen();
            });
        } else {
            // Guardado tradicional
            saveGameProgress(this.level, this.score);
            clearSessionState();
            this.updateRecordDisplay();
            this.showEndScreen();
        }
    }

    showEndScreen() {
        document.getElementById('game-buffs-container').classList.add('hidden');
        if (this.state === 'GAMEOVER') {
            document.getElementById('final-score').textContent = this.score;
            document.getElementById('game-over-screen').classList.remove('hidden');
        } else if (this.state === 'VICTORY') {
            document.getElementById('win-screen').classList.remove('hidden');
        }
    }

    onLeaderboardLoaded(jsonString) {
        try {
            const list = JSON.parse(jsonString);
            const tbody = document.getElementById('leaderboard-tbody');
            if (!tbody) return;

            if (list.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay puntuaciones registradas aún. ¡Sé el primero!</td></tr>`;
                return;
            }

            let html = "";
            list.forEach((entry, index) => {
                let position = index + 1;
                let medal = position;
                if (position === 1) medal = "🥇";
                else if (position === 2) medal = "🥈";
                else if (position === 3) medal = "🥉";

                let avatarSrc = entry.profilePic || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";

                html += `
                    <tr>
                        <td>${medal}</td>
                        <td style="text-align: left; padding-left: 10px;">
                            <img class="leaderboard-avatar" src="${avatarSrc}" alt="Avatar">
                            ${this.escapeHtml(entry.name)}
                        </td>
                        <td>${entry.maxLevel}</td>
                        <td style="color: #eab308; font-weight: bold;">${entry.score}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (e) {
            console.error("Error al procesar el JSON del Leaderboard:", e);
            const tbody = document.getElementById('leaderboard-tbody');
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="4" style="color: #ef4444; text-align: center;">Error al cargar el ranking.</td></tr>`;
            }
        }
    }

    onLeaderboardError(errorMsg) {
        const tbody = document.getElementById('leaderboard-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" style="color: #ef4444; text-align: center;">Error: ${this.escapeHtml(errorMsg)}</td></tr>`;
        }
    }

    loadUserProfile() {
        let authJson = {};
        if (window.AndroidInterface && window.AndroidInterface.getAuthStatus) {
            try {
                authJson = JSON.parse(window.AndroidInterface.getAuthStatus());
            } catch (e) {
                console.error("Error parsing auth status:", e);
            }
        }

        let nickname = "";
        let profilePic = "";
        let email = localStorage.getItem('player_email') || "";

        if (window.AndroidInterface) {
            nickname = window.AndroidInterface.getPlayerNickname() || "";
            profilePic = window.AndroidInterface.getPlayerProfilePic() || "";
        }

        // Fallbacks
        if (!nickname && authJson.name) nickname = authJson.name;
        if (!profilePic && authJson.photoUrl) profilePic = authJson.photoUrl;
        if (!email && authJson.email) email = authJson.email;

        const nameInput = document.getElementById('profile-name-input');
        if (nameInput) nameInput.value = nickname;

        const emailInput = document.getElementById('profile-email-input');
        if (emailInput) emailInput.value = email;

        const preview = document.getElementById('profile-avatar-preview');
        if (preview) {
            preview.src = profilePic || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";
        }

        const googleLoginBtn = document.getElementById('google-login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (authJson.provider === 'google') {
            if (googleLoginBtn) googleLoginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            if (googleLoginBtn) googleLoginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
        }
    }

    saveUserProfile() {
        const nameInput = document.getElementById('profile-name-input');
        const emailInput = document.getElementById('profile-email-input');
        const preview = document.getElementById('profile-avatar-preview');

        let nickname = nameInput ? nameInput.value.trim() : "";
        if (!nickname) nickname = "JugadorAnónimo";

        let email = emailInput ? emailInput.value.trim() : "";
        let avatarSrc = preview ? preview.src : "";
        let profilePic = avatarSrc.startsWith("data:image/svg+xml") ? "" : avatarSrc;

        if (window.AndroidInterface && window.AndroidInterface.saveUserProfile) {
            window.AndroidInterface.saveUserProfile(nickname, profilePic);
        }
        localStorage.setItem('player_email', email);

        alert("¡Perfil guardado correctamente!");
        document.getElementById('profile-screen').classList.add('hidden');
        this.updateRecordDisplay();
    }

    onProfilePictureSelected(base64Image) {
        const preview = document.getElementById('profile-avatar-preview');
        if (preview) {
            preview.src = base64Image;
        }
    }

    onAuthSuccess(userJsonString) {
        try {
            const user = JSON.parse(userJsonString);

            const nameInput = document.getElementById('profile-name-input');
            if (nameInput) nameInput.value = user.name || "";

            const emailInput = document.getElementById('profile-email-input');
            if (emailInput) emailInput.value = user.email || "";

            if (user.email) {
                localStorage.setItem('player_email', user.email);
            }

            const preview = document.getElementById('profile-avatar-preview');
            if (preview) {
                preview.src = user.photoUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";
            }

            const googleLoginBtn = document.getElementById('google-login-btn');
            const logoutBtn = document.getElementById('logout-btn');

            if (user.provider === 'google') {
                if (googleLoginBtn) googleLoginBtn.classList.add('hidden');
                if (logoutBtn) logoutBtn.classList.remove('hidden');
            } else {
                if (googleLoginBtn) googleLoginBtn.classList.remove('hidden');
                if (logoutBtn) logoutBtn.classList.add('hidden');
            }

            if (window.AndroidInterface && window.AndroidInterface.saveUserProfile) {
                let profilePic = (user.photoUrl && !user.photoUrl.startsWith("data:image/svg+xml")) ? user.photoUrl : "";
                window.AndroidInterface.saveUserProfile(user.name || "Jugador de Google", profilePic);
            }

            alert("¡Sesión iniciada con éxito!");
        } catch (e) {
            console.error("Error al procesar onAuthSuccess:", e);
        }
    }

    onAuthLogout() {
        const nameInput = document.getElementById('profile-name-input');
        if (nameInput) nameInput.value = "";

        const emailInput = document.getElementById('profile-email-input');
        if (emailInput) emailInput.value = "";

        localStorage.removeItem('player_email');

        const preview = document.getElementById('profile-avatar-preview');
        if (preview) {
            preview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";
        }

        const googleLoginBtn = document.getElementById('google-login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (googleLoginBtn) googleLoginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');

        if (window.AndroidInterface && window.AndroidInterface.saveUserProfile) {
            window.AndroidInterface.saveUserProfile("", "");
        }

        alert("Sesión cerrada.");
    }

    onAuthError(message) {
        alert("Error de autenticación: " + message);
    }

    persistCollectedCoins() {
        if (this.coinsCollected > 0) {
            let currentCoins = 0;
            if (window.AndroidInterface && window.AndroidInterface.getCoins) {
                currentCoins = window.AndroidInterface.getCoins();
            } else {
                currentCoins = parseInt(localStorage.getItem('player_coins') || '0', 10);
            }
            
            const newTotal = currentCoins + this.coinsCollected;
            
            if (window.AndroidInterface && window.AndroidInterface.saveCoins) {
                window.AndroidInterface.saveCoins(newTotal);
            } else {
                localStorage.setItem('player_coins', newTotal.toString());
            }
            
            this.coinsCollected = 0; // Reset after persisting
        }
    }

    loadShop() {
        let coins = 0;
        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        const display = document.getElementById('shop-coins-display');
        if (display) display.textContent = coins;

        // Ensure we load the latest stock from bridge/localStorage before showing details
        this.doubleScoreCount = getDoubleScoreCount();
        this.superPowerCount = getSuperPowerCount();

        let firstPurchaseTime = getShopFirstPurchaseTime();
        let countToday = getShopPurchaseCountToday();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        // Reset rolling window if 24 hours have passed
        if (firstPurchaseTime !== 0 && Date.now() - firstPurchaseTime >= ONE_DAY) {
            firstPurchaseTime = 0;
            countToday = 0;
            saveShopLimits(countToday, firstPurchaseTime);
        }
        
        let dailyLimitReached = false;
        let limitMsg = "";
        if (firstPurchaseTime !== 0 && Date.now() - firstPurchaseTime < ONE_DAY && countToday >= 5) {
            dailyLimitReached = true;
            let timeRemaining = ONE_DAY - (Date.now() - firstPurchaseTime);
            let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            limitMsg = ` (Límite hoy: ${countToday}/5 - Espera ${hours}h ${minutes}m)`;
        } else {
            limitMsg = ` (Límite hoy: ${countToday}/5)`;
        }

        const titleText = document.querySelector('#shop-screen h1');
        if (titleText) {
            titleText.innerHTML = `TIENDA DE BUFFS<br><span style="font-size: 0.85rem; color: #94a3b8; font-weight: normal;">${limitMsg}</span>`;
        }

        // Update purchase buttons based on counts and limits
        const buyDoubleBtn = document.getElementById('buy-double-score-btn');
        if (buyDoubleBtn) {
            buyDoubleBtn.innerHTML = `50 🪙<br><span style="font-size: 0.7rem; color: rgba(255,255,255,0.7); font-weight: normal;">En Stock: ${this.doubleScoreCount}</span>`;
            buyDoubleBtn.disabled = coins < 50 || dailyLimitReached;
        }

        const buySuperBtn = document.getElementById('buy-super-power-btn');
        if (buySuperBtn) {
            buySuperBtn.innerHTML = `100 🪙<br><span style="font-size: 0.7rem; color: rgba(255,255,255,0.7); font-weight: normal;">En Stock: ${this.superPowerCount}</span>`;
            buySuperBtn.disabled = coins < 100 || dailyLimitReached;
        }
    }

    buyShopItem(itemId, cost) {
        let coins = 0;
        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        if (coins < cost) {
            alert("No tienes suficientes monedas.");
            return;
        }

        // Daily purchase limit (rolling 24 hours)
        let firstPurchaseTime = getShopFirstPurchaseTime();
        let countToday = getShopPurchaseCountToday();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        if (firstPurchaseTime === 0 || Date.now() - firstPurchaseTime >= ONE_DAY) {
            firstPurchaseTime = Date.now();
            countToday = 0;
            saveShopLimits(countToday, firstPurchaseTime);
        }

        if (countToday >= 5) {
            let timeRemaining = ONE_DAY - (Date.now() - firstPurchaseTime);
            let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            alert(`Límite diario alcanzado. Debes esperar ${hours}h ${minutes}m para volver a comprar.`);
            return;
        }

        coins -= cost;
        countToday++;

        if (window.AndroidInterface && window.AndroidInterface.saveCoins) {
            window.AndroidInterface.saveCoins(coins);
        } else {
            localStorage.setItem('player_coins', coins.toString());
        }

        saveShopLimits(countToday, firstPurchaseTime);

        if (itemId === 'doubleScore') {
            this.doubleScoreCount++;
            saveDoubleScoreCount(this.doubleScoreCount);
        } else if (itemId === 'superPower') {
            this.superPowerCount++;
            saveSuperPowerCount(this.superPowerCount);
        }

        playSFX('shop');
        this.loadShop(); // Reload UI
    }

    updateBuffButtonsUI() {
        const doubleBadge = document.getElementById('double-score-count-badge');
        if (doubleBadge) doubleBadge.textContent = this.doubleScoreCount;

        const superBadge = document.getElementById('super-power-count-badge');
        if (superBadge) superBadge.textContent = this.superPowerCount;
        
        const doubleBtn = document.getElementById('activate-double-score-btn');
        if (doubleBtn) {
            // Keep button enabled, adjust opacity to indicate availability
            doubleBtn.style.opacity = (this.doubleScoreCount <= 0) ? "0.35" : "0.85";
            if (this.scoreMultiplier === 2) {
                doubleBtn.style.background = "rgba(16, 185, 129, 0.4)";
                doubleBtn.style.borderColor = "#10b981";
                doubleBtn.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.5)";
            } else {
                doubleBtn.style.background = "rgba(255, 255, 255, 0.12)";
                doubleBtn.style.borderColor = "rgba(255, 255, 255, 0.25)";
                doubleBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }
        }

        const superBtn = document.getElementById('activate-super-power-btn');
        if (superBtn) {
            // Keep button enabled, adjust opacity to indicate availability
            superBtn.style.opacity = (this.superPowerCount <= 0) ? "0.35" : "0.85";
            if (this.paddleTimer > 0 || this.fireballTimer > 0) {
                superBtn.style.background = "rgba(245, 158, 11, 0.4)";
                superBtn.style.borderColor = "#f59e0b";
                superBtn.style.boxShadow = "0 0 15px rgba(245, 158, 11, 0.5)";
            } else {
                superBtn.style.background = "rgba(255, 255, 255, 0.12)";
                superBtn.style.borderColor = "rgba(255, 255, 255, 0.25)";
                superBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
            }
        }
    }

    activateDoubleScoreBuff() {
        if (this.doubleScoreCount <= 0) {
            this.showBuffToast("Sin fichas x2 en stock");
            return;
        }
        if (this.scoreMultiplier === 2) {
            this.showBuffToast("¡X2 ya está activo!");
            return;
        }
        this.doubleScoreCount--;
        saveDoubleScoreCount(this.doubleScoreCount);
        
        this.scoreMultiplier = 2;
        this.doubleScoreTimer = 15.0;
        this.showBuffToast(`¡X2 ACTIVADO! (Quedan: ${this.doubleScoreCount})`);
        playSFX('powerup');
        this.updateBuffButtonsUI();
        this.saveGameState(); // Save game state to persist the active multiplier
    }

    activateSuperPowerBuff() {
        if (this.superPowerCount <= 0) {
            this.showBuffToast("Sin buffs en stock");
            return;
        }
        if (this.paddleTimer > 0 || this.fireballTimer > 0) {
            this.showBuffToast("¡Buff ya activo!");
            return;
        }
        this.superPowerCount--;
        saveSuperPowerCount(this.superPowerCount);
        
        // Choose one of the two randomly (Paddle size OR Fireball)
        if (Math.random() < 0.5) {
            this.paddle.width = this.paddle.baseWidth * 1.6;
            this.paddleTimer = 15.0; // active for 15s
        } else {
            this.balls.forEach(ball => {
                ball.isFireball = true;
                ball.emoji = '🔥';
            });
            this.fireballTimer = 15.0; // active for 15s
        }
        this.showBuffToast(`¡BUFF ACTIVADO! (Quedan: ${this.superPowerCount})`);
        playSFX('powerup');
        this.updateBuffButtonsUI();
        this.saveGameState(); // Save game state to persist the active super power timers
    }

    showBuffToast(message) {
        const toast = document.getElementById('buff-toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.remove('buff-toast-hidden');
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                toast.classList.add('buff-toast-hidden');
            }, 2000);
        }
    }

    escapeHtml(str) {
        if (!str) return "";
        return str.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    buyExtraLife() {
        let coins = 0;
        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        // Persist collected coins so they are added to total, then deduct 10
        this.persistCollectedCoins();

        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        if (coins >= 10) {
            coins -= 10;
            if (window.AndroidInterface && window.AndroidInterface.saveCoins) {
                window.AndroidInterface.saveCoins(coins);
            } else {
                localStorage.setItem('player_coins', coins.toString());
            }

            this.lives = 1;
            this.coinsCollected = 0; // Reset run coins since we persisted them

            document.getElementById('extra-life-modal').classList.add('hidden');
            document.getElementById('game-buffs-container').classList.remove('hidden');

            this.state = 'PLAYING';
            this.paddle.width = this.paddle.baseWidth;
            this.paddle.isInverted = false;
            this.paddle.color = '#8b5cf6';
            this.paddleTimer = 0;
            this.fireballTimer = 0;
            this.speedTimer = 0;
            this.invertTimer = 0;

            this.balls = [new Ball(this)];
            this.updateUI();
            this.saveGameState();
            playSFX('shop');
            startBGMusic();
        } else {
            this.declineExtraLife();
        }
    }

    declineExtraLife() {
        document.getElementById('extra-life-modal').classList.add('hidden');
        this.state = 'GAMEOVER';
        startBGMusic();
        this.checkAndSaveScore();
    }

    updateDailyGiftUI() {
        const giftBtn = document.getElementById('daily-gift-btn');
        if (!giftBtn) return;

        const lastClaim = getLastDailyGiftClaimTime();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        if (lastClaim !== 0 && Date.now() - lastClaim < ONE_DAY) {
            giftBtn.classList.add('claimed');
            giftBtn.title = "Regalo ya cobrado hoy";
        } else {
            giftBtn.classList.remove('claimed');
            giftBtn.title = "Cobrar regalo diario de 50 monedas";
        }
    }

    claimDailyGift() {
        const lastClaim = getLastDailyGiftClaimTime();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        if (lastClaim !== 0 && Date.now() - lastClaim < ONE_DAY) {
            let timeRemaining = ONE_DAY - (Date.now() - lastClaim);
            let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            alert(`Ya has cobrado tu regalo de hoy. Debes esperar ${hours}h ${minutes}m.`);
            return;
        }

        let coins = 0;
        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        coins += 50;

        if (window.AndroidInterface && window.AndroidInterface.saveCoins) {
            window.AndroidInterface.saveCoins(coins);
        } else {
            localStorage.setItem('player_coins', coins.toString());
        }

        saveLastDailyGiftClaimTime(Date.now());

        playSFX('shop');
        this.updateDailyGiftUI();

        const shopCoinsDisplay = document.getElementById('shop-coins-display');
        if (shopCoinsDisplay) {
            shopCoinsDisplay.textContent = coins;
        }

        alert("has cobrado tus 50 monedas de regalo diarias ");
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
