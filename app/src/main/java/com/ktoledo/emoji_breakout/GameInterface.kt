package com.ktoledo.emoji_breakout

import android.content.Context
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONArray
import org.json.JSONObject

class GameInterface(private val context: Context, private val webView: WebView) {

    companion object {
        private const val TAG = "GameInterface"
    }

    private val soundManager = SoundManager.getInstance(context)
    private val preferences = context.getSharedPreferences("EmojiBreakoutPrefs", Context.MODE_PRIVATE)
    private val cloudRepository: ScoreRepository = FirebaseScoreRepository(context)

    init {
        // Standard production game behavior (no dev overrides)
    }

    @JavascriptInterface
    fun playSFX(name: String) {
        soundManager.playSFX(name)
    }

    @JavascriptInterface
    fun startMusic() {
        soundManager.startMusic()
    }

    @JavascriptInterface
    fun pauseMusic() {
        soundManager.pauseMusic()
    }

    @JavascriptInterface
    fun toggleMute(): Boolean {
        return soundManager.toggleMute()
    }

    @JavascriptInterface
    fun isMuted(): Boolean {
        return soundManager.isMuted()
    }

    @JavascriptInterface
    fun saveProgress(level: Int, score: Int) {
        val editor = preferences.edit()
        
        // Save Max Level Unlocked
        val currentMaxLevel = preferences.getInt("max_level", 1)
        if (level > currentMaxLevel) {
            editor.putInt("max_level", level)
        }

        // Save High Score
        val currentHighScore = preferences.getInt("high_score", 0)
        var isNewHighScore = false
        if (score > currentHighScore) {
            editor.putInt("high_score", score)
            isNewHighScore = true
        }
        editor.apply()

        // Sincronizar con Firebase de fondo solo si es una nueva puntuación récord
        if (isNewHighScore) {
            val savedNickname = preferences.getString("player_nickname", "JugadorAnónimo") ?: "JugadorAnónimo"
            val savedProfilePic = preferences.getString("player_profile_pic", "") ?: ""
            cloudRepository.updateHighScore(
                playerName = savedNickname,
                score = score,
                maxLevel = level,
                profilePic = savedProfilePic,
                onSuccess = { Log.d(TAG, "Progreso sincronizado automáticamente en Firebase.") },
                onFailure = { e -> Log.e(TAG, "Error al sincronizar progreso automático en Firebase: ${e.message}") }
            )
        }
    }

    @JavascriptInterface
    fun saveProgressWithNickname(level: Int, score: Int, nickname: String) {
        val savedProfilePic = preferences.getString("player_profile_pic", "") ?: ""
        saveProgressWithProfile(level, score, nickname, savedProfilePic)
    }

    @JavascriptInterface
    fun saveUserProfile(nickname: String, profilePic: String) {
        val editor = preferences.edit()
        editor.putString("player_nickname", nickname)
        editor.putString("player_profile_pic", profilePic)
        editor.apply()
        Log.d(TAG, "Perfil de usuario actualizado localmente.")
        
        // Sincronizar también con Firebase si el usuario está autenticado
        val user = com.google.firebase.auth.FirebaseAuth.getInstance().currentUser
        if (user != null) {
            val currentHighScore = preferences.getInt("high_score", 0)
            val currentMaxLevel = preferences.getInt("max_level", 1)
            cloudRepository.updateHighScore(
                playerName = nickname,
                score = currentHighScore,
                maxLevel = currentMaxLevel,
                profilePic = profilePic,
                onSuccess = { Log.d(TAG, "Perfil sincronizado con Firebase.") },
                onFailure = { e -> Log.e(TAG, "Error al sincronizar perfil con Firebase: ${e.message}") }
            )
        }
    }

    @JavascriptInterface
    fun saveProgressWithProfile(level: Int, score: Int, nickname: String, profilePic: String) {
        val editor = preferences.edit()
        
        // Guardar nivel máximo
        val currentMaxLevel = preferences.getInt("max_level", 1)
        if (level > currentMaxLevel) {
            editor.putInt("max_level", level)
        }

        // Guardar puntuación récord
        val currentHighScore = preferences.getInt("high_score", 0)
        var isNewHighScore = false
        if (score > currentHighScore) {
            editor.putInt("high_score", score)
            isNewHighScore = true
        }

        // Guardar apodo y foto del jugador localmente
        editor.putString("player_nickname", nickname)
        editor.putString("player_profile_pic", profilePic)
        editor.apply()

        // Subir récord a Firebase Realtime Database solo si es una nueva puntuación récord
        if (isNewHighScore) {
            cloudRepository.updateHighScore(
                playerName = nickname,
                score = score,
                maxLevel = level,
                profilePic = profilePic,
                onSuccess = { Log.d(TAG, "Récord subido a Firebase con éxito.") },
                onFailure = { e -> Log.e(TAG, "Error al subir récord a Firebase: ${e.message}") }
            )
        }
    }

