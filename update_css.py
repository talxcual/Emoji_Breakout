with open("style.css", "r", encoding="latin1") as f:
    content = f.read()

old_style = """.credits-scroll-content {
    position: absolute;
    top: 100%;
    width: 90%;
    max-width: 600px;
    text-align: center;
    animation: scrollCredits 45s linear infinite;
}"""

new_style = """.credits-scroll-content {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 600px;
    text-align: center;
    animation: scrollCredits 45s linear infinite;
}"""

content = content.replace(old_style, new_style)

with open("style.css", "w", encoding="latin1") as f:
    f.write(content)
print("Successfully centered credits-scroll-content in style.css")
