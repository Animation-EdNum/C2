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

        # Test grab and drop
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")
        page.evaluate("addInstruction('up')")
        page.evaluate("addInstruction('up')")

        page.evaluate("addInstruction('right')")

        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')") # It needs to go down 3 times because the target cup is empty (MAX_STACK - blocksInCup = 3 - 0 = 3)
        page.evaluate("addInstruction('action')")

        page.click('#play-btn')
        time.sleep(7)

        print("Holding after 7s:", page.evaluate("craneState.holding"))
        print("Feedback after 7s:", page.evaluate("feedbackMsg.textContent"))
        browser.close()

test()
