import re
with open("js/lucide.min.js", "r") as f:
    content = f.read()

# usually it's `exports.Sun = ...` or similar in a minified bundle, let's find Capitalized words
names = re.findall(r'([A-Z][a-zA-Z0-9]+)\]?=\[', content)
if not names:
    names = re.findall(r'([A-Z][a-zA-Z0-9]+):', content)
print("Found icons:", names[:100])
