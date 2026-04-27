import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    html = f.read()

# Make btn-exit-fullscreen work for all views
exit_js_search = r"""        document.getElementById\('btn-exit-fullscreen'\)\.addEventListener\('click', \(\) => \{
            playSound\('click'\);
            document\.body\.classList\.remove\('fullscreen-map'\);

            // Force redraw/resize of grid if needed
            setTimeout\(\(\) => \{
                const grid = document\.getElementById\('sim-grid'\);
                grid\.style\.display = 'none';
                grid\.offsetHeight; // trigger reflow
                grid\.style\.display = '';
            \}, 50\);
        \}\);"""

exit_js_replace = """        document.getElementById('btn-exit-fullscreen').addEventListener('click', () => {
            playSound('click');
            document.body.classList.remove('fullscreen-map');

            setTimeout(() => {
                ['sim-grid', 'chal-grid', 'read-grid'].forEach(id => {
                    const grid = document.getElementById(id);
                    if(grid) {
                        grid.style.display = 'none';
                        grid.offsetHeight;
                        grid.style.display = '';
                    }
                });
            }, 50);
        });"""

html = re.sub(exit_js_search, exit_js_replace, html)

# Hide difficulty bar in fullscreen
css_add = """
        body.fullscreen-map .difficulty-bar {
            display: none !important;
        }
"""
html = html.replace('body.fullscreen-map .app-header {', css_add + '\n        body.fullscreen-map .app-header {', 1)

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(html)
