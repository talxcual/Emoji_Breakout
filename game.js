// --- Android Bridge Mock for Cross-Platform Web Support (e.g. itch.io) ---
if (typeof window.AndroidInterface === 'undefined') {
    const soundCache = {};
    let bgMusic = null;
    let isMuted = localStorage.getItem('audio_muted') === 'true';
    let musicVol = parseFloat(localStorage.getItem('music_volume') || '0.5');
    let sfxVol = parseFloat(localStorage.getItem('sfx_volume') || '0.8');

    function getAudioFile(name) {
        if (!soundCache[name]) {
            soundCache[name] = new Audio(name + '.mp3');
        }
        return soundCache[name];
    }

    window.AndroidInterface = {
        playSFX: function(name) {
            if (isMuted) return;
            try {
                const original = getAudioFile(name);
                const clone = original.cloneNode(true);
                clone.volume = sfxVol;
                clone.play().catch(e => console.log("SFX play prevented:", e));
            } catch (e) {
                console.error("Error playing Web SFX:", e);
            }
        },
        startMusic: function() {
            try {
                if (!bgMusic) {
                    bgMusic = new Audio('bg_music.mp3');
                    bgMusic.loop = true;
                }
                bgMusic.volume = isMuted ? 0 : musicVol;
                bgMusic.play().catch(e => console.log("Music play prevented:", e));
            } catch (e) {
                console.error("Error playing Web Music:", e);
            }
        },
        pauseMusic: function() {
            if (bgMusic) {
                try {
                    bgMusic.pause();
                } catch (e) {
                    console.error("Error pausing Web Music:", e);
                }
            }
        },
        toggleMute: function() {
            isMuted = !isMuted;
            localStorage.setItem('audio_muted', isMuted ? 'true' : 'false');
            if (bgMusic) {
                bgMusic.volume = isMuted ? 0 : musicVol;
            }
            return isMuted;
        },
        isMuted: function() {
            return isMuted;
        },
        getMusicVolume: function() {
            return musicVol;
        },
        setMusicVolume: function(volume) {
            musicVol = volume;
            localStorage.setItem('music_volume', musicVol.toString());
            if (bgMusic) {
                bgMusic.volume = isMuted ? 0 : musicVol;
            }
        },
        getSfxVolume: function() {
            return sfxVol;
        },
        setSfxVolume: function(volume) {
            sfxVol = volume;
            localStorage.setItem('sfx_volume', sfxVol.toString());
        },
        getUnlockedSkins: function() {
            return localStorage.getItem('player_unlocked_skins') || 'default';
        },
        saveSkins: function(unlockedStr, equipped) {
            localStorage.setItem('player_unlocked_skins', unlockedStr);
            localStorage.setItem('player_equipped_skin', equipped);
        },
        getEquippedSkin: function() {
            return localStorage.getItem('player_equipped_skin') || 'default';
        },
        loadInventory: function() {
            return localStorage.getItem('player_owned_ball_skins') || '["default"]';
        },
        saveInventory: function(jsonStr) {
            localStorage.setItem('player_owned_ball_skins', jsonStr);
        },
        getEquippedBallSkin: function() {
            return localStorage.getItem('player_equipped_ball_skin') || 'default';
        },
        saveEquippedBallSkin: function(skinId) {
            localStorage.setItem('player_equipped_ball_skin', skinId);
        },
        saveSettings: function(highGraphics) {
            localStorage.setItem('high_graphics_enabled', highGraphics ? 'true' : 'false');
        },
        loadSettings: function() {
            var val = localStorage.getItem('high_graphics_enabled');
            return val === null ? true : (val === 'true');
        },
        getMaxLevel: function() {
            var val = localStorage.getItem('max_level');
            return val ? parseInt(val, 10) : 1;
        },
        getHighScore: function() {
            var val = localStorage.getItem('high_score');
            return val ? parseInt(val, 10) : 0;
        },
        saveProgress: function(maxLevel, highScore) {
            localStorage.setItem('max_level', maxLevel.toString());
            localStorage.setItem('high_score', highScore.toString());
        },
        getCoins: function() {
            var val = localStorage.getItem('coins_count');
            return val ? parseInt(val, 10) : 0;
        },
        saveCoins: function(coins) {
            localStorage.setItem('coins_count', coins.toString());
        },
        getPlayerNickname: function() {
            return localStorage.getItem('player_nickname') || "";
        },
        getPlayerProfilePic: function() {
            return localStorage.getItem('player_profile_pic') || "";
        },
        saveUserProfile: function(nickname, profilePic) {
            localStorage.setItem('player_nickname', nickname);
            localStorage.setItem('player_profile_pic', profilePic);
        },
        saveProgressWithProfile: function(level, score, nickname, profilePic) {
            localStorage.setItem('max_level', level.toString());
            localStorage.setItem('high_score', score.toString());
            localStorage.setItem('player_nickname', nickname);
            localStorage.setItem('player_profile_pic', profilePic);
        },
        getAuthStatus: function() {
            return localStorage.getItem('auth_status') || "{}";
        },
        logout: function() {
            localStorage.removeItem('auth_status');
            localStorage.removeItem('player_nickname');
            localStorage.removeItem('player_profile_pic');
        },
        saveSession: function(jsonState) {
            localStorage.setItem('player_session_state', jsonState);
        },
        loadSession: function() {
            return localStorage.getItem('player_session_state');
        },
        clearSession: function() {
            localStorage.removeItem('player_session_state');
        },
        getDoubleScoreCount: function() {
            var dCount = parseInt(localStorage.getItem('player_double_score_count') || '0', 10);
            return isNaN(dCount) ? 0 : dCount;
        },
        saveDoubleScoreCount: function(count) {
            localStorage.setItem('player_double_score_count', count.toString());
        },
        getSuperPowerCount: function() {
            var sCount = parseInt(localStorage.getItem('player_super_power_count') || '0', 10);
            return isNaN(sCount) ? 0 : sCount;
        },
        saveSuperPowerCount: function(count) {
            localStorage.setItem('player_super_power_count', count.toString());
        }
    };
}

// --- DOM Cache Helpers to avoid layout thrashing and DOM search bottlenecks ---
let consecutiveWins = 0;

const domCache = {};
function getCachedElement(id) {
    if (!domCache[id]) {
        domCache[id] = document.getElementById(id);
    }
    return domCache[id];
}

const queryCache = {};
function getCachedQuery(selector) {
    if (!queryCache[selector]) {
        queryCache[selector] = document.querySelector(selector);
    }
    return queryCache[selector];
}

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

// --- Skins Bridge Helpers ---
function getUnlockedSkins() {
    if (window.AndroidInterface && window.AndroidInterface.getUnlockedSkins) {
        try {
            return window.AndroidInterface.getUnlockedSkins().split(',');
        } catch (e) {
            console.error("Error calling getUnlockedSkins:", e);
        }
    }
    let skins = localStorage.getItem('player_unlocked_skins') || 'default';
    return skins.split(',');
}

function saveUnlockedSkins(skinsArray) {
    const unlockedStr = skinsArray.join(',');
    const equipped = getEquippedSkin();
    if (window.AndroidInterface && window.AndroidInterface.saveSkins) {
        try {
            window.AndroidInterface.saveSkins(unlockedStr, equipped);
            return;
        } catch (e) {
            console.error("Error calling saveSkins:", e);
        }
    }
    localStorage.setItem('player_unlocked_skins', unlockedStr);
}

function getEquippedSkin() {
    if (window.AndroidInterface && window.AndroidInterface.getEquippedSkin) {
        try {
            return window.AndroidInterface.getEquippedSkin();
        } catch (e) {
            console.error("Error calling getEquippedSkin:", e);
        }
    }
    return localStorage.getItem('player_equipped_skin') || 'default';
}

function saveEquippedSkin(skinId) {
    const unlocked = getUnlockedSkins().join(',');
    if (window.AndroidInterface && window.AndroidInterface.saveSkins) {
        try {
            window.AndroidInterface.saveSkins(unlocked, skinId);
            return;
        } catch (e) {
            console.error("Error calling saveSkins:", e);
        }
    }
    localStorage.setItem('player_equipped_skin', skinId);
}

function getOwnedBallSkins() {
    if (window.AndroidInterface && window.AndroidInterface.loadInventory) {
        try {
            return JSON.parse(window.AndroidInterface.loadInventory());
        } catch (e) {
            console.error("Error calling loadInventory:", e);
        }
    }
    let skins = localStorage.getItem('player_owned_ball_skins');
    return skins ? JSON.parse(skins) : ['default'];
}

function saveOwnedBallSkins(skinsArray) {
    const jsonStr = JSON.stringify(skinsArray);
    if (window.AndroidInterface && window.AndroidInterface.saveInventory) {
        try {
            window.AndroidInterface.saveInventory(jsonStr);
            return;
        } catch (e) {
            console.error("Error calling saveInventory:", e);
        }
    }
    localStorage.setItem('player_owned_ball_skins', jsonStr);
}

function getEquippedBallSkin() {
    if (window.AndroidInterface && window.AndroidInterface.getEquippedBallSkin) {
        try {
            return window.AndroidInterface.getEquippedBallSkin();
        } catch (e) {
            console.error("Error calling getEquippedBallSkin:", e);
        }
    }
    return localStorage.getItem('player_equipped_ball_skin') || 'default';
}

function saveEquippedBallSkin(skinId) {
    if (window.AndroidInterface && window.AndroidInterface.saveEquippedBallSkin) {
        try {
            window.AndroidInterface.saveEquippedBallSkin(skinId);
            return;
        } catch (e) {
            console.error("Error calling saveEquippedBallSkin:", e);
        }
    }
    localStorage.setItem('player_equipped_ball_skin', skinId);
}

function saveSettings(highGraphics) {
    if (window.AndroidInterface && window.AndroidInterface.saveSettings) {
        try {
            window.AndroidInterface.saveSettings(highGraphics);
            return;
        } catch (e) {
            console.error("Error calling saveSettings:", e);
        }
    }
    localStorage.setItem('high_graphics_enabled', highGraphics ? 'true' : 'false');
}

function loadSettings() {
    if (window.AndroidInterface && window.AndroidInterface.loadSettings) {
        try {
            return window.AndroidInterface.loadSettings();
        } catch (e) {
            console.error("Error calling loadSettings:", e);
        }
    }
    let val = localStorage.getItem('high_graphics_enabled');
    return val === null ? true : (val === 'true');
}

function getMusicVolume() {
    if (window.AndroidInterface && window.AndroidInterface.getMusicVolume) {
        try {
            return window.AndroidInterface.getMusicVolume();
        } catch (e) {
            console.error("Error calling getMusicVolume:", e);
        }
    }
    let val = localStorage.getItem('music_volume');
    return val === null ? 0.5 : parseFloat(val);
}

function saveMusicVolume(volume) {
    if (window.AndroidInterface && window.AndroidInterface.setMusicVolume) {
        try {
            window.AndroidInterface.setMusicVolume(volume);
            return;
        } catch (e) {
            console.error("Error calling setMusicVolume:", e);
        }
    }
    localStorage.setItem('music_volume', volume.toString());
}

