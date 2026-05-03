with open('webapps/routage_reseau.html', 'r') as f:
    content = f.read()

if 'solar' in content.lower():
    print("Found solar flares")
if 'dynamique' in content.lower():
    print("Found dynamique")
