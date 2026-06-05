with open("style.css", "r", encoding="latin1") as f:
    lines = f.readlines()
for i in range(1460, min(1560, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")
