import urllib.request
url = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Righteous&display=swap"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'})
with urllib.request.urlopen(req) as response:
    print(response.read().decode('utf-8'))
