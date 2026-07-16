with open('css/style.css', 'r') as f:
    content = f.read()

# Make sure overflow-x: hidden is applied robustly
if "html, body {" in content:
    content = content.replace("html, body {", "html, body { overflow-x: hidden !important; width: 100%; max-width: 100vw;")
else:
    content += "\nhtml, body { overflow-x: hidden !important; width: 100%; max-width: 100vw; }\n"

with open('css/style.css', 'w') as f:
    f.write(content)
