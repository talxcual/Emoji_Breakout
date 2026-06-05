import os

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Righteous&display=swap" rel="stylesheet">',
    '<!-- Google Fonts localizados en style.css -->'
)
html = html.replace(
    '<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>',
    '<script src="./lib/firebase-app-compat.js"></script>'
)
html = html.replace(
    '<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>',
    '<script src="./lib/firebase-database-compat.js"></script>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Update style.css
fonts_css = """
@font-face {
  font-family: 'Press Start 2P';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./fonts/press-start-2p.woff2') format('woff2');
}
@font-face {
  font-family: 'Righteous';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./fonts/righteous.woff2') format('woff2');
}
"""

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if "font-family: 'Press Start 2P';" not in css[:500]:
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(fonts_css + css)

print("HTML and CSS updated.")
