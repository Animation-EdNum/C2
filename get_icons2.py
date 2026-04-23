import re
with open("js/lucide.min.js", "r") as f:
    text = f.read()

# exported components
exports = re.findall(r'([A-Z][a-zA-Z0-9]+)\]?=\[', text)
exports += re.findall(r'([A-Z][A-Za-z0-9]+)=', text)
exports = set(exports)

candidates = ['BarChart', 'BarChart2', 'BarChart3', 'ShieldCheck', 'Shield', 'ChartBar']
for c in candidates:
    print(c, "->", c in exports)
