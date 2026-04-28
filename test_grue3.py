from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://127.0.0.1:8000/alpha/webapps/jeu_de_la_grue.html')
        page.wait_for_selector('.board.main-board')

        # Click diff-easy
        page.click('#diff-easy')

        # Just manually set state to know exactly what to do
        page.evaluate("cups = [[{id:0, color:'blue'}], [], []];")
        page.evaluate("targetCups = [[], [], [{id:0, color:'blue'}]];")
        page.evaluate("initialCupsState = JSON.parse(JSON.stringify(cups));")
        page.evaluate("renderAll();")

        page.evaluate("clearProgram()")

        # Pick up from cup 0
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")
        page.evaluate("addInstruction('up')")
        page.evaluate("addInstruction('up')")

        # Move to cup 2
        page.evaluate("addInstruction('right')")
        page.evaluate("addInstruction('right')")

        # Drop in cup 2
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")

        page.click('#play-btn')
        time.sleep(7) # Wait for execution (10 steps * 0.6s)

        page.screenshot(path='/home/jules/verification/test3.png')
        print("Feedback after 7s:", page.evaluate("feedbackMsg.textContent"))
        browser.close()

test()
