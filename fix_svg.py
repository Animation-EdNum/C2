import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Replace preserveAspectRatio="none" with "xMidYMid slice" or something so it preserves aspect ratio but scales correctly?
# Wait, if aspect ratio of container is exactly grid-cols/grid-rows, then preserveAspectRatio="none" is FINE because 100x100 viewBox maps exactly to the container without stretching!
# Let's test that hypothesis.
