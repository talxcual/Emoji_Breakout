import sys

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Bust cache again
content = content.replace('game.js?v=5', 'game.js?v=6')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html cache buster")
