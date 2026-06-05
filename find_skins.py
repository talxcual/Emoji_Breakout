with open("game.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if "ballSkinsDict" in line or "ballSkins =" in line or "ballSkins=" in line:
        for j in range(max(0, i-2), min(len(lines), i+15)):
            try:
                print(f"{j+1}: {lines[j].rstrip()}")
            except Exception:
                pass
        break
