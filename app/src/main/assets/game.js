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
    }

    update(mouseX) {
        if (mouseX !== undefined) {
            this.x = mouseX - this.width / 2;
        }

        // Clamp to screen
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.roundRect(this.x + 5, this.y + 2, this.width - 10, this.height / 2 - 2, 5);
        ctx.fill();
    }
}

class Ball {
    constructor(game) {
        this.game = game;
        this.size = 24; // Emoji size
        this.reset();
        this.emoji = '🏐'; // Default ball emoji
        this.speedMultiplier = 1;
        this.damage = 1;
    }

    reset() {
        this.x = this.game.width / 2;
        this.y = this.game.height - 60;
        this.speedX = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.speedY = -4;
        this.active = false; // Waiting for launch
        this.speedMultiplier = 1;
        this.damage = 1;
        this.emoji = '🏐';
    }

    update() {
        if (!this.active) {
            this.x = this.game.paddle.x + this.game.paddle.width / 2;
            this.y = this.game.paddle.y - 30;
            return;
        }

        this.x += this.speedX * this.speedMultiplier;
        this.y += this.speedY * this.speedMultiplier;

        // Wall collisions
        if (this.x < 0 + 10 || this.x > this.game.width - 10) {
            this.speedX *= -1;
            this.x = this.x < 10 ? 10 : this.game.width - 10;
        }
        if (this.y < 0 + 10) {
            this.speedY *= -1;
            this.y = 10;
        }

        // Bottom collision (Death)
        if (this.y > this.game.height) {
            this.game.loseLife();
        }
    }

    draw(ctx) {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

class Block {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 30;
        this.type = type;
        this.active = true;

        // Colors based on type/row
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
        this.color = colors[type % colors.length];
        this.health = 1;
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner bevel
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class PowerUp {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type; // 'life', 'strength', 'energy', 'long', 'fast'
        this.speedY = 3;
        this.active = true;

        switch (type) {
            case 'life': this.emoji = '❤️'; break;
            case 'strength': this.emoji = '💪'; break;
            case 'energy': this.emoji = '🔋'; break;
            case 'long': this.emoji = '📏'; break;
            case 'fast': this.emoji = '⚡'; break;
        }
    }

    update() {
        this.y += this.speedY;

        if (this.y > this.game.height) {
            this.active = false;
        }

        // Collision with paddle
        if (this.active &&
            this.y + 15 >= this.game.paddle.y &&
            this.y - 15 <= this.game.paddle.y + this.game.paddle.height &&
            this.x >= this.game.paddle.x &&
            this.x <= this.game.paddle.x + this.game.paddle.width) {

            this.applyEffect();
            this.active = false;
        }
    }

    applyEffect() {
        switch (this.type) {
            case 'life':
                this.game.lives++;
                break;
            case 'strength':
                this.game.ball.damage = 2;
                this.game.ball.emoji = '💪';
                setTimeout(() => {
                    this.game.ball.damage = 1;
                    this.game.ball.emoji = '🏐';
                }, 10000);
                break;
            case 'energy':
                this.game.score += 500; // Simple bonus for now
                break;
            case 'long':
                this.game.paddle.width = this.game.paddle.baseWidth * 1.5;
                setTimeout(() => {
                    this.game.paddle.width = this.game.paddle.baseWidth;
                }, 10000);
                break;
            case 'fast':
                // Making paddle faster doesn't make sense with mouse control, so let's make ball faster?
                // Or maybe "Paddle Speed" in the prompt meant "Ball Speed"?
                // Let's make the paddle slightly wider AND the ball slightly faster for a "Power Mode" feel
                this.game.ball.speedMultiplier = 1.5;
                this.game.ball.emoji = '⚡';
                setTimeout(() => {
                    this.game.ball.speedMultiplier = 1;
                    this.game.ball.emoji = '🏐';
                }, 10000);
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
        this.ball = new Ball(this);
        this.blocks = [];
        this.powerUps = [];

        this.setupInputs();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    setupInputs() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const mouseX = (e.clientX - rect.left) * scaleX;
            this.paddle.update(mouseX);
        });

        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const touchX = (e.touches[0].clientX - rect.left) * scaleX;
            this.paddle.update(touchX);
        }, { passive: false });