    @JavascriptInterface
    fun getPlayerNickname(): String {
        return preferences.getString("player_nickname", "") ?: ""
    }

    @JavascriptInterface
    fun getPlayerProfilePic(): String {
        return preferences.getString("player_profile_pic", "") ?: ""
    }

    @JavascriptInterface
    fun getMaxLevel(): Int {
        return preferences.getInt("max_level", 1)
    }

    @JavascriptInterface
    fun getHighScore(): Int {
        return preferences.getInt("high_score", 0)
    }

    // --- LEADERBOARD GLOBAL (TOP 50) ---

    @JavascriptInterface
    fun fetchLeaderboard() {
        Log.d(TAG, "Iniciando descarga del Leaderboard desde Firebase...")
        cloudRepository.getGlobalLeaderboard(
            onSuccess = { list ->
                val jsonString = serializeLeaderboard(list)
                webView.post {
                    webView.evaluateJavascript(
                        "if (window.gameInstance) window.gameInstance.onLeaderboardLoaded('${escapeJson(jsonString)}');",
                        null
                    )
                }
            },
            onFailure = { e ->
                Log.e(TAG, "Error al recuperar Leaderboard: ${e.message}")
                webView.post {
                    webView.evaluateJavascript(
                        "if (window.gameInstance) window.gameInstance.onLeaderboardError('${escapeJson(e.message ?: "Error desconocido")}');",
                        null
                    )
                }
            }
        )
    }

    private fun serializeLeaderboard(list: List<LeaderboardEntry>): String {
        val jsonArray = JSONArray()
        for (entry in list) {
            val jsonObj = JSONObject()
            jsonObj.put("name", entry.name)
            jsonObj.put("score", entry.score)
            jsonObj.put("maxLevel", entry.maxLevel)
            jsonObj.put("profilePic", entry.profilePic)
            jsonArray.put(jsonObj)
        }
        return jsonArray.toString()
    }

    private fun escapeJson(str: String): String {
        return str.replace("\\", "\\\\").replace("'", "\\'")
    }

    // --- SESIÓN DE JUEGO PERSISTENTE (GUARDAR Y REANUDAR ESTADO) ---

    @JavascriptInterface
    fun saveSession(jsonState: String) {
        preferences.edit().putString("saved_session", jsonState).apply()
        Log.d(TAG, "Sesión de juego guardada con éxito.")
    }

    @JavascriptInterface
    fun loadSession(): String? {
        val session = preferences.getString("saved_session", null)
        Log.d(TAG, "Cargando sesión de juego. ¿Existe? ${session != null}")
        return session
    }

    @JavascriptInterface
    fun clearSession() {
        preferences.edit().remove("saved_session").apply()
        Log.d(TAG, "Sesión de juego borrada.")
    }

    // --- CONTROL DE AUTENTICACIÓN (GOOGLE Y PERFIL PERSONALIZADO) ---

    @JavascriptInterface
    fun loginWithGoogle() {
        (context as? MainActivity)?.let { activity ->
            activity.runOnUiThread {
                activity.launchGoogleSignIn()
            }
        }
    }

    @JavascriptInterface
    fun selectProfilePicture() {
        (context as? MainActivity)?.let { activity ->
            activity.runOnUiThread {
                activity.launchGalleryPicker()
            }
        }
    }

    @JavascriptInterface
    fun logout() {
        (context as? MainActivity)?.let { activity ->
            activity.runOnUiThread {
                activity.logoutFromFirebase()
            }
        }
    }

    @JavascriptInterface
    fun getAuthStatus(): String {
        return (context as? MainActivity)?.getCurrentUserStatus() ?: "{}"
    }

    @JavascriptInterface
    fun saveCoins(coins: Int) {
        preferences.edit().putInt("player_coins", coins).apply()
        Log.d(TAG, "Monedas del usuario actualizadas a: $coins")
    }

