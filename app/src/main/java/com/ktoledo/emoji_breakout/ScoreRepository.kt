package com.ktoledo.emoji_breakout

import android.util.Log

/**
 * Interfaz para guardar y obtener puntuaciones.
 * Permite cambiar fácilmente entre almacenamiento local (SharedPreferences/Room) y servicios en la nube (Firebase/Firestore/Web API).
 */
interface ScoreRepository {
    fun updateHighScore(userId: String, score: Int, onSuccess: () -> Unit, onFailure: (Exception) -> Unit)
    fun getGlobalLeaderboard(onSuccess: (List<Pair<String, Int>>) -> Unit, onFailure: (Exception) -> Unit)
}

/**
 * Repositorio de Firebase mockeado que muestra cómo implementar el guardado en la nube en el futuro.
 */
class FirebaseScoreRepository : ScoreRepository {
    private val TAG = "FirebaseScoreRepository"

    override fun updateHighScore(userId: String, score: Int, onSuccess: () -> Unit, onFailure: (Exception) -> Unit) {
        Log.d(TAG, "Subiendo high score a la nube para $userId: $score")
        
        // --- Ejemplo de código de Firebase Firestore real ---
        /*
        val db = FirebaseFirestore.getInstance()
        val scoreData = hashMapOf(
            "username" to userId,
            "score" to score,
            "timestamp" to FieldValue.serverTimestamp()
        )
        db.collection("leaderboard").document(userId)
            .set(scoreData, SetOptions.merge())
            .addOnSuccessListener {
                Log.d(TAG, "Puntuación guardada con éxito en la nube.")
                onSuccess()
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error al guardar en Firebase", e)
                onFailure(e)
            }
        */
        
        // Simular éxito inmediato en el mock
        onSuccess()
    }

    override fun getGlobalLeaderboard(onSuccess: (List<Pair<String, Int>>) -> Unit, onFailure: (Exception) -> Unit) {
        Log.d(TAG, "Consultando ranking global en la nube...")
        
        // --- Ejemplo de lectura de Firebase Firestore real ---
        /*
        val db = FirebaseFirestore.getInstance()
        db.collection("leaderboard")
            .orderBy("score", Query.Direction.DESCENDING)
            .limit(10)
            .get()
            .addOnSuccessListener { result ->
                val list = ArrayList<Pair<String, Int>>()
                for (document in result) {
                    val username = document.getString("username") ?: "Desconocido"
                    val score = document.getLong("score")?.toInt() ?: 0
                    list.add(Pair(username, score))
                }
                onSuccess(list)
            }
            .addOnFailureListener { e -> onFailure(e) }
        */
        
        // Mock de datos devueltos
        val dummyLeaderboard = listOf(
            Pair("👑 EmojiKing", 25000),
            Pair("⚡ FlashClicker", 18500),
            Pair("🧱 BrickBreaker", 14300),
            Pair("⭐ ProBreaker", 10200),
            Pair("🎮 PlayerOne", 8500)
        )
        onSuccess(dummyLeaderboard)
    }
}
