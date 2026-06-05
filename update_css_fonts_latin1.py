import sys

with open("style.css", "r", encoding="latin1") as f:
    content = f.read()

content = content.replace(
    "font-family: 'Righteous', sans-serif;\n    font-size: 1.8rem;",
    "font-family: 'Press Start 2P', cursive;\n    font-size: 1.2rem;"
)
content = content.replace(
    "font-family: 'Righteous', sans-serif;\n    font-size: 1.5rem;",
    "font-family: 'Press Start 2P', cursive;\n    font-size: 1.0rem;"
)

with open("style.css", "w", encoding="latin1") as f:
    f.write(content)
print("Updated style.css with Arcade fonts using latin1")
