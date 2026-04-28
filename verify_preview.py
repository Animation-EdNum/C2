from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://127.0.0.1:8000/alpha/webapps/jeu_de_la_grue.html')
        page.wait_for_selector('.board.main-board')

        page.click('#diff-easy')

        page.evaluate("cups = [[{id:0, color:'blue'}], [], []];")
        page.evaluate("targetCups = [[], [], [{id:0, color:'blue'}]];")
        page.evaluate("initialCupsState = JSON.parse(JSON.stringify(cups));")
        page.evaluate("renderAll();")

        page.evaluate("clearProgram()")

        # Test preview
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")

        page.screenshot(path='/home/jules/verification/verify_preview.png')
        browser.close()

test()
