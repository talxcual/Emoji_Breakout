package com.ktoledo.emoji_breakout

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import org.json.JSONObject
import java.io.ByteArrayOutputStream

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var googleSignInClient: GoogleSignInClient
    private val TAG = "MainActivity"

    private val preferences by lazy {
        getSharedPreferences("EmojiBreakoutPrefs", Context.MODE_PRIVATE)
    }

    // Launcher para selección de foto de perfil desde galería
    private val galleryLauncher = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri ->
        if (uri != null) {
            val base64Image = compressUriToBase64(this, uri)
            if (base64Image != null) {
                // Guardar localmente
                preferences.edit().putString("player_profile_pic", "data:image/jpeg;base64,$base64Image").apply()
                // Enviar a JS
                webView.post {
                    webView.evaluateJavascript(
                        "if (window.gameInstance) window.gameInstance.onProfilePictureSelected('data:image/jpeg;base64,$base64Image');",
                        null
                    )
                }
            } else {
                sendAuthErrorToJs("Error al procesar la foto de la galería")
            }
        }
    }

    // Launcher para el flujo de Google Sign-in
    private val googleSignInLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(com.google.android.gms.common.api.ApiException::class.java)
                val idToken = account?.idToken
                if (idToken != null) {
                    firebaseAuthWithGoogle(idToken)
                } else {
                    sendAuthErrorToJs("Google ID Token es nulo.")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error en Google Sign-In", e)
                sendAuthErrorToJs("Error al iniciar sesión con Google: ${e.message}")
            }
        } else {
            sendAuthErrorToJs("Inicio de sesión cancelado")
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Esconde la barra de acción y la barra de estado para una inmersión total
        supportActionBar?.hide()
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN

        // Encuentra la WebView en el layout
        webView = findViewById(R.id.webview)

        // --- Configuración Esencial de la WebView ---
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.allowFileAccess = true
        webSettings.domStorageEnabled = true
        webView.webChromeClient = android.webkit.WebChromeClient()

        // Registrar puente de interfaz Javascript para comunicarse con Kotlin nativo
        webView.addJavascriptInterface(GameInterface(this, webView), "AndroidInterface")

        // Carga el archivo principal de tu juego desde la carpeta 'assets'
        webView.loadUrl("file:///android_asset/index.html")

        // --- Inicialización del Cliente de Google Sign-In ---
        // Intentar obtener el ID de cliente web dinámicamente si el plugin lo generó
        val webClientIdId = resources.getIdentifier("default_web_client_id", "string", packageName)
        val webClientId = if (webClientIdId != 0) getString(webClientIdId) else "YOUR_WEB_CLIENT_ID"
        
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(webClientId)
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)
    }

    // Funciones públicas invocadas desde GameInterface puente

    fun launchGoogleSignIn() {
        val signInIntent = googleSignInClient.signInIntent
        googleSignInLauncher.launch(signInIntent)
    }

    fun launchGalleryPicker() {
        galleryLauncher.launch("image/*")
    }

    fun logoutFromFirebase() {
        FirebaseAuth.getInstance().signOut()
        googleSignInClient.signOut()
        
        webView.post {
            webView.evaluateJavascript("if (window.gameInstance) window.gameInstance.onAuthLogout();", null)
        }
    }

    fun getCurrentUserStatus(): String {
        val user = FirebaseAuth.getInstance().currentUser
        val userJson = JSONObject()
        if (user != null) {
            userJson.put("uid", user.uid)
            userJson.put("name", user.displayName ?: preferences.getString("player_nickname", "Jugador") ?: "Jugador")
            userJson.put("email", user.email ?: "")
            
            // Buscar si hay foto local de la galería, de lo contrario usar la de Google
            val localPhoto = preferences.getString("player_profile_pic", "") ?: ""
            val photoUrl = if (localPhoto.isNotEmpty()) localPhoto else (user.photoUrl?.toString() ?: "")
            userJson.put("photoUrl", photoUrl)
            
            var provider = "anonymous"
            for (info in user.providerData) {
                if (info.providerId == "google.com") {
                    provider = "google"
                }
            }
            userJson.put("provider", provider)
        }
        return userJson.toString()
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        FirebaseAuth.getInstance().signInWithCredential(credential)
            .addOnSuccessListener { authResult ->
                val user = authResult.user
                if (user != null) {
                    val userJson = JSONObject()
                    userJson.put("uid", user.uid)
                    userJson.put("name", user.displayName ?: "Jugador de Google")
                    userJson.put("email", user.email ?: "")
                    
                    val localPhoto = preferences.getString("player_profile_pic", "") ?: ""
                    val photoUrl = if (localPhoto.isNotEmpty()) localPhoto else (user.photoUrl?.toString() ?: "")
                    userJson.put("photoUrl", photoUrl)
                    userJson.put("provider", "google")
                    
                    // Fetch existing score from Firebase under this user's UID to check for restore
                    val scoreRepo = FirebaseScoreRepository(this)
                    scoreRepo.getUserHighScore(user.uid,
                        onSuccess = { entry ->
                            if (entry != null) {
                                val localHighScore = preferences.getInt("high_score", 0)
                                val localMaxLevel = preferences.getInt("max_level", 1)
                                
                                // Compare and restore if cloud progress is higher
                                val isCloudBetter = (entry.score > localHighScore) || 
                                                    (entry.score == localHighScore && entry.maxLevel > localMaxLevel)
                                
                                if (isCloudBetter) {
                                    val editor = preferences.edit()
                                    editor.putInt("high_score", entry.score)
                                    editor.putInt("max_level", entry.maxLevel)
                                    if (entry.name.isNotEmpty()) {
                                        editor.putString("player_nickname", entry.name)
                                        userJson.put("name", entry.name)
                                    }
                                    if (entry.profilePic.isNotEmpty()) {
                                        editor.putString("player_profile_pic", entry.profilePic)
                                        userJson.put("photoUrl", entry.profilePic)
                                    }
                                    editor.apply()
                                    
                                    Log.d(TAG, "Progreso de usuario restaurado desde Firebase: Lvl ${entry.maxLevel}, Score ${entry.score}")
                                    
                                    // Notificar al juego Javascript para actualizar el estado del juego
                                    webView.post {
                                        webView.evaluateJavascript(
                                            "if (window.gameInstance && window.gameInstance.onProgressRestored) window.gameInstance.onProgressRestored(${entry.maxLevel}, ${entry.score});",
                                            null
                                        )
                                    }
                                }
                            }
                            
                            // Llamar al callback original de éxito
                            webView.post {
                                webView.evaluateJavascript(
                                    "if (window.gameInstance) window.gameInstance.onAuthSuccess('${escapeJson(userJson.toString())}');",
                                    null
                                )
                            }
                        },
                        onFailure = { e ->
                            Log.e(TAG, "Fallo al verificar record en Firebase durante login", e)
                            // En cualquier caso llamar al callback original para no bloquear el flujo
                            webView.post {
                                webView.evaluateJavascript(
                                    "if (window.gameInstance) window.gameInstance.onAuthSuccess('${escapeJson(userJson.toString())}');",
                                    null
                                )
                            }
                        }
                    )
                }
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error Firebase con credencial Google", e)
                sendAuthErrorToJs("Error al sincronizar con Firebase: ${e.message}")
            }
    }

    private fun sendAuthErrorToJs(message: String) {
        webView.post {
            webView.evaluateJavascript(
                "if (window.gameInstance) window.gameInstance.onAuthError('${escapeJson(message)}');",
                null
            )
        }
    }

    private fun compressUriToBase64(context: Context, uri: android.net.Uri): String? {
        return try {
            val inputStream = context.contentResolver.openInputStream(uri)
            val originalBitmap = android.graphics.BitmapFactory.decodeStream(inputStream)
            inputStream?.close()
            
            if (originalBitmap == null) return null
            
            // Redimensionar la imagen a un avatar pequeño de 80x80 píxeles
            val resizedBitmap = android.graphics.Bitmap.createScaledBitmap(originalBitmap, 80, 80, true)
            
            val outputStream = ByteArrayOutputStream()
            resizedBitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 70, outputStream)
            val byteArray = outputStream.toByteArray()
            
            android.util.Base64.encodeToString(byteArray, android.util.Base64.NO_WRAP)
        } catch (e: Exception) {
            Log.e(TAG, "Error comprimiendo imagen", e)
            null
        }
    }

    private fun escapeJson(str: String): String {
        return str.replace("\\", "\\\\").replace("'", "\\'")
    }

    // Asegurar que la inmersión se mantenga si el usuario interactúa con el sistema
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        }
    }

    override fun onPause() {
        super.onPause()
        SoundManager.getInstance(this).pauseMusic()
        if (::webView.isInitialized) {
            webView.evaluateJavascript("if (window.gameInstance) window.gameInstance.saveGameState();", null)
        }
    }

    override fun onResume() {
        super.onResume()
        SoundManager.getInstance(this).startMusic()
    }
}