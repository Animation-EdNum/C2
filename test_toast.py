import re

with open('/tmp/routage.txt', 'r') as f:
    content = f.read()

if 'toast' in content.lower():
    print("Found toast")
