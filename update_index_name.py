with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('<p class="credits-name">Kleber</p>', '<p class="credits-name">Kleber T.</p>')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated developer name")
