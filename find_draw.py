import sys

with open("game.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

in_ball = False
for i, line in enumerate(lines):
    if "class Ball" in line:
        in_ball = True
    if in_ball and "class " in line and "class Ball" not in line:
        in_ball = False
    if in_ball and "draw()" in line:
        for j in range(max(0, i-2), min(len(lines), i+15)):
            print(f"{j+1}: {lines[j].rstrip()}")
        break
