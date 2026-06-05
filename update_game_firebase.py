import sys

with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()

# Fix Firebase node from ranking_emoji_breakout to leaderboard
content = content.replace("firebase.database().ref('ranking_emoji_breakout').once('value')", "firebase.database().ref('leaderboard').once('value')")

with open("game.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated game.js with correct leaderboard node")
