import sys

def read_lines(filepath, start_line, end_line):
    with open(filepath, 'r') as f:
        lines = f.readlines()
        for i in range(start_line - 1, end_line):
            print(f"{i + 1}: {lines[i]}", end='')

read_lines("webapps/simulateur_bluebot.html", 3833, 3865)
print("\n---")
read_lines("webapps/simulateur_bluebot.html", 3866, 3910)