        this.canvas.addEventListener('click', () => {
            if (this.state === 'PLAYING' && !this.ball.active) {
                this.ball.active = true;
            }
        });

        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state === 'PLAYING' && !this.ball.active) {
                this.ball.active = true;
                e.preventDefault();
            }
        }, { passive: false });

        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
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

        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        this.powerUps = [];
        this.loadLevel(this.level);
    }

    loadLevel(level) {
        this.blocks = [];
        this.powerUps = [];
        this.ball.reset();

        // 10 Levels Logic
        const rows = Math.min(8, 3 + Math.floor(level / 2));
        const cols = 10;
        const padding = 10;
        const blockWidth = 60;
        const blockHeight = 30;
        const offsetX = (this.width - (cols * (blockWidth + padding))) / 2 + 35;
        const offsetY = 60;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let shouldPlace = false;

                // Level Patterns
                switch (level) {
                    case 1: shouldPlace = true; break; // Full block
                    case 2: shouldPlace = (r + c) % 2 === 0; break; // Checkerboard
                    case 3: shouldPlace = r % 2 === 0; break; // Stripes
                    case 4: shouldPlace = c % 2 === 0; break; // Columns
                    case 5: shouldPlace = (r === 0 || r === rows - 1 || c === 0 || c === cols - 1); break; // Box
                    case 6: shouldPlace = (r + c) % 3 === 0; break; // Diagonals
                    case 7: shouldPlace = Math.random() > 0.3; break; // Random holes
                    case 8: shouldPlace = (c >= r && c <= cols - 1 - r); break; // Pyramid
                    case 9: shouldPlace = (c <= r || c >= cols - 1 - r); break; // Inverted Pyramid
                    case 10: shouldPlace = true; break; // Boss level (Full block again but maybe harder logic if we had block health)
                }

                if (shouldPlace) {
                    this.blocks.push(new Block(this, (c * (blockWidth + padding)) + offsetX - 30, (r * (blockHeight + padding)) + offsetY, r));
                }
            }
        }
    }

    loseLife() {
        this.lives--;
        this.updateUI();
        if (this.lives <= 0) {
            this.state = 'GAMEOVER';
            document.getElementById('final-score').textContent = this.score;
            document.getElementById('game-over-screen').classList.remove('hidden');
        } else {
            this.ball.reset();
        }
    }

    updateUI() {
        document.getElementById('level-display').textContent = this.level;
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('lives-display').textContent = '❤️'.repeat(this.lives);
    }

    spawnPowerUp(x, y) {
        if (Math.random() > 0.15) return; // 15% chance

        const types = ['life', 'strength', 'energy', 'long', 'fast'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push(new PowerUp(this, x, y, type));
    }

    checkCollisions() {
        // Paddle collision
        if (this.ball.y + 12 >= this.paddle.y &&
            this.ball.y - 12 <= this.paddle.y + this.paddle.height &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {

            this.ball.speedY = -Math.abs(this.ball.speedY);

            // Add some english based on where it hit the paddle
            let hitPoint = this.ball.x - (this.paddle.x + this.paddle.width / 2);
            this.ball.speedX = hitPoint * 0.15;
        }

        // Block collision
        this.blocks.forEach(block => {
            if (!block.active) return;

            if (this.ball.x + 12 > block.x &&
                this.ball.x - 12 < block.x + block.width &&
                this.ball.y + 12 > block.y &&
                this.ball.y - 12 < block.y + block.height) {

                block.active = false;
                this.ball.speedY *= -1;
                this.score += 10;
                this.updateUI();
                this.spawnPowerUp(block.x + block.width / 2, block.y + block.height / 2);

                // Check win level
                if (this.blocks.every(b => !b.active)) {
                    this.levelUp();
                }
            }
        });
    }

    levelUp() {
        this.level++;
        if (this.level > 10) {
            this.state = 'VICTORY';
            document.getElementById('win-screen').classList.remove('hidden');
        } else {
            this.loadLevel(this.level);
        }
        this.updateUI();
    }

    update() {
        if (this.state !== 'PLAYING') return;

        this.ball.update();
        this.paddle.update(); // Ensure paddle stays in bounds even if mouse doesn't move
        this.powerUps.forEach(p => p.update());
        this.checkCollisions();

        // Cleanup powerups
        this.powerUps = this.powerUps.filter(p => p.active);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.state === 'PLAYING') {
            this.paddle.draw(this.ctx);
            this.ball.draw(this.ctx);
            this.blocks.forEach(block => block.draw(this.ctx));
            this.powerUps.forEach(p => p.draw(this.ctx));
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop);
    }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
