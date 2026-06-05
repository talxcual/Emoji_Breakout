import sys

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Add to start-screen
if 'id="version-text"' not in content:
    start_screen_end = content.find('</div>', content.find('id="start-screen"'))
    injection = '''
        <div id="version-text" class="version-text">v1.0.0-Beta</div>
        <button id="credits-btn" class="credits-corner-btn">?? CRÉDITOS</button>
    '''
    content = content[:start_screen_end] + injection + content[start_screen_end:]

# Add screens before end of game-container
if 'id="beta-thanks-screen"' not in content:
    screens_injection = '''
    <!-- Overlay de Gracias por Participar -->
    <div class="ui-overlay hidden" id="beta-thanks-screen" style="z-index: 100; background: rgba(0,0,0,0.85);">
        <h1 class="titulo-arcade glow-text" style="font-size: 3rem; text-align: center; line-height: 1.4;">¡Gracias por participar en la Beta!</h1>
    </div>

    <!-- Pantalla de Créditos -->
    <div class="ui-overlay hidden" id="credits-screen" style="z-index: 99;">
        <div class="credits-container">
            <div id="credits-content" class="credits-scroll-content">
                <h1 class="titulo-arcade" style="font-size: 3rem; margin-bottom: 50px;">EMOJI BREAKOUT</h1>
                <h2 class="credits-role">Desarrollador</h2>
                <p class="credits-name">Kleber</p>
                <div class="credits-special">
                    <h2 class="credits-role" style="color: #fbbf24; margin-top: 60px;">Mención Especial</h2>
                    <p class="credits-name r1-badge" style="font-size: 1.5rem; text-shadow: 0 0 20px #fbbf24;">Primer Jugador en Nivel 50:<br>PAPIKOFLA</p>
                </div>
                <h2 class="credits-role" style="margin-top: 60px;">Participantes de la Beta</h2>
                <div id="beta-testers-list" style="margin-bottom: 100vh;">
                    Cargando testers...
                </div>
            </div>
        </div>
        <button id="close-credits-btn" class="menu-btn" style="position: absolute; bottom: 20px; z-index: 10;">VOLVER AL MENÚ</button>
    </div>
'''
    game_container_end = content.find('</div>\n\n<script>')
    if game_container_end == -1:
        game_container_end = content.rfind('</div>')
    
    content = content[:game_container_end] + screens_injection + content[game_container_end:]

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html")
