with open("game.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i in range(2595, 2635):
    try:
        print(f"{i+1}: {lines[i].rstrip()}")
    except Exception:
        pass
