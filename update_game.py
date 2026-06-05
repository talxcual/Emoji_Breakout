import sys

with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update loadNextLevel()
old_level_check = """        if (this.level > 50) {
            this.state = 'VICTORY';
            this.checkAndSaveScore();
        } else {"""
new_level_check = """        if (this.level > 50) {
            this.triggerEndGameSequence();
        } else {"""
content = content.replace(old_level_check, new_level_check)

# 2. Add triggerEndGameSequence and showCreditsScreen to Game class
# Find the end of loop(timestamp)
end_loop = """    loop(timestamp) {
        this.dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to prevent massive jumps on lag spikes (continuous collision safety)
        if (this.dt > 0.05) this.dt = 0.05;

        this.update(this.dt);
        this.draw();
        requestAnimationFrame(this.loop);
    }
}"""

new_methods = """    loop(timestamp) {
        this.dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to prevent massive jumps on lag spikes (continuous collision safety)
        if (this.dt > 0.05) this.dt = 0.05;

        this.update(this.dt);
        this.draw();
        requestAnimationFrame(this.loop);
    }

    triggerEndGameSequence() {
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
        }, 500);

        setTimeout(() => {
            clearInterval(explosionInterval);
            getCachedElement('beta-thanks-screen').classList.add('hidden');
            this.showCreditsScreen();
        }, 4500);
        
        this.checkAndSaveScore();
    }

    showCreditsScreen() {
        this.state = 'CREDITS';
        getCachedElement('credits-screen').classList.remove('hidden');
        const listContainer = document.getElementById('beta-testers-list');
        listContainer.innerHTML = 'Cargando testers...';
        
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            firebase.database().ref('ranking_emoji_breakout').once('value').then(snap => {
                let testers = new Set();
                if (snap.exists()) {
                    snap.forEach(child => {
                        let name = child.val().name;
                        if (name && name.toUpperCase() !== "PAPIKOFLA" && name.toUpperCase() !== "XTALCUAL") {
                            testers.add(name);
                        }
                    });
                }
                let listHTML = Array.from(testers).map(t => `<p class="beta-tester-name">${this.escapeHtml(t)}</p>`).join('');
                listContainer.innerHTML = listHTML || "<p class='beta-tester-name'>Ninguno encontrado</p>";
            }).catch(e => {
                listContainer.innerHTML = "<p class='beta-tester-name'>Error al cargar testers</p>";
            });
        } else {
            listContainer.innerHTML = "<p class='beta-tester-name'>Firebase no conectado</p>";
        }
    }
}"""
content = content.replace(end_loop, new_methods)

# 3. Inject global syncR1AchievementToFirebase and call it, and button listener
global_injection = """
function syncR1AchievementToFirebase() {
    let uid = localStorage.getItem('eb_uid');
    if (!uid || typeof firebase === 'undefined' || !firebase.apps.length) return;
    
    let unlockedStr = localStorage.getItem('player_unlocked_skins') || 'default';
    if (unlockedStr.includes('neon_green')) {
        firebase.database().ref('leaderboard/' + uid).update({ hasR1: true })
            .then(() => console.log("R1 Achievement synced!"))
            .catch(e => console.error("Error syncing R1:", e));
    }
}

// Llama al sync una vez al cargar
setTimeout(syncR1AchievementToFirebase, 2000);

document.addEventListener("DOMContentLoaded", function() {
    const creditsBtn = document.getElementById('credits-btn');
    if (creditsBtn) {
        creditsBtn.addEventListener('click', () => {
            getCachedElement('start-screen').classList.add('hidden');
            if (window.gameInstance) {
                window.gameInstance.showCreditsScreen();
            }
        });
    }
    
    const closeCreditsBtn = document.getElementById('close-credits-btn');
    if (closeCreditsBtn) {
        closeCreditsBtn.addEventListener('click', () => {
            getCachedElement('credits-screen').classList.add('hidden');
            getCachedElement('start-screen').classList.remove('hidden');
            if (window.gameInstance) {
                window.gameInstance.state = 'MENU';
            }
        });
    }
"""
content = content.replace('document.addEventListener("DOMContentLoaded", function() {', global_injection)

# 4. Update cargarRankingGlobal TR rendering
old_tr = """                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${medal}</td>
                    <td style="text-align: left; padding-left: 10px;">
                        <img class="leaderboard-avatar" src="${avatarSrc}" alt="Avatar">
                        ${data.name || 'Jugador'}
                    </td>
                    <td>${data.maxLevel || 1}</td>
                    <td style="color: #eab308; font-weight: bold;">${data.score || 0}</td>
                `;
                tbody.appendChild(tr);"""

new_tr = """                const tr = document.createElement('tr');
                if (data.hasR1) tr.className = 'ranking-r1-row';
                let r1Badge = data.hasR1 ? ' <span class="r1-badge" title="Racha de 10 niveles (R1)">R1</span>' : '';
                tr.innerHTML = `
                    <td>${medal}</td>
                    <td style="text-align: left; padding-left: 10px;">
                        <img class="leaderboard-avatar" src="${avatarSrc}" alt="Avatar">
                        ${data.name || 'Jugador'}${r1Badge}
                    </td>
                    <td>${data.maxLevel || 1}</td>
                    <td style="color: #eab308; font-weight: bold;">${data.score || 0}</td>
                `;
                tbody.appendChild(tr);"""
content = content.replace(old_tr, new_tr)

with open("game.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated game.js")
