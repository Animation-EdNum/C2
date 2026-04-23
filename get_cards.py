import re
with open("index.html", "r") as f:
    html = f.read()
cards = re.findall(r'<div class="card-title">(.*?)</div>', html)
for c in cards:
    print(c)
