with open("style.css", "r", encoding="latin1") as f:
    lines = f.readlines()
for i in range(125, min(165, len(lines))):
    print(f"{i+1}: {lines[i].rstrip()}")