    @JavascriptInterface
    fun getCoins(): Int {
        return preferences.getInt("player_coins", 0)
    }

    @JavascriptInterface
    fun saveDoubleScoreCount(count: Int) {
        preferences.edit().putInt("player_double_score_count", count).apply()
        Log.d(TAG, "Double score count updated to: $count")
    }

    @JavascriptInterface
    fun getDoubleScoreCount(): Int {
        return preferences.getInt("player_double_score_count", 0)
    }

    @JavascriptInterface
    fun saveSuperPowerCount(count: Int) {
        preferences.edit().putInt("player_super_power_count", count).apply()
        Log.d(TAG, "Super power count updated to: $count")
    }

    @JavascriptInterface
    fun getSuperPowerCount(): Int {
        return preferences.getInt("player_super_power_count", 0)
    }

    @JavascriptInterface
    fun saveShopLimits(countToday: Int, firstPurchaseTime: Long) {
        preferences.edit()
            .putInt("shop_purchase_count_today", countToday)
            .putLong("shop_first_purchase_time", firstPurchaseTime)
            .apply()
        Log.d(TAG, "Shop limits updated today: $countToday, first time: $firstPurchaseTime")
    }

    @JavascriptInterface
    fun getShopPurchaseCountToday(): Int {
        return preferences.getInt("shop_purchase_count_today", 0)
    }

    @JavascriptInterface
    fun getShopFirstPurchaseTime(): Long {
        return preferences.getLong("shop_first_purchase_time", 0L)
    }

    @JavascriptInterface
    fun saveLastDailyGiftClaimTime(time: Long) {
        preferences.edit().putLong("last_daily_gift_claim_time", time).apply()
        Log.d(TAG, "Last daily gift claim time updated to: $time")
    }

    @JavascriptInterface
    fun getLastDailyGiftClaimTime(): Long {
        return preferences.getLong("last_daily_gift_claim_time", 0L)
    }

    @JavascriptInterface
    fun saveSkins(unlockedSkins: String, equippedSkin: String) {
        preferences.edit()
            .putString("player_unlocked_skins", unlockedSkins)
            .putString("player_equipped_skin", equippedSkin)
            .apply()
        Log.d(TAG, "Skins updated. Unlocked: $unlockedSkins, Equipped: $equippedSkin")
    }

    @JavascriptInterface
    fun getUnlockedSkins(): String {
        return preferences.getString("player_unlocked_skins", "default") ?: "default"
    }

    @JavascriptInterface
    fun getEquippedSkin(): String {
        return preferences.getString("player_equipped_skin", "default") ?: "default"
    }

    @JavascriptInterface
    fun saveSettings(highGraphics: Boolean) {
        preferences.edit().putBoolean("high_graphics_enabled", highGraphics).apply()
        Log.d(TAG, "Configuración de gráficos guardada: $highGraphics")
    }

    @JavascriptInterface
    fun loadSettings(): Boolean {
        val highGraphics = preferences.getBoolean("high_graphics_enabled", true)
        Log.d(TAG, "Configuración de gráficos cargada: $highGraphics")
        return highGraphics
    }

    @JavascriptInterface
    fun setMusicVolume(volume: Float) {
        soundManager.setMusicVolume(volume)
    }

    @JavascriptInterface
    fun setSfxVolume(volume: Float) {
        soundManager.setSfxVolume(volume)
    }

    @JavascriptInterface
    fun getMusicVolume(): Float {
        return soundManager.getMusicVolume()
    }

    @JavascriptInterface
    fun getSfxVolume(): Float {
        return soundManager.getSfxVolume()
    }

    @JavascriptInterface
    fun saveInventory(ownedSkinsJSON: String) {
        preferences.edit().putString("player_owned_ball_skins", ownedSkinsJSON).apply()
        Log.d(TAG, "Inventory ball skins saved: $ownedSkinsJSON")
    }

    @JavascriptInterface
    fun loadInventory(): String {
        return preferences.getString("player_owned_ball_skins", "[\"default\"]") ?: "[\"default\"]"
    }

    @JavascriptInterface
    fun saveEquippedBallSkin(skinId: String) {
        preferences.edit().putString("player_equipped_ball_skin", skinId).apply()
        Log.d(TAG, "Equipped ball skin saved: $skinId")
    }

    @JavascriptInterface
    fun getEquippedBallSkin(): String {
        return preferences.getString("player_equipped_ball_skin", "default") ?: "default"
    }
}

