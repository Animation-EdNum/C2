import os
import unittest
from playwright.sync_api import sync_playwright

class TestBinaireMessage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)
        cls.page = cls.browser.new_page()
        # Get absolute path to the HTML file
        path = os.path.abspath("webapps/binaire_message.html")
        cls.page.goto(f"file://{path}")

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def test_letter_to_rank(self):
        # Test cases for letterToRank(ch)
        # A=1, B=2, ..., Z=26

        cases = [
            ('A', 1),
            ('B', 2),
            ('M', 13),
            ('Z', 26),
            ('a', 1),
            ('z', 26),
        ]

        for char, expected in cases:
            # Use JSON serialization for safety in evaluate
            result = self.page.evaluate("(char) => letterToRank(char)", char)
            self.assertEqual(result, expected, f"Failed for {char}: expected {expected}, got {result}")

    def test_letter_to_rank_edge_cases(self):
        # Testing non-alphabetic characters
        # 'A' is 65. 65-64 = 1.
        # '@' is 64. 64-64 = 0.
        # '[' is 91. 91-64 = 27.
        cases = [
            ('@', 0),
            ('[', 27),
            ('1', 49 - 64), # 49 - 64 = -15
        ]
        for char, expected in cases:
            result = self.page.evaluate("(char) => letterToRank(char)", char)
            self.assertEqual(result, expected, f"Failed for edge case {char}: expected {expected}, got {result}")

    def test_rank_to_letter(self):
        # Testing the inverse function as well for completeness
        cases = [
            (1, 'A'),
            (2, 'B'),
            (13, 'M'),
            (26, 'Z'),
        ]

        for rank, expected in cases:
            result = self.page.evaluate("(rank) => rankToLetter(rank)", rank)
            self.assertEqual(result, expected, f"Failed for rank {rank}: expected {expected}, got {result}")

if __name__ == "__main__":
    unittest.main()
