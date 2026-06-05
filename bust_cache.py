with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('game.js?v=3', 'game.js?v=4')
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Busted cache for game.js in index.html")
