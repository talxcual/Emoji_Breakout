import os
import urllib.request

os.makedirs("fonts", exist_ok=True)
os.makedirs("lib", exist_ok=True)

downloads = {
    "fonts/press-start-2p.woff2": "https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2",
    "fonts/righteous.woff2": "https://fonts.gstatic.com/s/righteous/v18/1cXxaUPXBpj2rGoU7C9WiHGF.woff2",
    "lib/firebase-app-compat.js": "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
    "lib/firebase-database-compat.js": "https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"
}

headers = {'User-Agent': 'Mozilla/5.0'}

for dest, url in downloads.items():
    print(f"Downloading {dest}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        with open(dest, 'wb') as out_file:
            out_file.write(response.read())

print("All downloads finished.")
