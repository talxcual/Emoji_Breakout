import sys

with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()

# Add syncR1AchievementToFirebase() inside cargarRankingGlobal
old_str = "async function cargarRankingGlobal() {\n    const tbody = getCachedElement('leaderboard-tbody');"
new_str = "async function cargarRankingGlobal() {\n    if (typeof syncR1AchievementToFirebase === 'function') syncR1AchievementToFirebase();\n    const tbody = getCachedElement('leaderboard-tbody');"

content = content.replace(old_str, new_str)

with open("game.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated game.js with sync inside cargarRankingGlobal")
