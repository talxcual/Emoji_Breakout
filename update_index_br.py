import sys

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '<h1 class="titulo-arcade" style="font-size: 3rem; margin-bottom: 50px;">EMOJI BREAKOUT</h1>',
    '<h1 class="titulo-arcade" style="font-size: 3rem; margin-bottom: 50px; line-height: 1.2;">EMOJI<br>BREAKOUT</h1>'
)

# Bust cache again
content = content.replace('game.js?v=4', 'game.js?v=5')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html with <br>")
