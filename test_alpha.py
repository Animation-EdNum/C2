import os

for f in os.listdir("alpha/webapps"):
    if f.endswith('.html'):
        with open(os.path.join("alpha/webapps", f)) as file:
            content = file.read()
            if "class=\"instructions\"" in content or "class='instructions'" in content or "class=\"alpha-instruction\"" in content or "class=\"alpha-consigne\"" in content:
                print(f"{f}: has instructions")
            elif "instruction" in content.lower():
                print(f"{f}: has instruction string in it, checking further")
                # Look for classes
