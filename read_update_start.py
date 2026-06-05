with open("game.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i in range(2538, 2555):
    try:
        print(f"{i+1}: {lines[i].rstrip()}")
    except Exception:
        pass
