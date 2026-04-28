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

        # Let's see where the block is
        cups_state = page.evaluate("cups")
        print("Initial cups:", cups_state)
        target_state = page.evaluate("targetCups")
        print("Target cups:", target_state)

        # find where block is
        start_pos = -1
        for i, cup in enumerate(cups_state):
            if len(cup) > 0:
                start_pos = i
                break

        # find target pos
        end_pos = -1
        for i, cup in enumerate(target_state):
            if len(cup) > 0:
                end_pos = i
                break

        print(f"Moving from {start_pos} to {end_pos}")

        # Move to start pos
        while page.evaluate("craneState.pos") < start_pos:
             page.evaluate("addInstruction('right')")
             page.evaluate("craneState.pos++") # mock state for logic loop
        while page.evaluate("craneState.pos") > start_pos:
             page.evaluate("addInstruction('left')")
             page.evaluate("craneState.pos--")

        # Go down 3 times (since max stack is 3, 1 block means we have to go down to height 2 (3-1))
        # Wait, if block is at bottom (length 1), distance from top is 2.
        # Let's just add instructions without mocking state

        page.evaluate("clearProgram()")

        crane_pos = 0
        while crane_pos < start_pos:
            page.evaluate("addInstruction('right')")
            crane_pos += 1

        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")
        page.evaluate("addInstruction('up')")
        page.evaluate("addInstruction('up')")

        while crane_pos < end_pos:
            page.evaluate("addInstruction('right')")
            crane_pos += 1
        while crane_pos > end_pos:
            page.evaluate("addInstruction('left')")
            crane_pos -= 1

        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('down')")
        page.evaluate("addInstruction('action')")

        page.click('#play-btn')
        time.sleep(3) # Wait for execution

        page.screenshot(path='/home/jules/verification/test2.png')
        print(page.evaluate("feedbackMsg.textContent"))
        browser.close()

test()
