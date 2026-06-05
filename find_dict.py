import re
with open("game.js", "r", encoding="utf-8") as f:
    content = f.read()
match = re.search(r'ballSkinsDict\s*=\s*\{.*?(?=\})', content, re.DOTALL)
if match:
    print(match.group(0))
else:
    match2 = re.search(r'ballSkins.*?', content, re.DOTALL)
    if match2:
        print(match2.group(0))
