with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update update(dt)
old_update = """    update(dt) {
        if (this.state !== 'PLAYING') return;"""

new_update = """    update(dt) {
        if (this.state === 'END_SEQUENCE') {
            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].update(dt);
            }
            return;
        }
        if (this.state !== 'PLAYING') return;"""

content = content.replace(old_update, new_update)

# 2. Update draw()
old_draw = """        if (this.state === 'PLAYING' || this.state === 'PAUSED') {"""

new_draw = """        if (this.state === 'PLAYING' || this.state === 'PAUSED') {""" # (we keep the old one, but add else if after the block)
# Actually, let's find the closing brace of the if block:
# }
# 
#         this.ctx.restore();
#     }

# Let's replace the whole draw method or do it specifically.
# Let's inspect the draw method end block:
#             for (this.i = 0; this.i < this.particlePool.length; this.i++) {
#                 if (this.particlePool[this.i].active) this.particlePool[this.i].draw(this.ctx);
#             }
#         }
# 
#         this.ctx.restore();

old_draw_end = """            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].draw(this.ctx);
            }
        }

        this.ctx.restore();"""

new_draw_end = """            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].draw(this.ctx);
            }
        } else if (this.state === 'END_SEQUENCE') {
            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].draw(this.ctx);
            }
        }

        this.ctx.restore();"""

content = content.replace(old_draw_end, new_draw_end)

# 3. Update triggerEndGameSequence()
old_trigger = """    triggerEndGameSequence() {
        this.state = 'END_SEQUENCE';
        getCachedElement('beta-thanks-screen').classList.remove('hidden');
        if (typeof playSFX === 'function') playSFX('powerup');

        let explosionTicks = 0;
        let explosionInterval = setInterval(() => {
            if (this.state !== 'END_SEQUENCE') {
                clearInterval(explosionInterval);
                return;
            }
            for (let i = 0; i < 8; i++) {
                this.createParticles(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    '#fbbf24', 20
                );
            }
            if (typeof playSFX === 'function') playSFX('brickHit');
            explosionTicks++;
            if (explosionTicks > 8) clearInterval(explosionInterval);
        }, 500);"""

new_trigger = """    triggerEndGameSequence() {
        this.state = 'END_SEQUENCE';
        getCachedElement('beta-thanks-screen').classList.remove('hidden');
        if (typeof playSFX === 'function') playSFX('powerup');

        let explosionTicks = 0;
        const colors = ['#fbbf24', '#00f0ff', '#ff007f', '#39ff14', '#ff5f1f', '#bd00ff'];
        let explosionInterval = setInterval(() => {
            if (this.state !== 'END_SEQUENCE') {
                clearInterval(explosionInterval);
                return;
            }
            for (let i = 0; i < 4; i++) {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                this.spawnParticles(
                    Math.random() * this.width,
                    Math.random() * this.height,
                    randomColor, 20
                );
            }
            if (typeof playSFX === 'function') playSFX('brickHit');
            explosionTicks++;
            if (explosionTicks > 8) clearInterval(explosionInterval);
        }, 500);"""

content = content.replace(old_trigger, new_trigger)

with open("game.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated game.js loops and triggerEndGameSequence")
