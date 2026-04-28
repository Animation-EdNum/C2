from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://127.0.0.1:8000/alpha/webapps/jeu_de_la_grue.html')
        page.wait_for_selector('.board.main-board')

        # Click diff-easy
        page.click('#diff-easy')

        # Add instruction down, down, action
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")
        page.evaluate("addInstruction('up')")
        page.evaluate("addInstruction('up')")
        page.evaluate("addInstruction('right')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")

        page.screenshot(path='/home/jules/verification/test1.png')
        browser.close()

test()
