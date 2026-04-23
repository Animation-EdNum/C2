import re

with open("js/lucide.min.js", "r") as f:
    text = f.read()

# We look for something that is an exported component name that is capitalized and has standard word.
icons = re.findall(r'([A-Z][A-Za-z]+)=', text)
print(list(set(icons))[:50])

# Since this might be obfuscated, let's just find strings like '"bar-chart-2"' or something similar that usually defines the lucide icon name.
names = re.findall(r'\["([a-z0-9-]+)"', text)
if names:
    print("\nSome icon names:")
    print(names[:50])
    print("Does bar-chart exist?", "bar-chart" in names, "bar-chart-2" in names, "shield-check" in names)
else:
    names2 = re.findall(r',([a-z0-9-]+):\[', text)
    print("Format 2:")
    print(names2[:50])