function getSfxVolume() {
    if (window.AndroidInterface && window.AndroidInterface.getSfxVolume) {
        try {
            return window.AndroidInterface.getSfxVolume();
        } catch (e) {
            console.error("Error calling getSfxVolume:", e);
        }
    }
    let val = localStorage.getItem('sfx_volume');
    return val === null ? 0.8 : parseFloat(val);
}

function saveSfxVolume(volume) {
    if (window.AndroidInterface && window.AndroidInterface.setSfxVolume) {
        try {
            window.AndroidInterface.setSfxVolume(volume);
            return;
        } catch (e) {
            console.error("Error calling setSfxVolume:", e);
        }
    }
    localStorage.setItem('sfx_volume', volume.toString());
}

class Paddle {
    constructor(game) {
        this.game = game;
        this.width = 100; // Adjusted for Portrait (was 120)
        this.height = 20;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height - 90; // Sube la barra 50px (era game.height - 40) para resolver Fat Finger
        this.speed = 0;
        this.maxSpeed = 8;
        this.color = game.getEquippedSkinColor ? game.getEquippedSkinColor() : '#8b5cf6';
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
        this.drawColor = this.isInverted ? '#dc2626' : (this.game.getEquippedSkinColor ? this.game.getEquippedSkinColor() : '#8b5cf6');
        ctx.fillStyle = this.drawColor;
        
        if (this.game.highGraphicsEnabled) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.drawColor;
            ctx.beginPath();
            ctx.roundRect(Math.floor(this.x), Math.floor(this.y), Math.floor(this.width), Math.floor(this.height), 10);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow

            // Shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.roundRect(Math.floor(this.x + 5), Math.floor(this.y + 2), Math.floor(this.width - 10), Math.floor(this.height / 2 - 2), 5);
            ctx.fill();
        } else {
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), Math.floor(this.width), Math.floor(this.height));
        }
    }
}

class Ball {
    constructor(game) {
        this.game = game;
        this.size = 48; // Ball diameter / Emoji size
        this.radius = this.size / 2;
        this.emoji = '⚪'; // Default ball emoji
        this.speedMultiplier = 1;
        this.damage = 1;
        this.isFireball = false;
        
        // Elastic squash & stretch animation factors
        this.stretchX = 1.0;
        this.stretchY = 1.0;
        
        this.reset();
        this.prevX = this.x;
        this.prevY = this.y;
    }

    reset() {
        this.x = this.game.width / 2;
        this.y = this.game.paddle.y - this.radius - 5;
        
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
        
        const skinId = this.game.equippedBallSkin || 'default';
        const skin = this.game.ballSkinsDict && this.game.ballSkinsDict[skinId];
        this.emoji = skin ? (Array.from(skin.emoji)[0] || '⚪') : '⚪';
        
        this.stretchX = 1.0;
        this.stretchY = 1.0;
        
        this.prevX = this.x;
        this.prevY = this.y;
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
        b.prevX = this.x;
        b.prevY = this.y;
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
        this.prevX = this.x;
        this.prevY = this.y;

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
        this.game.drawEmoji = this.emoji;

        // Si está activo el parpadeo del Huevo de Pascua, rota emojis deportivos y mágicos
        if (this.game.ballFlashTimer > 0) {
            this.game.drawEmoji = this.game.flashEmojis[Math.floor(Date.now() / 80) % this.game.flashEmojis.length];
        }

        this.game.skinId = this.game.equippedBallSkin || 'default';
        this.game.skinImg = this.game.ballSkinImages && this.game.ballSkinImages[this.game.skinId];

        if (this.game.highGraphicsEnabled) {
            ctx.save();
            ctx.translate(Math.floor(this.x), Math.floor(this.y));
            ctx.scale(this.stretchX, this.stretchY);

            // Flash shadow effect on impact squeeze
            if (Math.abs(this.stretchX - 1.0) > 0.15) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ffffff';
            } else if (this.game.ballFlashTimer > 0) {
                ctx.shadowBlur = 22;
                ctx.shadowColor = this.game.flashColors[Math.floor(Date.now() / 120) % this.game.flashColors.length];
            }

            if (this.game.skinImg && this.game.ballFlashTimer <= 0) {
                this.drawImgSize = this.size * 1.35;
                this.drawOffset = -this.drawImgSize / 2;
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(this.game.skinImg, Math.floor(this.drawOffset), Math.floor(this.drawOffset), this.drawImgSize, this.drawImgSize);
                ctx.restore();
            } else {
                ctx.font = `${this.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.game.drawEmoji, 0, 0);
            }
            ctx.restore();
        } else {
            if (this.game.skinImg && this.game.ballFlashTimer <= 0) {
                this.drawImgSize = this.size * 1.35;
                this.drawOffsetX = this.x - this.drawImgSize / 2;
                this.drawOffsetY = this.y - this.drawImgSize / 2;
                ctx.save();
                ctx.beginPath();
                ctx.arc(Math.floor(this.x), Math.floor(this.y), this.radius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(this.game.skinImg, Math.floor(this.drawOffsetX), Math.floor(this.drawOffsetY), this.drawImgSize, this.drawImgSize);
                ctx.restore();
            } else {
                ctx.font = `${this.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.game.drawEmoji, Math.floor(this.x), Math.floor(this.y));
            }
        }
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

        // Easter Egg: 2% de probabilidad de ser Alien o Monstruo (solo bloques destructibles simples)
        this.isSecret = false;
        if (health !== Infinity && health !== 3 && Math.random() < 0.02) {
            this.isSecret = true;
            this.maxHealth = 1;
            this.health = 1;
        }

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
            this.points = 0;
            this.fruitType = 'stone';
        } else if (this.isSecret) {
            this.color = '#a855f7'; // Violeta neón
            this.emoji = this.emoji || (Math.random() < 0.5 ? '👽' : '👾');
            this.points = 100;
            this.fruitType = 'secret';
        } else if (this.maxHealth === 3) {
            this.color = '#0891b2'; // Cyan/Diamond (3 hits)
            this.emoji = '💎';
            this.points = 30;
            this.fruitType = 'diamond';
        } else if (this.maxHealth === 2) {
            this.color = '#ea580c'; // Naranja (2 hits)
            this.emoji = '🍊';
            this.points = 20;
            this.fruitType = 'orange';
        } else {
            // maxHealth = 1: Frutas comunes asignadas determinísticamente por su tipo
            const choice = this.type % 3;
            if (choice === 0) {
                this.color = '#ef4444'; // Rojo manzana
                this.emoji = '🍎';
                this.points = 10;
                this.fruitType = 'apple';
            } else if (choice === 1) {
                this.color = '#eab308'; // Amarillo banana
                this.emoji = '🍌';
                this.points = 0; // Da monedas, no puntos
                this.fruitType = 'banana';
            } else {
                this.color = '#22c55e'; // Verde sandía
                this.emoji = '🍉';
                this.points = 15;
                this.fruitType = 'watermelon';
            }
        }
    }

    onHit() {
        // Mantiene el aspecto pero dibuja grietas visualmente
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

        if (this.game.highGraphicsEnabled) {
            // Draw block base with rounded rect and glow
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.roundRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height, 5);
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
            ctx.fillText(this.emoji, Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2));

            // Draw cracks for damaged blocks
            if (this.health === 2 && this.maxHealth === 3) {
                // Mild crack
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(Math.floor(this.x + 8), Math.floor(this.y + 6));
                ctx.lineTo(Math.floor(this.x + 20), Math.floor(this.y + 18));
                ctx.stroke();
            } else if (this.health === 1 && this.maxHealth >= 2) {
                // Heavy crack
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(Math.floor(this.x + 8), Math.floor(this.y + 6));
                ctx.lineTo(Math.floor(this.x + 22), Math.floor(this.y + 18));
                ctx.lineTo(Math.floor(this.x + 35), Math.floor(this.y + 10));
                ctx.lineTo(Math.floor(this.x + 50), Math.floor(this.y + 20));
                ctx.stroke();
            }
        } else {
            // Flat rendering: simple fillRect and text draw
            ctx.fillStyle = this.color;
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);

            ctx.font = "16px serif";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2));
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
        ctx.fillText(this.emoji, Math.floor(this.x), Math.floor(this.y));
    }
}

