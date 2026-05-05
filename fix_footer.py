with open("webapps/teacher/tirage.html", "r") as f:
    content = f.read()

# remove </main> at the bottom
content = content.replace("        </main>\n    </div>", "    </div>")
# put </main> before <footer
content = content.replace("            <footer", "        </main>\n\n        <footer")

with open("webapps/teacher/tirage.html", "w") as f:
    f.write(content)
