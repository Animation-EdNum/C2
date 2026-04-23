import re
with open("js/lucide.min.js", "r") as f:
    content = f.read()
    # The minified lucide often exports an object with icon names as keys. Let's find patterns like `"sun"` or similar.
    # Alternatively, let's just search for typical words.

    # We can also just extract all string literals
    words = re.findall(r'"([a-z-]+)"', content)
    unique_words = sorted(list(set(words)))
    print("Found strings:", unique_words[:20]) # Just a sample to see if icon names are here
