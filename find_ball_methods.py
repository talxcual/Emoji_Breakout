import sys
import re

with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()

# Find class Ball and extract methods
ball_class = content.split("class Ball")[1].split("\nclass ")[0]
for line in ball_class.split("\n"):
    if "{" in line and " " not in line.strip().split("{")[0] and "(" in line:
        print(line.strip())
