with open("index.html", "r") as f:
    content = f.read()

    start_idx = content.find('<div class="grid searchable-grid">')
    end_idx = content.find('</main>')

    print(content[start_idx:end_idx])
