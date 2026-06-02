package com.ktoledo.emoji_breakout

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

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

        // 1. Habilitar JavaScript (¡CRUCIAL!)
        webSettings.javaScriptEnabled = true

        // 2. Permitir acceso a archivos locales (para cargar CSS/JS desde HTML)
        webSettings.allowFileAccess = true

        // 3. Habilitar el almacenamiento DOM
        webSettings.domStorageEnabled = true

        // 4. Registrar puente de interfaz Javascript para comunicarse con Kotlin nativo
        webView.addJavascriptInterface(GameInterface(this), "AndroidInterface")

        // Carga el archivo principal de tu juego desde la carpeta 'assets'
        webView.loadUrl("file:///android_asset/index.html")
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
    }

    override fun onResume() {
        super.onResume()
        SoundManager.getInstance(this).startMusic()
    }
}