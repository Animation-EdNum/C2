from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://127.0.0.1:8000/alpha/webapps/jeu_de_la_grue.html')
        page.wait_for_selector('.board.main-board')

        page.evaluate("cups = [[{id:0, color:'blue'}], [], []];")
        page.evaluate("targetCups = [[], [], [{id:0, color:'blue'}]];")
        page.evaluate("initialCupsState = JSON.parse(JSON.stringify(cups));")
        page.evaluate("renderAll();")

        page.evaluate("clearProgram()")

        # Test just the grab
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")

        page.click('#play-btn')
        time.sleep(3)

        print("Holding after 3s:", page.evaluate("craneState.holding"))
        print("Feedback after 3s:", page.evaluate("feedbackMsg.textContent"))
        browser.close()

test()
