package com.ktoledo.emoji_breakout

import android.content.Context
import android.util.Log
import android.webkit.JavascriptInterface

class GameInterface(private val context: Context) {

    companion object {
        private const val TAG = "GameInterface"
    }

    private val soundManager = SoundManager.getInstance(context)
    private val preferences = context.getSharedPreferences("EmojiBreakoutPrefs", Context.MODE_PRIVATE)
    private val cloudRepository: ScoreRepository = FirebaseScoreRepository()

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
            Log.d(TAG, "Guardado progreso: Máximo nivel alcanzado = $level")
        }

        // Save High Score
        val currentHighScore = preferences.getInt("high_score", 0)
        if (score > currentHighScore) {
            editor.putInt("high_score", score)
            Log.d(TAG, "Guardado progreso: Nuevo High Score = $score")
            
            // Mock upload to Firebase Cloud
            cloudRepository.updateHighScore(
                userId = "JugadorLocal",
                score = score,
                onSuccess = { Log.d(TAG, "High score sincronizado en la nube.") },
                onFailure = { e -> Log.e(TAG, "Error al sincronizar puntuación en la nube: ${e.message}") }
            )
        }

        editor.apply()
    }

    @JavascriptInterface
    fun getMaxLevel(): Int {
        return preferences.getInt("max_level", 1)
    }

    @JavascriptInterface
    fun getHighScore(): Int {
        return preferences.getInt("high_score", 0)
    }
}
