import re

with open('/tmp/routage.txt', 'r') as f:
    content = f.read()

# Let's find where to add the diff-extreme button
if '<button class="diff-btn" id="diff-hard">🔴 Difficile</button>' in content:
    print("Found hard button")

# Let's check where to unlock it
if 'launchFire();' in content:
    print("Found launchFire")
