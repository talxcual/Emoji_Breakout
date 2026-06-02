package com.ktoledo.emoji_breakout

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.SoundPool
import android.util.Log

class SoundManager private constructor(private val context: Context) {

    companion object {
        private const val TAG = "SoundManager"
        @Volatile
        private var instance: SoundManager? = null

        fun getInstance(context: Context): SoundManager {
            return instance ?: synchronized(this) {
                instance ?: SoundManager(context.applicationContext).also { instance = it }
            }
        }
    }

    private var soundPool: SoundPool
    private val soundMap = HashMap<String, Int>()
    private var mediaPlayer: MediaPlayer? = null
    
    private val prefs = context.getSharedPreferences("EmojiBreakoutPrefs", Context.MODE_PRIVATE)
    private var isMuted: Boolean = prefs.getBoolean("is_muted", false)

    init {
        // Initialize SoundPool with low latency attributes
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(5)
            .setAudioAttributes(audioAttributes)
            .build()

        // Load SFX from assets safely (won't crash if files aren't present)
        loadSFX("bounce", "bounce.mp3")
        loadSFX("brick", "brick.mp3")
        loadSFX("powerup", "powerup.mp3")
        loadSFX("lost", "lost.mp3")

        // Setup background music player
        setupBackgroundMusic()
    }

    private fun loadSFX(name: String, fileName: String) {
        try {
            val assetManager = context.assets
            val afd = assetManager.openFd(fileName)
            val soundId = soundPool.load(afd, 1)
            soundMap[name] = soundId
            Log.d(TAG, "Cargado SFX: $name desde assets/$fileName")
        } catch (e: Exception) {
            Log.w(TAG, "No se pudo cargar SFX $name ($fileName): ${e.message}. El juego continuará sin este sonido.")
        }
    }

    private fun setupBackgroundMusic() {
        try {
            mediaPlayer = MediaPlayer().apply {
                val afd = context.assets.openFd("bg_music.mp3")
                setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                isLooping = true
                setVolume(0.12f, 0.12f) // Play at a pleasant background level
                prepare()
            }
            Log.d(TAG, "Música de fondo preparada desde assets/bg_music.mp3")
        } catch (e: Exception) {
            Log.w(TAG, "No se pudo preparar música de fondo: ${e.message}. El juego continuará en silencio de fondo.")
        }
    }

    fun playSFX(name: String) {
        if (isMuted) return
        val soundId = soundMap[name]
        if (soundId != null) {
            soundPool.play(soundId, 1.0f, 1.0f, 1, 0, 1.0f)
        } else {
            Log.d(TAG, "SFX $name no disponible para reproducir.")
        }
    }

    fun startMusic() {
        if (isMuted) return
        try {
            if (mediaPlayer != null && !mediaPlayer!!.isPlaying) {
                mediaPlayer?.start()
                Log.d(TAG, "Música iniciada.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error al iniciar música: ${e.message}")
        }
    }

    fun pauseMusic() {
        try {
            if (mediaPlayer != null && mediaPlayer!!.isPlaying) {
                mediaPlayer?.pause()
                Log.d(TAG, "Música pausada.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error al pausar música: ${e.message}")
        }
    }

    fun toggleMute(): Boolean {
        isMuted = !isMuted
        prefs.edit().putBoolean("is_muted", isMuted).apply()

        if (isMuted) {
            pauseMusic()
        } else {
            startMusic()
        }
        
        Log.d(TAG, "Mute toggle: isMuted=$isMuted")
        return isMuted
    }

    fun isMuted(): Boolean {
        return isMuted
    }
}
