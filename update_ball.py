import sys

with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()

# Increase size from 24 to 34
content = content.replace("this.size = 24;", "this.size = 34;")

# Replace Volleyball emoji with White Circle emoji
content = content.replace('??', '?')

with open("game.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ball size and basic color in game.js")