class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.init(x, y, color);
    }

    init(x, y, color) {
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
        
        if (this.game.highGraphicsEnabled) {
            // Mini glow for particles
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
        }
        
        ctx.beginPath();
        ctx.arc(Math.floor(this.x), Math.floor(this.y), this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Game {
    constructor() {
        this.canvas = getCachedElement('gameCanvas');
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

        this.highGraphicsEnabled = loadSettings();
        if (!this.highGraphicsEnabled) {
            document.body.classList.add('low-spec');
        } else {
            document.body.classList.remove('low-spec');
        }
        this.settingsOpenedFrom = 'menu';
        this.musicVolume = getMusicVolume();
        this.sfxVolume = getSfxVolume();

        // Pre-allocated variables for collision checks (Zero GC)
        this.ccClosestX = 0;
        this.ccClosestY = 0;
        this.ccDistX = 0;
        this.ccDistY = 0;
        this.ccDistSq = 0;
        this.ccRadius = 0;
        this.ccSpeed = 0;
        this.ccHitPoint = 0;
        this.ccAngle = 0;
        this.ccMinYVel = 0;
        this.ccOverlapX = 0;
        this.ccOverlapY = 0;
        this.ccDist = 0;
        this.ccPrevBottomY = 0;
        this.ccCurrBottomY = 0;
        this.ccDy = 0;
        this.ccT = 0;
        this.ccXIntersect = 0;
        this.ccMaxAngle = 0;
        this.ccParticleCount = 0;
        this.ccSideHitHorizontal = false;
        this.ccBreakablesLeft = false;

        // Static arrays for drawing
        this.flashEmojis = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🔮', '🌟', '⚡'];
        this.flashColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
        this.drawEmoji = '🏐';
        this.skinId = 'default';
        this.skinImg = null;
        this.dx = 0;
        this.dy = 0;

        // Particle pool
        this.particlePool = [];
        for (let i = 0; i < 300; i++) {
            const p = new Particle(this, 0, 0, '#fff');
            p.active = false;
            this.particlePool.push(p);
        }

        this.paddle = new Paddle(this);
        this.balls = [new Ball(this)]; // Multiple balls list
        this.blocks = [];
        this.powerUps = [];
        
        // Coin pool for Zero GC rain
        this.coinPool = [];
        for (let i = 0; i < 100; i++) {
            const c = new PowerUp(this, 0, 0, 'coin');
            c.active = false;
            this.coinPool.push(c);
        }
        
        // Time tracking for Delta Time
        this.lastTime = 0;
        
        // Timers for power-up effects
        this.paddleTimer = 0;
        this.fireballTimer = 0;
        this.speedTimer = 0;
        this.invertTimer = 0;
        this.doubleScoreTimer = 0;
        this.ballFlashTimer = 0;

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
        this.flawlessStreak = true;

        this.skinsDict = {
            'default': { name: "Estándar Púrpura", color: "#8b5cf6", desc: "Aspecto inicial" },
            'neon_green': { name: "Verde Neón", color: "#10b981", desc: "Racha perfecta Zona 1 (Lvl 10)" },
            'sunset_orange': { name: "Naranja Atardecer", color: "#f97316", desc: "Racha perfecta Zona 2 (Lvl 20)" },
            'electric_blue': { name: "Azul Eléctrico", color: "#06b6d4", desc: "Racha perfecta Zona 3 (Lvl 30)" },
            'hot_pink': { name: "Rosa Intenso", color: "#ec4899", desc: "Racha perfecta Zona 4 (Lvl 40)" },
            'golden_legend': { name: "Leyenda Dorada", color: "#eab308", desc: "Racha perfecta Zona 5 (Lvl 50)" }
        };

        this.ballSkinsDict = {
            'default': { name: "Básica ⚪", emoji: "⚪", price: 0, src: null },
            'pelota_bigote': { name: "Balón Bigotudo ⚽🧔", emoji: "⚽", price: 200, src: "pelota_bigote.png" },
            'ojo': { name: "Ojo Pelado 👁️", emoji: "👁️", price: 400, src: "ojo.png" },
            'dona': { name: "Dona Glaseada 🍩", emoji: "🍩", price: 600, src: "dona.png" },
            'rueda': { name: "Rueda de Auto 🛞", emoji: "🛞", price: 800, src: "rueda.png" },
            'ovni': { name: "Invasión OVNI 🛸", emoji: "🛸", price: 1000, src: "ovni.png" }
        };

        this.ownedBallSkins = getOwnedBallSkins();
        this.equippedBallSkin = getEquippedBallSkin();

        // Pre-loader for ball skin images with load count validation
        this.ballSkinImages = {};
        const skinsWithImages = Object.entries(this.ballSkinsDict).filter(([id, skin]) => skin.src);
        const totalImages = skinsWithImages.length;
        let loadedCount = 0;

        const startBtn = getCachedElement('start-btn');
        if (startBtn && totalImages > 0) {
            startBtn.disabled = true;
            startBtn.textContent = '⏳ CARGANDO...';
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'not-allowed';
        }

        const onImageLoaded = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                if (startBtn) {
                    startBtn.disabled = false;
                    startBtn.textContent = '🎮 JUGAR 🕹️';
                    startBtn.style.opacity = '1';
                    startBtn.style.cursor = 'pointer';
                }
            }
        };

        for (const [id, skin] of skinsWithImages) {
            const img = new Image();
            img.onload = onImageLoaded;
            img.onerror = onImageLoaded; // Safety fallback
            img.src = skin.src;
            this.ballSkinImages[id] = img;
        }

        // Set global game instance reference for native bridge access
        window.gameInstance = this;

        this.setupInputs();
        this.loop = this.loop.bind(this);
        
        // Init UI components
        this.showMainMenu();
        this.updateRecordDisplay();
        this.updateMuteButtonVisual();

        // --- MIGRACIÓN LOCAL: LocalStorage a SharedPreferences ---
        if (window.AndroidInterface) {
            try {
                const localMaxLevel = parseInt(localStorage.getItem('max_level') || '1', 10);
                const localHighScore = parseInt(localStorage.getItem('high_score') || '0', 10);
                
                const nativeMaxLevel = window.AndroidInterface.getMaxLevel ? window.AndroidInterface.getMaxLevel() : 1;
                const nativeHighScore = window.AndroidInterface.getHighScore ? window.AndroidInterface.getHighScore() : 0;
                
                if (localMaxLevel > nativeMaxLevel || localHighScore > nativeHighScore) {
                    const finalMaxLevel = Math.max(localMaxLevel, nativeMaxLevel);
                    const finalHighScore = Math.max(localHighScore, nativeHighScore);
                    window.AndroidInterface.saveProgress(finalMaxLevel, finalHighScore);
                    console.log(`Progreso migrado de localStorage a SharedPreferences: Lvl ${finalMaxLevel}, Score ${finalHighScore}`);
                    this.updateRecordDisplay();
                }
            } catch (e) {
                console.error("Error al migrar progreso local:", e);
            }
        }
        
        requestAnimationFrame((timestamp) => {
            this.lastTime = timestamp;
            requestAnimationFrame(this.loop);
        });
    }

    getEquippedSkinColor() {
        const equipped = getEquippedSkin();
        const skin = this.skinsDict ? this.skinsDict[equipped] : null;
        return skin ? skin.color : "#8b5cf6";
    }

    triggerShake(duration, intensity) {
        this.shakeDuration = duration;
        this.shakeIntensity = intensity;
    }

    spawnParticles(x, y, color, count) {
        let spawned = 0;
        for (let i = 0; i < this.particlePool.length; i++) {
            const p = this.particlePool[i];
            if (!p.active) {
                p.init(x, y, color);
                spawned++;
                if (spawned >= count) break;
            }
        }
    }

    explodeWatermelon(srcBlock) {
        // Add a massive explosion bonus (+50 points) affected by active score multiplier
        const watermelonBonus = 50;
        this.score += watermelonBonus * (this.scoreMultiplier || 1);
        this.updateUI();

        // Explode left and right: find active blocks on the same row (Y is close) and adjacent X
        const rowTolerance = 8; // vertical alignment tolerance
        const colTolerance = srcBlock.width + 12; // horizontal distance tolerance
        
        this.blocks.forEach(b => {
            if (!b.active || b === srcBlock) return;
            
            // Check Y proximity (same row)
            const sameRow = Math.abs(b.y - srcBlock.y) < rowTolerance;
            // Check X proximity (adjacent columns)
            const dx = b.x - srcBlock.x;
            const isAdjacent = Math.abs(dx) < colTolerance;
            
            if (sameRow && isAdjacent) {
                b.health -= 1;
                if (b.health <= 0) {
                    b.active = false;
                    this.score += (b.points || 0) * (this.scoreMultiplier || 1);
                    
                    if (b.fruitType === 'banana') {
                        this.coinsCollected += 2;
                        playSFX('coin');
                    } else if (b.fruitType === 'secret') {
                        this.ballFlashTimer = 3.0;
                    } else if (b.fruitType === 'watermelon') {
                        // Safe cascading chain reaction: since b.active is set to false,
                        // this recursive call cannot re-target 'b', preventing loops.
                        this.explodeWatermelon(b);
                    }
                    
                    playSFX('brick');
                    const pCount = 12 + Math.floor(Math.random() * 8);
                    this.spawnParticles(b.x + b.width / 2, b.y + b.height / 2, b.color, pCount);
                } else {
                    b.onHit();
                    // dust particle burst
                    this.spawnParticles(b.x + b.width / 2, b.y + b.height / 2, b.color, 4);
                }
            }
        });
        
        this.triggerShake(0.18, 7);
    }

    setupInputs() {
        window.addEventListener('mousemove', (e) => {
            if (this.state !== 'PLAYING') return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const mouseX = (e.clientX - rect.left) * scaleX;
            this.paddle.update(mouseX);
        });

        // Touch support on window with relative bottom screen check (Fat Finger solution)
        window.addEventListener('touchmove', (e) => {
            if (this.state !== 'PLAYING') return;
            const touch = e.touches[0];
            if (touch.clientY > window.innerHeight / 2) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const touchX = (touch.clientX - rect.left) * scaleX;
                this.paddle.update(touchX);
            }
        }, { passive: true });

        this.canvas.addEventListener('click', () => {
            if (this.state === 'PLAYING') {
                this.balls.forEach(ball => {
                    if (!ball.active) ball.active = true;
                });
            }
        });

        window.addEventListener('touchstart', (e) => {
            if (this.state !== 'PLAYING') return;
            const touch = e.touches[0];
            if (touch.clientY > window.innerHeight / 2) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const touchX = (touch.clientX - rect.left) * scaleX;
                this.paddle.update(touchX);

                let launched = false;
                this.balls.forEach(ball => {
                    if (!ball.active) {
                        ball.active = true;
                        launched = true;
                    }
                });
            }
        }, { passive: true });

        // HUD Listeners
        getCachedElement('pause-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.pauseGame();
        });
        getCachedElement('mute-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });

        // Overlay Listeners
        getCachedElement('start-btn').addEventListener('click', () => this.startGame());
        getCachedElement('resume-btn').addEventListener('click', () => this.resumeGame());
        getCachedElement('restart-pause-btn').addEventListener('click', () => {
            this.resumeGame();
            this.startGame();
        });
        getCachedElement('quit-btn').addEventListener('click', () => {
            this.saveGameState();
            this.quitToMenu();
        });

        // Level Select Listeners
        const lvlSelectBtn = getCachedElement('level-select-btn');
        if (lvlSelectBtn) {
            lvlSelectBtn.addEventListener('click', () => {
                this.renderLevelSelector();
                this.renderSkinsSelector();
                getCachedElement('level-select-screen').classList.remove('hidden');
                
                // Show levels tab by default
                getCachedElement('panel-levels').classList.remove('hidden');
                getCachedElement('panel-skins').classList.add('hidden');
                getCachedElement('tab-levels-btn').classList.add('active-tab');
                getCachedElement('tab-skins-btn').classList.remove('active-tab');
            });
        }

        const closeLvlSelectBtn = getCachedElement('close-level-select-btn');
        if (closeLvlSelectBtn) {
            closeLvlSelectBtn.addEventListener('click', () => {
                getCachedElement('level-select-screen').classList.add('hidden');
            });
        }

        const tabLevelsBtn = getCachedElement('tab-levels-btn');
        if (tabLevelsBtn) {
            tabLevelsBtn.addEventListener('click', () => {
                getCachedElement('panel-levels').classList.remove('hidden');
                getCachedElement('panel-skins').classList.add('hidden');
                tabLevelsBtn.classList.add('active-tab');
                getCachedElement('tab-skins-btn').classList.remove('active-tab');
            });
        }

        const tabSkinsBtn = getCachedElement('tab-skins-btn');
        if (tabSkinsBtn) {
            tabSkinsBtn.addEventListener('click', () => {
                getCachedElement('panel-levels').classList.add('hidden');
                getCachedElement('panel-skins').classList.remove('hidden');
                tabSkinsBtn.classList.add('active-tab');
                getCachedElement('tab-levels-btn').classList.remove('active-tab');
            });
        }
        getCachedElement('next-level-btn').addEventListener('click', () => this.loadNextLevel());
        
        getCachedElement('restart-btn').addEventListener('click', () => this.startGame());
        getCachedElement('play-again-btn').addEventListener('click', () => this.startGame());

        // Game Over and Win screens Menu Principal button listeners
        const gameOverQuitBtn = getCachedElement('game-over-quit-btn');
        if (gameOverQuitBtn) {
            gameOverQuitBtn.addEventListener('click', () => {
                getCachedElement('game-over-screen').classList.add('hidden');
                this.quitToMenu();
            });
        }

        const winQuitBtn = getCachedElement('win-quit-btn');
        if (winQuitBtn) {
            winQuitBtn.addEventListener('click', () => {
                getCachedElement('win-screen').classList.add('hidden');
                this.quitToMenu();
            });
        }

        // Resume Saved Session Button
        const resumeSessionBtn = getCachedElement('resume-session-btn');
        if (resumeSessionBtn) {
            resumeSessionBtn.addEventListener('click', () => {
                const saved = loadSessionState();
                if (saved) {
                    this.loadGameState(saved);
                }
            });
        }

        // Leaderboard (Ranking Global) Buttons
        const leaderboardBtn = getCachedElement('leaderboard-btn');
        if (leaderboardBtn) {
            leaderboardBtn.addEventListener('click', () => {
                const tbody = getCachedElement('leaderboard-tbody');
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="4" style="color: #8b5cf6; text-align: center;">Cargando Ranking...</td></tr>`;
                }
                if (typeof cargarRankingGlobal === 'function') {
                    cargarRankingGlobal();
                }
                getCachedElement('leaderboard-screen').classList.remove('hidden');
            });
        }

        const closeLeaderboardBtn = getCachedElement('close-leaderboard-btn');
        if (closeLeaderboardBtn) {
            closeLeaderboardBtn.addEventListener('click', () => {
                getCachedElement('leaderboard-screen').classList.add('hidden');
            });
        }

        // Profile (Mi Perfil) Buttons and Listeners
        const profileBtn = getCachedElement('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.loadUserProfile();
                getCachedElement('profile-screen').classList.remove('hidden');
            });
        }

        const closeProfileBtn = getCachedElement('close-profile-btn');
        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => {
                getCachedElement('profile-screen').classList.add('hidden');
            });
        }

        const googleLoginBtn = getCachedElement('google-login-btn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => {
                if (window.AndroidInterface && window.AndroidInterface.loginWithGoogle) {
                    window.AndroidInterface.loginWithGoogle();
                } else {
                    alert("Google Login solo está disponible en la app Android.");
                }
            });
        }

        const changeAvatarBtn = getCachedElement('change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                if (window.AndroidInterface && window.AndroidInterface.selectProfilePicture) {
                    window.AndroidInterface.selectProfilePicture();
                } else {
                    alert("La selección de imagen solo está disponible en la app Android.");
                }
            });
        }

        const saveProfileBtn = getCachedElement('save-profile-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.saveUserProfile();
            });
        }

        const logoutBtn = getCachedElement('logout-btn');
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
        const shopBtn = getCachedElement('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                this.shopOpenedFrom = 'menu';
                this.loadShop();
                getCachedElement('shop-screen').classList.remove('hidden');
            });
        }

        const pauseShopBtn = getCachedElement('pause-shop-btn');
        if (pauseShopBtn) {
            pauseShopBtn.addEventListener('click', () => {
                this.shopOpenedFrom = 'pause';
                this.loadShop();
                getCachedElement('pause-screen').classList.add('hidden');
                getCachedElement('shop-screen').classList.remove('hidden');
            });
        }

        const closeShopBtn = getCachedElement('close-shop-btn');
        if (closeShopBtn) {
            closeShopBtn.addEventListener('click', () => {
                getCachedElement('shop-screen').classList.add('hidden');
                if (this.shopOpenedFrom === 'pause') {
                    getCachedElement('pause-screen').classList.remove('hidden');
                }
            });
        }

        const buyDoubleScoreBtn = getCachedElement('buy-double-score-btn');
        if (buyDoubleScoreBtn) {
            buyDoubleScoreBtn.addEventListener('click', () => {
                this.buyShopItem('doubleScore', 50);
            });
        }

        const buySuperPowerBtn = getCachedElement('buy-super-power-btn');
        if (buySuperPowerBtn) {
            buySuperPowerBtn.addEventListener('click', () => {
                this.buyShopItem('superPower', 100);
            });
        }

        const tabShopBuffs = getCachedElement('tab-shop-buffs-btn');
        const tabShopSkins = getCachedElement('tab-shop-skins-btn');
        if (tabShopBuffs && tabShopSkins) {
            tabShopBuffs.addEventListener('click', () => {
                getCachedElement('panel-shop-buffs').classList.remove('hidden');
                getCachedElement('panel-shop-skins').classList.add('hidden');
                tabShopBuffs.classList.add('active-tab');
                tabShopSkins.classList.remove('active-tab');
            });
            tabShopSkins.addEventListener('click', () => {
                getCachedElement('panel-shop-buffs').classList.add('hidden');
                getCachedElement('panel-shop-skins').classList.remove('hidden');
                tabShopSkins.classList.add('active-tab');
                tabShopBuffs.classList.remove('active-tab');
                this.renderBallSkinsShop();
            });
        }

        // HUD Floating Buff Activation Listeners
        const actDoubleBtn = getCachedElement('activate-double-score-btn');
        if (actDoubleBtn) {
            actDoubleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activateDoubleScoreBuff();
            });
        }

        const actSuperBtn = getCachedElement('activate-super-power-btn');
        if (actSuperBtn) {
            actSuperBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activateSuperPowerBuff();
            });
        }

        // Daily Gift Button
        const dailyGiftBtn = getCachedElement('daily-gift-btn');
        if (dailyGiftBtn) {
            dailyGiftBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.claimDailyGift();
            });
        }

        // Extra Life Modal Buttons
        const buyExtraLifeBtn = getCachedElement('buy-extra-life-btn');
        if (buyExtraLifeBtn) {
            buyExtraLifeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.buyExtraLife();
            });
        }

        const declineExtraLifeBtn = getCachedElement('decline-extra-life-btn');
        if (declineExtraLifeBtn) {
            declineExtraLifeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.declineExtraLife();
            });
        }

        // Settings (Ajustes) Screen listeners
        const settingsBtn = getCachedElement('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.settingsOpenedFrom = 'menu';
                const toggle = getCachedElement('neon-effects-toggle');
                if (toggle) toggle.checked = this.highGraphicsEnabled;
                
                // Sync sound sliders
                const musicSlider = getCachedElement('music-volume-slider');
                const musicVal = getCachedElement('music-volume-val');
                if (musicSlider && musicVal) {
                    const volPercent = Math.round(this.musicVolume * 100);
                    musicSlider.value = volPercent;
                    musicVal.textContent = volPercent + '%';
                }

                const sfxSlider = getCachedElement('sfx-volume-slider');
                const sfxVal = getCachedElement('sfx-volume-val');
                if (sfxSlider && sfxVal) {
                    const volPercent = Math.round(this.sfxVolume * 100);
                    sfxSlider.value = volPercent;
                    sfxVal.textContent = volPercent + '%';
                }

                const soundPanel = getCachedElement('sound-settings-panel');
                if (soundPanel) soundPanel.classList.add('hidden');
                const soundArrow = getCachedElement('sound-submenu-arrow');
                if (soundArrow) soundArrow.textContent = '▶';

                getCachedElement('start-screen').classList.add('hidden');
                getCachedElement('settings-screen').classList.remove('hidden');
            });
        }

        const pauseSettingsBtn = getCachedElement('pause-settings-btn');
        if (pauseSettingsBtn) {
            pauseSettingsBtn.addEventListener('click', () => {
                this.settingsOpenedFrom = 'pause';
                const toggle = getCachedElement('neon-effects-toggle');
                if (toggle) toggle.checked = this.highGraphicsEnabled;
                
                // Sync sound sliders
                const musicSlider = getCachedElement('music-volume-slider');
                const musicVal = getCachedElement('music-volume-val');
                if (musicSlider && musicVal) {
                    const volPercent = Math.round(this.musicVolume * 100);
                    musicSlider.value = volPercent;
                    musicVal.textContent = volPercent + '%';
                }

                const sfxSlider = getCachedElement('sfx-volume-slider');
                const sfxVal = getCachedElement('sfx-volume-val');
                if (sfxSlider && sfxVal) {
                    const volPercent = Math.round(this.sfxVolume * 100);
                    sfxSlider.value = volPercent;
                    sfxVal.textContent = volPercent + '%';
                }

                const soundPanel = getCachedElement('sound-settings-panel');
                if (soundPanel) soundPanel.classList.add('hidden');
                const soundArrow = getCachedElement('sound-submenu-arrow');
                if (soundArrow) soundArrow.textContent = '▶';

                getCachedElement('pause-screen').classList.add('hidden');
                getCachedElement('settings-screen').classList.remove('hidden');
            });
        }

        const closeSettingsBtn = getCachedElement('close-settings-btn');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                getCachedElement('settings-screen').classList.add('hidden');
                if (this.settingsOpenedFrom === 'pause') {
                    getCachedElement('pause-screen').classList.remove('hidden');
                } else {
                    getCachedElement('start-screen').classList.remove('hidden');
                }
            });
        }

        const neonToggle = getCachedElement('neon-effects-toggle');
        if (neonToggle) {
            neonToggle.addEventListener('change', (e) => {
                this.highGraphicsEnabled = e.target.checked;
                saveSettings(this.highGraphicsEnabled);
                if (!this.highGraphicsEnabled) {
                    document.body.classList.add('low-spec');
                } else {
                    document.body.classList.remove('low-spec');
                }
            });
        }

        const soundSubmenuBtn = getCachedElement('sound-submenu-btn');
        if (soundSubmenuBtn) {
            soundSubmenuBtn.addEventListener('click', () => {
                const panel = getCachedElement('sound-settings-panel');
                const arrow = getCachedElement('sound-submenu-arrow');
                if (panel && arrow) {
                    const isHidden = panel.classList.contains('hidden');
                    if (isHidden) {
                        panel.classList.remove('hidden');
                        arrow.textContent = '▼';
                    } else {
                        panel.classList.add('hidden');
                        arrow.textContent = '▶';
                    }
                }
            });
        }

        const musicSlider = getCachedElement('music-volume-slider');
        if (musicSlider) {
            musicSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                getCachedElement('music-volume-val').textContent = val + '%';
                this.musicVolume = val / 100;
                saveMusicVolume(this.musicVolume);
            });
        }

        const sfxSlider = getCachedElement('sfx-volume-slider');
        if (sfxSlider) {
            sfxSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                getCachedElement('sfx-volume-val').textContent = val + '%';
                this.sfxVolume = val / 100;
                saveSfxVolume(this.sfxVolume);
            });
        }
    }

    startGame() {
        clearSessionState(); // Reset saved state when starting fresh
        this.state = 'PLAYING';
        this.level = 1;
        this.score = 0;
        this.lives = 3;

        getCachedElement('start-screen').classList.add('hidden');
        getCachedElement('game-over-screen').classList.add('hidden');
        getCachedElement('win-screen').classList.add('hidden');
        getCachedElement('pause-screen').classList.add('hidden');
        getCachedElement('level-cleared-screen').classList.add('hidden');

        // Reset all power-up timers
        this.paddleTimer = 0;
        this.fireballTimer = 0;
        this.speedTimer = 0;
        this.invertTimer = 0;
        this.doubleScoreTimer = 0;

        this.paddle = new Paddle(this);
        this.balls = [new Ball(this)];
        this.powerUps = [];
        for (let i = 0; i < this.particlePool.length; i++) {
            this.particlePool[i].active = false;
        }
        this.shakeDuration = 0;

        // Reset coins collected in this run
        this.coinsCollected = 0;

        // Reset score multiplier to 1 (activated manually in game)
        this.scoreMultiplier = 1;

        // Load buff stock from localStorage to ensure latest purchases are active
        this.doubleScoreCount = getDoubleScoreCount();
        this.superPowerCount = getSuperPowerCount();

        // Show floating buff buttons
        getCachedElement('game-buffs-container').classList.remove('hidden');
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
        getCachedElement('pause-screen').classList.remove('hidden');
        this.saveGameState(); // Auto-save on pausing
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        startBGMusic();
        getCachedElement('pause-screen').classList.add('hidden');
        getCachedElement('game-buffs-container').classList.remove('hidden');
        this.updateBuffButtonsUI();
    }

    quitToMenu() {
        this.state = 'MENU';
        pauseBGMusic();
        getCachedElement('pause-screen').classList.add('hidden');
        getCachedElement('game-buffs-container').classList.add('hidden');
        getCachedElement('start-screen').classList.remove('hidden');
        this.showMainMenu();
    }

    showMainMenu() {
        const highScore = window.AndroidInterface ? window.AndroidInterface.getHighScore() : 0;
        getCachedElement('high-score-display').textContent = highScore;
        this.updateRecordDisplay();
        getCachedElement('game-buffs-container').classList.add('hidden');

        // Update daily gift button state
        this.updateDailyGiftUI();

        const saved = loadSessionState();
        const resumeBtn = getCachedElement('resume-session-btn');
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
        getCachedElement('mute-btn').textContent = muted ? '🔇' : '🔊';
    }

    updateMuteButtonVisual() {
        const muted = isGameMuted();
        getCachedElement('mute-btn').textContent = muted ? '🔇' : '🔊';
    }

    updateRecordDisplay() {
        const highScore = window.AndroidInterface ? window.AndroidInterface.getHighScore() : 0;
        const bottomHighScore = getCachedElement('bottom-high-score-display');
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
        for (let i = 0; i < this.particlePool.length; i++) {
            this.particlePool[i].active = false;
        }
        
        // Clear power-up states
        this.paddle.width = this.paddle.baseWidth;
        this.paddle.isInverted = false;
        this.paddle.color = this.getEquippedSkinColor();
        
        this.balls = [new Ball(this)];

        // Update zone background for dynamic backgrounds
        this.updateZoneBackground(level);

        // Flawless Streak setup on start of zones
        if (level === 1 || level === 11 || level === 21 || level === 31 || level === 41) {
            this.flawlessStreak = true;
        }

        this.isBonusLevel = (consecutiveWins > 0 && consecutiveWins % 5 === 0);

        if (this.isBonusLevel) {
            this.isScoreFever = true;
            this.balls[0].isFireball = true;
            this.fireballTimer = Infinity;
            this.lluviaMonedas();

            const rows = 14; 
            const cols = 10; 
            const padding = 3;
            const blockWidth = 40; 
            const blockHeight = 15;
            
            const totalGridWidth = cols * blockWidth + (cols - 1) * padding;
            const offsetX = (this.width - totalGridWidth) / 2;
            const offsetY = 80;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const blockX = offsetX + c * (blockWidth + padding);
                    const blockY = offsetY + r * (blockHeight + padding);
                    const b = new Block(this, blockX, blockY, r, 1);
                    b.width = blockWidth;
                    b.height = blockHeight;
                    this.blocks.push(b);
                }
            }
        } else {
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
    }

    lluviaMonedas() {
        for (this.i = 0; this.i < this.coinPool.length; this.i++) {
            this.coinPool[this.i].x = Math.floor(Math.random() * (this.width - 20) + 10);
            this.coinPool[this.i].y = Math.floor(-(Math.random() * 2000) - 50);
            this.coinPool[this.i].speedY = Math.floor(Math.random() * 200 + 100);
            this.coinPool[this.i].active = true;
        }
    }

    loseLife() {
        this.lives--;
        this.flawlessStreak = false;
        consecutiveWins = 0;
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
                getCachedElement('game-buffs-container').classList.add('hidden');
                getCachedElement('extra-life-modal').classList.remove('hidden');
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
        getCachedElement('level-display').textContent = this.level;
        getCachedElement('score-display').textContent = this.score;
        
        let livesText = '';
        if (this.lives <= 5) {
            livesText = '❤️'.repeat(Math.max(0, this.lives));
        } else {
            livesText = '❤️ x' + this.lives;
        }
        getCachedElement('lives-display').textContent = livesText;
        
        const coinsDisplay = getCachedElement('coins-display');
        if (coinsDisplay) {
            coinsDisplay.textContent = this.coinsCollected;
        }
    }

    spawnPowerUp(x, y, isBanana = false) {
        const rand = Math.random();
        let type = null;

        if (this.isBonusLevel) {
            // Nivel Bonus: 0% corazones. 40% de probabilidad base para el resto.
            if (rand <= 0.40) {
                const types = ['long', 'short', 'fireball', 'multiball', 'fast', 'inverted', 'coin'];
                type = types[Math.floor(Math.random() * types.length)];
            }
        } else {
            // Niveles Normales:
            // 0.000 a 0.035 ( 3.5%) -> Corazón (Vida)
            // 0.035 a 0.215 (18.0%) -> Moneda
            // 0.215 a 0.350 (13.5%) -> Otros powerups (long, fireball, etc)
            // 0.350 a 1.000 (65.0%) -> Nada
            if (rand <= 0.035) {
                type = 'life';
            } else if (rand <= 0.215) {
                if (!isBanana) type = 'coin'; // La banana ya da +2 monedas directo
            } else if (rand <= 0.35) {
                const types = ['long', 'short', 'fireball', 'multiball', 'fast', 'inverted'];
                type = types[Math.floor(Math.random() * types.length)];
            }
        }

        if (type) {
            this.powerUps.push(new PowerUp(this, x, y, type));
        }
    }

    checkCollisions() {
        this.ccPaddle = this.paddle;
        
        for (this.ccI = 0; this.ccI < this.balls.length; this.ccI++) {
            this.ccBall = this.balls[this.ccI];
            this.ccRadius = this.ccBall.radius;

            // 1. Paddle collision (CCD + Circle to Rectangle Fallback)
            this.ccPaddleHit = false;

            if (this.ccBall.speedY > 0) {
                this.ccPrevBottomY = this.ccBall.prevY + this.ccRadius;
                this.ccCurrBottomY = this.ccBall.y + this.ccRadius;

                if (this.ccPrevBottomY <= this.ccPaddle.y && this.ccCurrBottomY >= this.ccPaddle.y) {
                    this.ccDy = this.ccCurrBottomY - this.ccPrevBottomY;
                    this.ccT = this.ccDy === 0 ? 0 : (this.ccPaddle.y - this.ccPrevBottomY) / this.ccDy;
                    this.ccXIntersect = this.ccBall.prevX + this.ccT * (this.ccBall.x - this.ccBall.prevX);

                    if (this.ccXIntersect >= this.ccPaddle.x && this.ccXIntersect <= this.ccPaddle.x + this.ccPaddle.width) {
                        this.ccBall.y = this.ccPaddle.y - this.ccRadius;
                        this.ccBall.x = this.ccXIntersect;
                        this.ccBall.squash(false);
                        playSFX('bounce');

                        this.ccSpeed = Math.sqrt(this.ccBall.speedX * this.ccBall.speedX + this.ccBall.speedY * this.ccBall.speedY);
                        this.ccHitPoint = (this.ccBall.x - (this.ccPaddle.x + this.ccPaddle.width / 2)) / (this.ccPaddle.width / 2); // -1 to 1

                        this.ccMaxAngle = 60 * Math.PI / 180;
                        this.ccAngle = this.ccHitPoint * this.ccMaxAngle;

                        this.ccBall.speedX = this.ccSpeed * Math.sin(this.ccAngle);
                        this.ccBall.speedY = -this.ccSpeed * Math.cos(this.ccAngle);

                        this.ccMinYVel = this.ccSpeed * 0.4;
                        if (Math.abs(this.ccBall.speedY) < this.ccMinYVel) {
                            this.ccBall.speedY = -this.ccMinYVel;
                            this.ccBall.speedX = Math.sign(this.ccBall.speedX) * Math.sqrt(this.ccSpeed * this.ccSpeed - this.ccMinYVel * this.ccMinYVel);
                        }
                        this.ccPaddleHit = true;
                    }
                }
            }

            if (!this.ccPaddleHit) {
                this.ccClosestX = Math.max(this.ccPaddle.x, Math.min(this.ccBall.x, this.ccPaddle.x + this.ccPaddle.width));
                this.ccClosestY = Math.max(this.ccPaddle.y, Math.min(this.ccBall.y, this.ccPaddle.y + this.ccPaddle.height));

                this.ccDistX = this.ccBall.x - this.ccClosestX;
                this.ccDistY = this.ccBall.y - this.ccClosestY;
                this.ccDistSq = this.ccDistX * this.ccDistX + this.ccDistY * this.ccDistY;

                if (this.ccDistSq < this.ccRadius * this.ccRadius) {
                    this.ccBall.y = this.ccPaddle.y - this.ccRadius;
                    this.ccBall.squash(false); // Squash vertically on paddle hit
                    playSFX('bounce');

                    this.ccSpeed = Math.sqrt(this.ccBall.speedX * this.ccBall.speedX + this.ccBall.speedY * this.ccBall.speedY);
                    this.ccHitPoint = (this.ccBall.x - (this.ccPaddle.x + this.ccPaddle.width / 2)) / (this.ccPaddle.width / 2); // -1 to 1
                    
                    this.ccMaxAngle = 60 * Math.PI / 180;
                    this.ccAngle = this.ccHitPoint * this.ccMaxAngle;

                    this.ccBall.speedX = this.ccSpeed * Math.sin(this.ccAngle);
                    this.ccBall.speedY = -this.ccSpeed * Math.cos(this.ccAngle);

                    this.ccMinYVel = this.ccSpeed * 0.4; // 40% of the ball's speed
                    if (Math.abs(this.ccBall.speedY) < this.ccMinYVel) {
                        this.ccBall.speedY = -this.ccMinYVel;
                        this.ccBall.speedX = Math.sign(this.ccBall.speedX) * Math.sqrt(this.ccSpeed * this.ccSpeed - this.ccMinYVel * this.ccMinYVel);
                    }
                }
            }

            // 2. Block collision (Circle to Rectangle with Side-Specific Bounce)
            for (this.ccJ = 0; this.ccJ < this.blocks.length; this.ccJ++) {
                this.ccBlock = this.blocks[this.ccJ];
                if (!this.ccBlock.active) continue;

                this.ccClosestX = Math.max(this.ccBlock.x, Math.min(this.ccBall.x, this.ccBlock.x + this.ccBlock.width));
                this.ccClosestY = Math.max(this.ccBlock.y, Math.min(this.ccBall.y, this.ccBlock.y + this.ccBlock.height));

                this.ccDistX = this.ccBall.x - this.ccClosestX;
                this.ccDistY = this.ccBall.y - this.ccClosestY;
                this.ccDistSq = this.ccDistX * this.ccDistX + this.ccDistY * this.ccDistY;

                if (this.ccDistSq < this.ccRadius * this.ccRadius) {
                    this.ccSideHitHorizontal = false;

                    // Fireball piercing logic: fireball does NOT bounce on breakable blocks, but DOES bounce on indestructible ones
                    if (!this.ccBall.isFireball || this.ccBlock.health === Infinity) {
                        this.ccDist = Math.sqrt(this.ccDistSq) || 0.001;
                        this.ccOverlapX = this.ccRadius - Math.abs(this.ccDistX);
                        this.ccOverlapY = this.ccRadius - Math.abs(this.ccDistY);

                        if (this.ccDistX === 0) {
                            this.ccBall.speedY = (this.ccBall.y < this.ccBlock.y) ? -Math.abs(this.ccBall.speedY) : Math.abs(this.ccBall.speedY);
                            this.ccBall.y += (this.ccBall.y < this.ccBlock.y) ? -this.ccOverlapY : this.ccOverlapY;
                        } else if (this.ccDistY === 0) {
                            this.ccBall.speedX = (this.ccBall.x < this.ccBlock.x) ? -Math.abs(this.ccBall.speedX) : Math.abs(this.ccBall.speedX);
                            this.ccBall.x += (this.ccBall.x < this.ccBlock.x) ? -this.ccOverlapX : this.ccOverlapX;
                            this.ccSideHitHorizontal = true;
                        } else {
                            if (this.ccOverlapX < this.ccOverlapY) {
                                this.ccBall.speedX = (this.ccBall.x < this.ccBlock.x) ? -Math.abs(this.ccBall.speedX) : Math.abs(this.ccBall.speedX);
                                this.ccBall.x += (this.ccBall.x < this.ccBlock.x) ? -this.ccOverlapX : this.ccOverlapX;
                                this.ccSideHitHorizontal = true;
                            } else {
                                this.ccBall.speedY = (this.ccBall.y < this.ccBlock.y) ? -Math.abs(this.ccBall.speedY) : Math.abs(this.ccBall.speedY);
                                this.ccBall.y += (this.ccBall.y < this.ccBlock.y) ? -this.ccOverlapY : this.ccOverlapY;
                            }
                        }
                    }

                    // Apply squash/stretch to ball
                    this.ccBall.squash(this.ccSideHitHorizontal);

                    // Handle damage, screen shake, particles, and score
                    if (this.ccBlock.health !== Infinity) {
                        this.ccBlock.health -= this.ccBall.damage;
                        if (this.ccBlock.health <= 0) {
                            this.ccBlock.active = false;
                            
                            // Aplica el multiplicador al valor del ladrillo
                            this.score += (this.ccBlock.points || 0) * (this.scoreMultiplier || 1);
                            this.updateUI();
                            
                            playSFX('brick');

                            // Trigger screen shake based on brick weight
                            if (this.ccBlock.maxHealth >= 3) {
                                this.triggerShake(0.2, 9);
                            } else if (this.ccBlock.maxHealth === 2) {
                                this.triggerShake(0.14, 5);
                            } else {
                                this.triggerShake(0.08, 3);
                            }

                            // Spawn particle explosion of brick color
                            this.ccParticleCount = 12 + Math.floor(Math.random() * 8);
                            this.spawnParticles(this.ccBlock.x + this.ccBlock.width / 2, this.ccBlock.y + this.ccBlock.height / 2, this.ccBlock.color, this.ccParticleCount);

                            // --- EFECTOS DE LOS EMOJIS ARCADE ---
                            if (this.ccBlock.fruitType === 'banana') {
                                this.coinsCollected += 2;
                                playSFX('coin');
                            } else if (this.ccBlock.fruitType === 'watermelon') {
                                this.explodeWatermelon(this.ccBlock);
                            } else if (this.ccBlock.fruitType === 'secret') {
                                this.ballFlashTimer = 3.0; // Hace parpadear la bola de colores
                            }

                            this.spawnPowerUp(this.ccBlock.x + this.ccBlock.width / 2, this.ccBlock.y + this.ccBlock.height / 2, this.ccBlock.fruitType === 'banana');
                        } else {
                            // Non-lethal hit: small impact shake
                            this.triggerShake(0.08, 2);
                            playSFX('bounce');
                            this.ccBlock.onHit();

                            // Small dust particle burst
                            this.spawnParticles(this.ccClosestX, this.ccClosestY, this.ccBlock.color, 4);
                        }
                    } else {
                        // Impact against indestructible obstacle block
                        this.triggerShake(0.08, 3.5);
                        playSFX('bounce');
                        
                        // Spawn sparks/dust particles
                        this.spawnParticles(this.ccClosestX, this.ccClosestY, '#94a3b8', 5);
                    }

                    // Check level win criteria
                    this.ccBreakablesLeft = false;
                    for (this.ccK = 0; this.ccK < this.blocks.length; this.ccK++) {
                        if (this.blocks[this.ccK].active && this.blocks[this.ccK].health !== Infinity) {
                            this.ccBreakablesLeft = true;
                            break;
                        }
                    }
                    if (!this.ccBreakablesLeft) {
                        this.levelUp();
                    }
                }
            }
        }
    }

    levelUp() {
        this.persistCollectedCoins();
        getCachedElement('game-buffs-container').classList.add('hidden');

        const isBossLevel = (this.level === 10 || this.level === 20 || this.level === 30 || this.level === 40 || this.level === 50);

        if (isBossLevel) {
            // Save progress to Shared Preferences first
            saveGameProgress(this.level + 1, this.score);
            this.state = 'CHEST_REWARD';
            pauseBGMusic();
            playSFX('powerup');

            const chestModal = getCachedElement('chest-modal');
            const chestAnim = getCachedElement('chest-animation-container');
            const chestDesc = getCachedElement('chest-modal-desc');
            const closeChestBtn = getCachedElement('close-chest-btn');

            chestModal.classList.remove('hidden');
            closeChestBtn.classList.add('hidden');

            // Reset animation
            chestAnim.textContent = '📦';
            chestAnim.className = 'chest-shake';
            chestDesc.textContent = 'Abriendo el cofre de la racha perfecta...';

            if (this.flawlessStreak) {
                let skinId = '';
                let skinName = '';
                if (this.level === 10) { skinId = 'neon_green'; skinName = 'Verde Neón'; }
                else if (this.level === 20) { skinId = 'sunset_orange'; skinName = 'Naranja Atardecer'; }
                else if (this.level === 30) { skinId = 'electric_blue'; skinName = 'Azul Eléctrico'; }
                else if (this.level === 40) { skinId = 'hot_pink'; skinName = 'Rosa Intenso'; }
                else if (this.level === 50) { skinId = 'golden_legend'; skinName = 'Leyenda Dorada'; }

                const unlocked = getUnlockedSkins();
                if (!unlocked.includes(skinId)) {
                    unlocked.push(skinId);
                    saveUnlockedSkins(unlocked);
                }

                setTimeout(() => {
                    chestAnim.textContent = '🎁';
                    playSFX('powerup');
                    setTimeout(() => {
                        chestAnim.className = '';
                        chestAnim.textContent = '🎨';
                        chestDesc.innerHTML = `¡Felicidades! Completaste la zona sin perder vidas y desbloqueaste el aspecto <span style="color: ${this.skinsDict[skinId].color}; font-weight: bold;">${skinName}</span>.`;
                        closeChestBtn.classList.remove('hidden');
                    }, 1200);
                }, 1200);
            } else {
                setTimeout(() => {
                    chestAnim.className = '';
                    chestAnim.textContent = '🔒';
                    chestDesc.textContent = 'Nivel superado, pero el cofre requiere una racha sin perder vidas. ¡Inténtalo de nuevo!';
                    closeChestBtn.classList.remove('hidden');
                }, 1500);
            }

            const handleClose = () => {
                chestModal.classList.add('hidden');
                closeChestBtn.removeEventListener('click', handleClose);
                
                this.state = 'LEVEL_CLEARED';
                getCachedElement('cleared-score').textContent = this.score;
                getCachedElement('level-cleared-screen').classList.remove('hidden');
            };
            closeChestBtn.addEventListener('click', handleClose);
        } else {
            saveGameProgress(this.level + 1, this.score);
            this.state = 'LEVEL_CLEARED';
            pauseBGMusic();
            playSFX('powerup');

            getCachedElement('cleared-score').textContent = this.score;
            getCachedElement('level-cleared-screen').classList.remove('hidden');
        }
    }

    loadNextLevel() {
        getCachedElement('level-cleared-screen').classList.add('hidden');
        this.level++;
        consecutiveWins++;
        if (this.level > 50) {
            this.triggerEndGameSequence();
        } else {
            this.state = 'PLAYING';
            startBGMusic();
            this.loadLevel(this.level);
            this.saveGameState(); // Auto-save at the start of the next level
            getCachedElement('game-buffs-container').classList.remove('hidden');
            this.updateBuffButtonsUI();
        }
        this.updateUI();
    }

    update(dt) {
        if (this.state === 'END_SEQUENCE') {
            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].update(dt);
            }
            return;
        }
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
        if (this.ballFlashTimer > 0) {
            this.ballFlashTimer -= dt;
        }

        // Update moving blocks in levels >= 20
        for (this.i = 0; this.i < this.blocks.length; this.i++) {
            this.blocks[this.i].update(dt);
        }

        // Update all balls
        for (this.i = 0; this.i < this.balls.length; this.i++) {
            this.balls[this.i].update(dt);
        }
        
        // Update paddle, powerups, particles, and coinPool
        this.paddle.update();
        for (this.i = 0; this.i < this.powerUps.length; this.i++) {
            this.powerUps[this.i].update(dt);
        }
        for (this.i = 0; this.i < this.coinPool.length; this.i++) {
            if (this.coinPool[this.i].active) {
                this.coinPool[this.i].update(dt);
                // Recycle if inactive (fallen or picked up) and we are still in Bonus Level
                if (!this.coinPool[this.i].active && this.isBonusLevel) {
                    this.coinPool[this.i].y = Math.floor(-(Math.random() * 2000) - 50);
                    this.coinPool[this.i].x = Math.floor(Math.random() * (this.width - 20) + 10);
                    this.coinPool[this.i].speedY = Math.floor(Math.random() * 200 + 100);
                    this.coinPool[this.i].active = true;
                }
            }
        }
        for (this.i = 0; this.i < this.particlePool.length; this.i++) {
            if (this.particlePool[this.i].active) this.particlePool[this.i].update(dt);
        }
        
        this.checkCollisions();

        // Handle balls falling below screen or bouncing off the safety net
        this.j = 0;
        for (this.i = 0; this.i < this.balls.length; this.i++) {
            if (this.isBonusLevel && this.balls[this.i].y + this.balls[this.i].radius >= this.height - 80) {
                // Safety net bounce
                this.balls[this.i].y = this.height - 80 - this.balls[this.i].radius;
                this.balls[this.i].speedY = -Math.abs(this.balls[this.i].speedY);
                this.balls[this.j] = this.balls[this.i];
                this.j++;
                // Optional: visual or audio cue on shield hit
            } else if (this.balls[this.i].y - this.balls[this.i].radius <= this.height) {
                this.balls[this.j] = this.balls[this.i];
                this.j++;
            }
        }
        this.balls.length = this.j;
        
        // If all balls are lost, lose a life
        if (this.balls.length === 0) {
            this.loseLife();
        }

        // Remove inactive powerUps inline
        this.j = 0;
        for (this.i = 0; this.i < this.powerUps.length; this.i++) {
            if (this.powerUps[this.i].active) {
                this.powerUps[this.j] = this.powerUps[this.i];
                this.j++;
            }
        }
        this.powerUps.length = this.j;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();

        // Apply Screen Shake if active
        if (this.shakeDuration > 0) {
            this.dx = (Math.random() - 0.5) * this.shakeIntensity;
            this.dy = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(this.dx, this.dy);
        }

        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
            // Dibujar láser protector en Nivel Bonus sin shadowBlur (Zero GC / Alta VRAM)
            if (this.isBonusLevel) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 150) * 0.4;
                
                // Línea gruesa de resplandor (Overdraw effect)
                this.ctx.beginPath();
                this.ctx.moveTo(0, Math.floor(this.height - 80));
                this.ctx.lineTo(this.width, Math.floor(this.height - 80));
                this.ctx.strokeStyle = 'rgba(0, 255, 204, 0.4)';
                this.ctx.lineWidth = 10;
                this.ctx.stroke();

                // Línea fina central
                this.ctx.beginPath();
                this.ctx.moveTo(0, Math.floor(this.height - 80));
                this.ctx.lineTo(this.width, Math.floor(this.height - 80));
                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                this.ctx.restore();
            }

            this.paddle.draw(this.ctx);
            for (this.i = 0; this.i < this.balls.length; this.i++) {
                this.balls[this.i].draw(this.ctx);
            }
            for (this.i = 0; this.i < this.blocks.length; this.i++) {
                this.blocks[this.i].draw(this.ctx);
            }
            for (this.i = 0; this.i < this.powerUps.length; this.i++) {
                this.powerUps[this.i].draw(this.ctx);
            }
            
            // Batch rendering para la lluvia de monedas (Zero Overhead)
            if (this.isBonusLevel) {
                this.ctx.font = "24px serif";
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                for (this.i = 0; this.i < this.coinPool.length; this.i++) {
                    if (this.coinPool[this.i].active) {
                        this.ctx.fillText(this.coinPool[this.i].emoji, Math.floor(this.coinPool[this.i].x), Math.floor(this.coinPool[this.i].y));
                    }
                }
            }
            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].draw(this.ctx);
            }
        } else if (this.state === 'END_SEQUENCE') {
            for (this.i = 0; this.i < this.particlePool.length; this.i++) {
                if (this.particlePool[this.i].active) this.particlePool[this.i].draw(this.ctx);
            }
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
            superPowerCount: this.superPowerCount,
            flawlessStreak: this.flawlessStreak
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
            this.flawlessStreak = (state.flawlessStreak !== undefined) ? state.flawlessStreak : false;
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
            getCachedElement('game-buffs-container').classList.remove('hidden');
            this.updateBuffButtonsUI();

            getCachedElement('start-screen').classList.add('hidden');
            getCachedElement('game-over-screen').classList.add('hidden');
            getCachedElement('win-screen').classList.add('hidden');
            getCachedElement('pause-screen').classList.add('hidden');
            getCachedElement('level-cleared-screen').classList.add('hidden');

            return true;
        } catch (e) {
            console.error("Error parsing/loading saved state:", e);
            return false;
        }
    }

    checkAndSaveScore() {
        // Persist collected coins before saving scores
        this.persistCollectedCoins();

        const currentHighScore = parseInt(localStorage.getItem('eb_highscore')) || 0;
        
        // Si hay una nueva puntuación récord, se solicita el apodo y se sube a Firebase
        if (this.score > currentHighScore && this.score > 0) {
            localStorage.setItem('eb_highscore', this.score);

            const savedNickname = localStorage.getItem('eb_nickname') || "";
            getCachedElement('nickname-input').value = savedNickname;
            
            // Ocultar otras overlays y mostrar modal del apodo
            getCachedElement('game-over-screen').classList.add('hidden');
            getCachedElement('win-screen').classList.add('hidden');
            getCachedElement('nickname-modal').classList.remove('hidden');
            
            // Vincular evento al botón de guardado
            const saveBtn = getCachedElement('save-nickname-btn');
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            
            newSaveBtn.addEventListener('click', () => {
                let nickname = getCachedElement('nickname-input').value.trim();
                if (!nickname) nickname = "JugadorAnónimo";
                
                localStorage.setItem('eb_nickname', nickname);
                
                if (typeof guardarRécordGlobal === 'function') {
                    guardarRécordGlobal(nickname, this.score);
                }
                
                // Si aún usamos Android Interface en paralelo, también le pasamos el récord
                if (window.AndroidInterface) {
                    const profilePic = window.AndroidInterface.getPlayerProfilePic() || "";
                    window.AndroidInterface.saveProgressWithProfile(this.level, this.score, nickname, profilePic);
                }

                clearSessionState();
                this.updateRecordDisplay();
                
                // Ocultar modal del apodo y mostrar pantalla final
                getCachedElement('nickname-modal').classList.add('hidden');
                this.showEndScreen();
            });
        } else {
            // Guardado tradicional local
            saveGameProgress(this.level, this.score);
            clearSessionState();
            this.updateRecordDisplay();
            this.showEndScreen();
        }
    }

    showEndScreen() {
        getCachedElement('game-buffs-container').classList.add('hidden');
        if (this.state === 'GAMEOVER') {
            getCachedElement('final-score').textContent = this.score;
            
            // Frases sarcásticas y graciosas al azar al perder
            const quotes = [
                "¿En serio? Era el nivel más fácil...",
                "El código no tiene la culpa de tus reflejos.",
                "La gravedad: 1 | Tú: 0",
                "Esa bola tenía familia y la has dejado caer.",
                "¡Vaya jugada! Mis abuelitos tienen mejores reflejos.",
                "¿Estabas jugando con el dedo tapando la barra, o qué?",
                "Game Over. Por favor, inserta más talento.",
                "Tranquilo, la práctica hace al maestro... aunque a ti te tomará vidas."
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const quoteEl = getCachedElement('game-over-quote');
            if (quoteEl) {
                quoteEl.textContent = randomQuote;
            }
            
            getCachedElement('game-over-screen').classList.remove('hidden');
        } else if (this.state === 'VICTORY') {
            getCachedElement('win-screen').classList.remove('hidden');
        }
    }

    onLeaderboardLoaded(jsonString) {
        try {
            const list = JSON.parse(jsonString);
            const tbody = getCachedElement('leaderboard-tbody');
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
            const tbody = getCachedElement('leaderboard-tbody');
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="4" style="color: #ef4444; text-align: center;">Error al cargar el ranking.</td></tr>`;
            }
        }
    }

    onLeaderboardError(errorMsg) {
        const tbody = getCachedElement('leaderboard-tbody');
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

        const nameInput = getCachedElement('profile-name-input');
        if (nameInput) nameInput.value = nickname;

        const emailInput = getCachedElement('profile-email-input');
        if (emailInput) emailInput.value = email;

        const preview = getCachedElement('profile-avatar-preview');
        if (preview) {
            preview.src = profilePic || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";
        }

        const googleLoginBtn = getCachedElement('google-login-btn');
        const logoutBtn = getCachedElement('logout-btn');

        if (authJson.provider === 'google') {
            if (googleLoginBtn) googleLoginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            if (googleLoginBtn) googleLoginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
        }
    }

    saveUserProfile() {
        const nameInput = getCachedElement('profile-name-input');
        const emailInput = getCachedElement('profile-email-input');
        const preview = getCachedElement('profile-avatar-preview');

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
        getCachedElement('profile-screen').classList.add('hidden');
        this.updateRecordDisplay();
    }

    onProfilePictureSelected(base64Image) {
        const preview = getCachedElement('profile-avatar-preview');
        if (preview) {
            preview.src = base64Image;
        }
    }

    onAuthSuccess(userJsonString) {
        try {
            const user = JSON.parse(userJsonString);

            const nameInput = getCachedElement('profile-name-input');
            if (nameInput) nameInput.value = user.name || "";

            const emailInput = getCachedElement('profile-email-input');
            if (emailInput) emailInput.value = user.email || "";

            if (user.email) {
                localStorage.setItem('player_email', user.email);
            }

            const preview = getCachedElement('profile-avatar-preview');
            if (preview) {
                preview.src = user.photoUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";
            }

            const googleLoginBtn = getCachedElement('google-login-btn');
            const logoutBtn = getCachedElement('logout-btn');

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

    onProgressRestored(level, score) {
        try {
            console.log(`onProgressRestored invocado: Lvl ${level}, Score ${score}`);
            this.level = level;
            this.score = 0; // Reinicia el puntaje de la sesión actual
            this.lives = 3;
            
            if (this.state === 'MENU') {
                this.updateRecordDisplay();
                this.showMainMenu();
            }
            alert(`¡Progreso recuperado con éxito de la nube!\nRécord: ${score} puntos\nNivel Máximo: ${level}`);
        } catch (e) {
            console.error("Error en onProgressRestored:", e);
        }
    }

    onAuthLogout() {
        const nameInput = getCachedElement('profile-name-input');
        if (nameInput) nameInput.value = "";

        const emailInput = getCachedElement('profile-email-input');
        if (emailInput) emailInput.value = "";

        localStorage.removeItem('player_email');

        const preview = getCachedElement('profile-avatar-preview');
        if (preview) {
            preview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>👤</text></svg>";
        }

        const googleLoginBtn = getCachedElement('google-login-btn');
        const logoutBtn = getCachedElement('logout-btn');

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

        const display = getCachedElement('shop-coins-display');
        if (display) display.textContent = coins;

        // Reset tabs to Buffs by default on opening
        const tabShopBuffs = getCachedElement('tab-shop-buffs-btn');
        const tabShopSkins = getCachedElement('tab-shop-skins-btn');
        if (tabShopBuffs && tabShopSkins) {
            tabShopBuffs.classList.add('active-tab');
            tabShopSkins.classList.remove('active-tab');
            getCachedElement('panel-shop-buffs').classList.remove('hidden');
            getCachedElement('panel-shop-skins').classList.add('hidden');
        }

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

        const titleText = getCachedQuery('#shop-screen h1');
        if (titleText) {
            titleText.innerHTML = `TIENDA<br><span style="font-size: 0.85rem; color: #94a3b8; font-weight: normal;">${limitMsg}</span>`;
        }

        // Update purchase buttons based on counts and limits
        const buyDoubleBtn = getCachedElement('buy-double-score-btn');
        if (buyDoubleBtn) {
            buyDoubleBtn.innerHTML = `50 🪙<br><span style="font-size: 0.7rem; color: rgba(255,255,255,0.7); font-weight: normal;">En Stock: ${this.doubleScoreCount}</span>`;
            buyDoubleBtn.disabled = coins < 50 || dailyLimitReached;
            if (coins >= 50 && !dailyLimitReached) {
                buyDoubleBtn.classList.add('can-buy');
            } else {
                buyDoubleBtn.classList.remove('can-buy');
            }
        }

        const buySuperBtn = getCachedElement('buy-super-power-btn');
        if (buySuperBtn) {
            buySuperBtn.innerHTML = `100 🪙<br><span style="font-size: 0.7rem; color: rgba(255,255,255,0.7); font-weight: normal;">En Stock: ${this.superPowerCount}</span>`;
            buySuperBtn.disabled = coins < 100 || dailyLimitReached;
            if (coins >= 100 && !dailyLimitReached) {
                buySuperBtn.classList.add('can-buy');
            } else {
                buySuperBtn.classList.remove('can-buy');
            }
        }

        // Render ball skins list
        this.renderBallSkinsShop();
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

    renderBallSkinsShop() {
        const container = getCachedElement('shop-ball-skins-container');
        if (!container) return;
        container.innerHTML = '';

        let coins = 0;
        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        const owned = this.ownedBallSkins || ['default'];
        const equipped = this.equippedBallSkin || 'default';

        for (const [id, skin] of Object.entries(this.ballSkinsDict)) {
            const item = document.createElement('div');
            item.className = 'shop-item skin-card';

            const icon = document.createElement('div');
            icon.className = 'shop-item-icon';
            if (skin.src) {
                const img = document.createElement('img');
                img.src = skin.src;
                img.className = 'shop-item-img';
                icon.appendChild(img);
            } else {
                icon.textContent = skin.emoji;
            }

            const name = document.createElement('span');
            name.className = 'shop-item-name';
            // Strip emojis from the name for a cleaner appearance under the larger icon
            name.textContent = skin.name.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();

            const button = document.createElement('button');
            button.className = 'buy-btn';

            const isOwned = owned.includes(id);
            if (id === equipped) {
                button.classList.add('equipped');
                button.textContent = 'EQUIPADO';
                button.style.background = 'rgba(16, 185, 129, 0.4)';
                button.style.borderColor = '#10b981';
                button.disabled = true;
            } else if (isOwned) {
                button.textContent = 'EQUIPAR';
                button.addEventListener('click', () => {
                    playSFX('bounce');
                    this.equippedBallSkin = id;
                    saveEquippedBallSkin(id);
                    
                    // Update ball emojis for active balls if needed
                    this.balls.forEach(ball => {
                        ball.emoji = skin.emoji.split('')[0] || '🏐';
                    });

                    this.renderBallSkinsShop();
                });
            } else {
                button.textContent = `${skin.price} 🪙`;
                button.disabled = coins < skin.price;
                if (coins >= skin.price) {
                    button.classList.add('can-buy');
                } else {
                    button.classList.remove('can-buy');
                }
                button.addEventListener('click', () => {
                    this.buyBallSkin(id, skin.price);
                });
            }

            item.appendChild(icon);
            item.appendChild(name);
            item.appendChild(button);
            container.appendChild(item);
        }
    }

    buyBallSkin(id, price) {
        let coins = 0;
        if (window.AndroidInterface && window.AndroidInterface.getCoins) {
            coins = window.AndroidInterface.getCoins();
        } else {
            coins = parseInt(localStorage.getItem('player_coins') || '0', 10);
        }

        if (coins < price) {
            alert("No tienes suficientes monedas.");
            return;
        }

        coins -= price;
        if (window.AndroidInterface && window.AndroidInterface.saveCoins) {
            window.AndroidInterface.saveCoins(coins);
        } else {
            localStorage.setItem('player_coins', coins.toString());
        }

        this.ownedBallSkins.push(id);
        saveOwnedBallSkins(this.ownedBallSkins);

        playSFX('shop');
        
        // Reload HUD coins display
        const display = getCachedElement('shop-coins-display');
        if (display) display.textContent = coins;

        this.renderBallSkinsShop();
    }

    updateBuffButtonsUI() {
        const doubleBadge = getCachedElement('double-score-count-badge');
        if (doubleBadge) doubleBadge.textContent = this.doubleScoreCount;

        const superBadge = getCachedElement('super-power-count-badge');
        if (superBadge) superBadge.textContent = this.superPowerCount;
        
        const doubleBtn = getCachedElement('activate-double-score-btn');
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

        const superBtn = getCachedElement('activate-super-power-btn');
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
        const toast = getCachedElement('buff-toast');
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

            getCachedElement('extra-life-modal').classList.add('hidden');
            getCachedElement('game-buffs-container').classList.remove('hidden');

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
        getCachedElement('extra-life-modal').classList.add('hidden');
        this.state = 'GAMEOVER';
        startBGMusic();
        this.checkAndSaveScore();
    }

    updateDailyGiftUI() {
        const giftBtn = getCachedElement('daily-gift-btn');
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

        const shopCoinsDisplay = getCachedElement('shop-coins-display');
        if (shopCoinsDisplay) {
            shopCoinsDisplay.textContent = coins;
        }

        alert("has cobrado tus 50 monedas de regalo diarias ");
    }

    updateZoneBackground(level) {
        const container = getCachedQuery('.game-container');
        if (!container) return;
        let bg = '';
        if (level <= 10) {
            bg = 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)';
        } else if (level <= 20) {
            bg = 'radial-gradient(circle at center, #064e3b 0%, #022c22 100%)';
        } else if (level <= 30) {
            bg = 'radial-gradient(circle at center, #4c1d95 0%, #0f172a 100%)';
        } else if (level <= 40) {
            bg = 'radial-gradient(circle at center, #7f1d1d 0%, #020617 100%)';
        } else {
            bg = 'radial-gradient(circle at center, #78350f 0%, #020617 100%)';
        }
        container.style.background = bg;
    }

    renderLevelSelector() {
        const grid = getCachedElement('levels-grid');
        if (!grid) return;
        grid.innerHTML = '';

        let maxLevel = 1;
        if (window.AndroidInterface && window.AndroidInterface.getMaxLevel) {
            maxLevel = window.AndroidInterface.getMaxLevel();
        } else {
            maxLevel = parseInt(localStorage.getItem('max_level') || '1', 10);
        }

        for (let i = 1; i <= 50; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-item-btn';
            if (i > maxLevel) {
                btn.classList.add('locked');
                btn.innerHTML = '🔒';
            } else {
                btn.textContent = i;
                btn.addEventListener('click', () => {
                    playSFX('bounce');
                    getCachedElement('level-select-screen').classList.add('hidden');
                    this.startAtLevel(i);
                });
            }
            grid.appendChild(btn);
        }
    }

    renderSkinsSelector() {
        const container = getCachedElement('skins-container');
        if (!container) return;
        container.innerHTML = '';

        const unlocked = getUnlockedSkins();
        const equipped = getEquippedSkin();

        for (const [id, skin] of Object.entries(this.skinsDict)) {
            const item = document.createElement('div');
            item.className = 'skin-item';
            if (id === equipped) {
                item.classList.add('equipped');
            }

            const info = document.createElement('div');
            info.className = 'skin-item-info';

            const name = document.createElement('span');
            name.className = 'skin-item-name';
            name.textContent = skin.name;

            const desc = document.createElement('span');
            desc.className = 'skin-item-desc';
            desc.textContent = skin.desc;

            info.appendChild(name);
            info.appendChild(desc);

            const previewContainer = document.createElement('div');
            previewContainer.className = 'skin-preview-container';

            const preview = document.createElement('div');
            preview.className = 'skin-preview';
            preview.style.backgroundColor = skin.color;
            preview.style.color = skin.color;

            previewContainer.appendChild(preview);

            const button = document.createElement('button');
            button.className = 'equip-btn';

            const isUnlocked = unlocked.includes(id);
            if (id === equipped) {
                button.classList.add('equipped');
                button.textContent = 'EQUIPADO';
            } else if (isUnlocked) {
                button.textContent = 'EQUIPAR';
                button.addEventListener('click', () => {
                    playSFX('bounce');
                    saveEquippedSkin(id);
                    if (this.paddle) {
                        this.paddle.color = skin.color;
                    }
                    this.renderSkinsSelector();
                });
            } else {
                button.classList.add('locked');
                button.textContent = 'BLOQUEADO';
            }

            previewContainer.appendChild(button);
            item.appendChild(info);
            item.appendChild(previewContainer);

            container.appendChild(item);
        }
    }

    startAtLevel(level) {
        clearSessionState();
        this.state = 'PLAYING';
        this.level = level;
        this.score = 0;
        this.lives = 3;

        getCachedElement('start-screen').classList.add('hidden');
        getCachedElement('game-over-screen').classList.add('hidden');
        getCachedElement('win-screen').classList.add('hidden');
        getCachedElement('pause-screen').classList.add('hidden');
        getCachedElement('level-cleared-screen').classList.add('hidden');

        this.paddleTimer = 0;
        this.fireballTimer = 0;
        this.speedTimer = 0;
        this.invertTimer = 0;
        this.doubleScoreTimer = 0;

        this.paddle = new Paddle(this);
        this.balls = [new Ball(this)];
        this.powerUps = [];
        for (let i = 0; i < this.particlePool.length; i++) {
            this.particlePool[i].active = false;
        }
        this.shakeDuration = 0;
        this.coinsCollected = 0;
        this.scoreMultiplier = 1;

        this.doubleScoreCount = getDoubleScoreCount();
        this.superPowerCount = getSuperPowerCount();

        getCachedElement('game-buffs-container').classList.remove('hidden');
        this.updateBuffButtonsUI();
        
        this.updateUI();
        this.updateRecordDisplay();
        
        startBGMusic();
        this.updateMuteButtonVisual();
        
        if (level === 1 || level === 11 || level === 21 || level === 31 || level === 41) {
            this.flawlessStreak = true;
        } else {
            this.flawlessStreak = false;
        }

        this.loadLevel(this.level);
    }

    loop(timestamp) {
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
            firebase.database().ref('leaderboard').once('value').then(snap => {
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
}


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

    gameInstance = new Game();
    gameInstance.init();
});

// ==========================================
// FIREBASE BACKEND INTEGRATION (LEADERBOARD)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDxWTvtUiE3hG0fPOin2TNJ1s4elDcCDss",
    authDomain: "emoji-breakout.firebaseapp.com",
    databaseURL: "https://emoji-breakout-default-rtdb.firebaseio.com",
    projectId: "emoji-breakout",
    storageBucket: "emoji-breakout.firebasestorage.app",
    messagingSenderId: "1039875513324",
    appId: "1:1039875513324:web:66d66fd69584743ec03ec9",
    measurementId: "G-H66R5G6ENJ"
};
firebase.initializeApp(firebaseConfig);

async function cargarRankingGlobal() {
    if (typeof syncR1AchievementToFirebase === 'function') syncR1AchievementToFirebase();
    const tbody = getCachedElement('leaderboard-tbody');
    if (!tbody) return;
    
    // Si Firebase no está inicializado, mostrar aviso
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Error: Firebase no está configurado.</td></tr>`;
        return;
    }

    try {
        const db = firebase.database();
        // REGLA ESTRICTA: Leer EXCLUSIVAMENTE de 'leaderboard'
        const snap = await db.ref('leaderboard').orderByChild('score').limitToLast(50).once('value');
        
        if (snap.exists()) {
            let scores = [];
            snap.forEach(child => {
                scores.push(child.val());
            });
            // Ordenar de mayor a menor
            scores.reverse();

            tbody.innerHTML = '';
            scores.forEach((data, index) => {
                let medal = `${index + 1}`;
                if (index === 0) medal = '🥇';
                if (index === 1) medal = '🥈';
                if (index === 2) medal = '🥉';

                let avatarSrc = data.profilePic || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%238b5cf6'/><text x='40' y='50' font-size='32' text-anchor='middle' fill='white'>?</text></svg>";
                const tr = document.createElement('tr');
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
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Aún no hay récords. ¡Sé el primero!</td></tr>`;
        }
    } catch (e) {
        console.error("Error al cargar ranking de Firebase:", e);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Error de conexión.</td></tr>`;
    }
}

async function guardarRécordGlobal(nickname, puntaje) {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;

    try {
        const db = firebase.database();
        let uid = localStorage.getItem('eb_uid');
        if (!uid) {
            uid = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            localStorage.setItem('eb_uid', uid);
        }
        
        // REGLA ESTRICTA: Escribir EXCLUSIVAMENTE en 'leaderboard'
        await db.ref('leaderboard/' + uid).set({
            name: nickname,
            score: puntaje,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        console.log("Récord guardado exitosamente en Firebase (leaderboard).");
    } catch (e) {
        console.error("Error al guardar récord en Firebase:", e);
    }
}
