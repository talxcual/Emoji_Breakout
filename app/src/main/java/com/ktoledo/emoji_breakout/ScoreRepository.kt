package com.ktoledo.emoji_breakout

import android.content.Context
import android.util.Log
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.IgnoreExtraProperties

@IgnoreExtraProperties
data class LeaderboardEntry(
    val name: String = "",
    val score: Int = 0,
    val maxLevel: Int = 0,
    val profilePic: String = ""
)

interface ScoreRepository {
    fun updateHighScore(
        playerName: String,
        score: Int,
        maxLevel: Int,
        profilePic: String,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    )
    
    fun getGlobalLeaderboard(
        onSuccess: (List<LeaderboardEntry>) -> Unit,
        onFailure: (Exception) -> Unit
    )
}

class FirebaseScoreRepository(private val context: Context) : ScoreRepository {
    private val TAG = "FirebaseScoreRepository"

    init {
        // Inicializar Firebase programáticamente si no se ha inicializado con google-services.json
        try {
            FirebaseApp.getInstance()
        } catch (e: IllegalStateException) {
            Log.w(TAG, "Firebase no está inicializado. Usando inicialización programática de respaldo.")
            try {
                val options = FirebaseOptions.Builder()
                    .setApplicationId("1:100000000000:android:dummyappid")
                    .setApiKey("AIzaSyDummyKeyForCompilationOnly12345")
                    .setDatabaseUrl("https://emoji-breakout-default-rtdb.firebaseio.com") // Reemplazar con la URL real
                    .build()
                FirebaseApp.initializeApp(context, options)
            } catch (ex: Exception) {
                Log.e(TAG, "Error al inicializar Firebase de respaldo: ${ex.message}")
            }
        }
    }

    override fun updateHighScore(
        playerName: String,
        score: Int,
        maxLevel: Int,
        profilePic: String,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val auth = FirebaseAuth.getInstance()
        val currentUser = auth.currentUser

        if (currentUser != null) {
            // Usuario ya autenticado, procedemos a guardar
            saveToDatabase(currentUser.uid, playerName, score, maxLevel, profilePic, onSuccess, onFailure)
        } else {
            // Autenticar anónimamente primero
            auth.signInAnonymously()
                .addOnSuccessListener { authResult ->
                    val uid = authResult.user?.uid
                    if (uid != null) {
                        saveToDatabase(uid, playerName, score, maxLevel, profilePic, onSuccess, onFailure)
                    } else {
                        onFailure(Exception("UID de usuario anónimo nulo"))
                    }
                }
                .addOnFailureListener { e ->
                    Log.e(TAG, "Error en autenticación anónima", e)
                    onFailure(e)
                }
        }
    }

    private fun saveToDatabase(
        uid: String,
        playerName: String,
        score: Int,
        maxLevel: Int,
        profilePic: String,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        try {
            val database = FirebaseDatabase.getInstance()
            val userScoreRef = database.getReference("leaderboard").child(uid)

            val entry = LeaderboardEntry(
                name = playerName,
                score = score,
                maxLevel = maxLevel,
                profilePic = profilePic
            )

            userScoreRef.setValue(entry)
                .addOnSuccessListener {
                    Log.d(TAG, "Récord guardado en Firebase para el UID: $uid")
                    onSuccess()
                }
                .addOnFailureListener { e ->
                    Log.e(TAG, "Error al escribir en Realtime Database", e)
                    onFailure(e)
                }
        } catch (e: Exception) {
            onFailure(e)
        }
    }

    override fun getGlobalLeaderboard(
        onSuccess: (List<LeaderboardEntry>) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        try {
            val database = FirebaseDatabase.getInstance()
            val leaderboardRef = database.getReference("leaderboard")

            leaderboardRef.orderByChild("score").limitToLast(50)
                .get()
                .addOnSuccessListener { snapshot ->
                    val list = mutableListOf<LeaderboardEntry>()
                    for (child in snapshot.children) {
                        val entry = child.getValue(LeaderboardEntry::class.java)
                        if (entry != null) {
                            list.add(entry)
                        }
                    }
                    // Firebase ordena ascendentemente por defecto, invertimos para que sea de mayor a menor
                    val sortedList = list.sortedByDescending { it.score }
                    onSuccess(sortedList)
                }
                .addOnFailureListener { e ->
                    Log.e(TAG, "Error al recuperar Leaderboard de Firebase", e)
                    onFailure(e)
                }
        } catch (e: Exception) {
            onFailure(e)
        }
    }
}
