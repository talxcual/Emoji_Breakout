# -*- coding: utf-8 -*-
with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace thanks message
old_thanks = '<h1 class="titulo-arcade glow-text" style="font-size: 3rem; text-align: center; line-height: 1.4;">\u00a1Gracias por participar en la Beta!</h1>'
new_thanks = '<h1 class="titulo-arcade glow-text" style="font-size: 1.6rem; text-align: center; line-height: 1.5; padding: 0 15px; width: 100%; box-sizing: border-box;">\u00a1Gracias por<br>participar en la Beta!</h1>'
content = content.replace(old_thanks, new_thanks)

# Replace credits title font size from 3rem to 2.2rem
old_credits_title = '<h1 class="titulo-arcade" style="font-size: 3rem; margin-bottom: 50px; line-height: 1.2;">EMOJI<br>BREAKOUT</h1>'
new_credits_title = '<h1 class="titulo-arcade" style="font-size: 2.2rem; margin-bottom: 50px; line-height: 1.2; width: 100%; text-align: center;">EMOJI<br>BREAKOUT</h1>'
content = content.replace(old_credits_title, new_credits_title)

# Bust cache to v=7
content = content.replace('game.js?v=6', 'game.js?v=7')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Successfully updated index.html overlay styling and cache buster")
