/**
 * @file test_grue.js
 * @description Unit and level progression tests for Jeu de la grue (webapps/jeu_de_la_grue.html).
 * Validates minimal move solver (BFS), difficulty constraints, and pedagogical progression:
 * - Easy (Facile): 1 block, exactly 1 move (3-6 crane steps).
 * - Medium (Moyen): 2 blocks, exactly 2 moves (7-11 crane steps, no 3-move Hanoi temporary staging).
 * - Hard (Difficile): 3 blocks, at least 3 moves (>= 12 crane steps, no trivial 1-move or 2-move puzzles).
 * @license AGPL-3.0-or-later
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function createGrueEnvironment() {
    const htmlPath = path.resolve(__dirname, '../../../webapps/jeu_de_la_grue.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/webapps/jeu_de_la_grue.html',
        beforeParse(window) {
            window.ScoreManager = {
                init: () => {},
                addSuccess: () => {},
                addMistake: () => {}
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
        }
    });

    const window = dom.window;
    window.dispatchEvent(new window.Event('load'));

    return { dom, window, document: window.document };
}

describe('jeu_de_la_grue.html - Level Generation and Difficulty Engine', () => {

    test('1. computeMinMoves correctly evaluates distance in block moves', () => {
        const { window } = createGrueEnvironment();
        const compute = window.computeMinMoves;

        // Identical state: 0 moves
        const stateA = [[{ id: 0 }], [{ id: 1 }], []];
        assert.strictEqual(compute(stateA, stateA), 0, 'Identical states require 0 moves');

        // Simple 1-block move
        const start1 = [[{ id: 0 }], [], []];
        const goal1 = [[], [{ id: 0 }], []];
        assert.strictEqual(compute(start1, goal1), 1, 'Single block transfer requires 1 move');

        // User screenshot case (3 blocks, Green on top of Red on Blue in col 1, target has Green in col 0)
        // Cups: col 0 empty, col 1: [0, 1, 2], col 2 empty
        // Target: col 0: [2], col 1: [0, 1], col 2 empty
        const userBugStart = [[], [{ id: 0 }, { id: 1 }, { id: 2 }], []];
        const userBugGoal = [[{ id: 2 }], [{ id: 0 }, { id: 1 }], []];
        assert.strictEqual(
            compute(userBugStart, userBugGoal),
            1,
            'User screenshot puzzle takes only 1 block move (proves the reported bug)'
        );

        // 2 blocks: 2 moves (no temporary parking needed)
        // Start: col 0 has [0, 1]. Goal: col 1 has [0], col 2 has [1]
        const medium2MovesStart = [[{ id: 0 }, { id: 1 }], [], []];
        const medium2MovesGoal = [[], [{ id: 0 }], [{ id: 1 }]];
        assert.strictEqual(compute(medium2MovesStart, medium2MovesGoal), 2, '2-block unstacking requires 2 moves');

        // 2 blocks: 3 moves (Tower of Hanoi intermediate staging required)
        // Start: col 0 has [0, 1]. Goal: col 1 has [0, 1]
        const medium3MovesStart = [[{ id: 0 }, { id: 1 }], [], []];
        const medium3MovesGoal = [[], [{ id: 0 }, { id: 1 }], []];
        assert.strictEqual(
            compute(medium3MovesStart, medium3MovesGoal),
            3,
            'Moving full 2-block stack requires 3 moves with intermediate parking'
        );

        // 3 blocks: 5 moves (transferring full stack of 3)
        const hard5MovesStart = [[{ id: 0 }, { id: 1 }, { id: 2 }], [], []];
        const hard5MovesGoal = [[], [{ id: 0 }, { id: 1 }, { id: 2 }], []];
        assert.strictEqual(
            compute(hard5MovesStart, hard5MovesGoal),
            5,
            'Moving full 3-block stack requires 5 moves'
        );
    });

    test('2. Mode Facile (Easy): generates 1-block levels with exactly 1 move', () => {
        const { window } = createGrueEnvironment();
        window.setDifficulty('easy');

        for (let i = 0; i < 50; i++) {
            window.startNewLevel();
            const { cups, targetCups, currentDifficulty } = window.getGameState();

            assert.strictEqual(currentDifficulty, 'easy');
            const totalStartBlocks = cups.reduce((sum, col) => sum + col.length, 0);
            const totalTargetBlocks = targetCups.reduce((sum, col) => sum + col.length, 0);
            assert.strictEqual(totalStartBlocks, 1, 'Easy mode must have exactly 1 block');
            assert.strictEqual(totalTargetBlocks, 1, 'Easy mode target must have exactly 1 block');

            const moves = window.computeMinMoves(cups, targetCups);
            assert.strictEqual(moves, 1, 'Easy mode must strictly require 1 block move');
        }
    });

    test('3. Mode Moyen (Medium): generates 2-block levels with strictly 2 moves (no 1-move bystander, no 3-move Hanoi)', () => {
        const { window } = createGrueEnvironment();
        window.setDifficulty('medium');

        for (let i = 0; i < 100; i++) {
            window.startNewLevel();
            const { cups, targetCups, currentDifficulty } = window.getGameState();

            assert.strictEqual(currentDifficulty, 'medium');
            const totalStartBlocks = cups.reduce((sum, col) => sum + col.length, 0);
            const totalTargetBlocks = targetCups.reduce((sum, col) => sum + col.length, 0);
            assert.strictEqual(totalStartBlocks, 2, 'Medium mode must have exactly 2 blocks');
            assert.strictEqual(totalTargetBlocks, 2, 'Medium mode target must have exactly 2 blocks');

            const moves = window.computeMinMoves(cups, targetCups);
            assert.strictEqual(
                moves,
                2,
                `Medium level iteration ${i} must require exactly 2 moves (got ${moves}); must never be 1 (too trivial) or 3 (too hard)`
            );

            // Verify both blocks move
            let startCol0 = -1, startCol1 = -1, goalCol0 = -1, goalCol1 = -1;
            for (let c = 0; c < 3; c++) {
                if (cups[c].some(b => b.id === 0)) startCol0 = c;
                if (cups[c].some(b => b.id === 1)) startCol1 = c;
                if (targetCups[c].some(b => b.id === 0)) goalCol0 = c;
                if (targetCups[c].some(b => b.id === 1)) goalCol1 = c;
            }
            const b0Moved = (startCol0 !== goalCol0) || (cups[startCol0].findIndex(b => b.id === 0) !== targetCups[goalCol0].findIndex(b => b.id === 0));
            const b1Moved = (startCol1 !== goalCol1) || (cups[startCol1].findIndex(b => b.id === 1) !== targetCups[goalCol1].findIndex(b => b.id === 1));
            assert.ok(b0Moved && b1Moved, 'Both blocks must change configuration in Medium mode');
        }
    });

    test('4. Mode Difficile (Hard): generates 3-block levels with at least 3 moves (rejects 1-move and 2-move puzzles)', () => {
        const { window } = createGrueEnvironment();
        window.setDifficulty('hard');

        for (let i = 0; i < 100; i++) {
            window.startNewLevel();
            const { cups, targetCups, currentDifficulty } = window.getGameState();

            assert.strictEqual(currentDifficulty, 'hard');
            const totalStartBlocks = cups.reduce((sum, col) => sum + col.length, 0);
            const totalTargetBlocks = targetCups.reduce((sum, col) => sum + col.length, 0);
            assert.strictEqual(totalStartBlocks, 3, 'Hard mode must have exactly 3 blocks');
            assert.strictEqual(totalTargetBlocks, 3, 'Hard mode target must have exactly 3 blocks');

            const moves = window.computeMinMoves(cups, targetCups);
            assert.ok(
                moves >= 3,
                `Hard level iteration ${i} must require at least 3 moves (got ${moves}); must never be 1 (trivial screenshot bug) or 2`
            );
        }
    });

    test('5. DOM UI reflects difficulty switching and updates board correctly', () => {
        const { window, document } = createGrueEnvironment();

        const btnEasy = document.getElementById('diff-easy');
        const btnMedium = document.getElementById('diff-medium');
        const btnHard = document.getElementById('diff-hard');

        btnMedium.click();
        assert.ok(btnMedium.classList.contains('active'), 'Medium button should have active class');
        assert.strictEqual(btnEasy.classList.contains('active'), false);
        assert.strictEqual(btnHard.classList.contains('active'), false);
        assert.strictEqual(window.getGameState().currentDifficulty, 'medium');

        const mainBoardBlocksMedium = document.querySelectorAll('#main-board .cube');
        assert.strictEqual(mainBoardBlocksMedium.length, 2, 'Main board should render 2 cubes in medium mode');

        btnHard.click();
        assert.ok(btnHard.classList.contains('active'), 'Hard button should have active class');
        assert.strictEqual(btnMedium.classList.contains('active'), false);
        assert.strictEqual(window.getGameState().currentDifficulty, 'hard');

        const mainBoardBlocksHard = document.querySelectorAll('#main-board .cube');
        assert.strictEqual(mainBoardBlocksHard.length, 3, 'Main board should render 3 cubes in hard mode');
    });

    test('6. c2_change_difficulty event switches difficulty and updates UI', () => {
        const { window, document } = createGrueEnvironment();

        const btnEasy = document.getElementById('diff-easy');
        const btnMedium = document.getElementById('diff-medium');

        assert.ok(btnEasy.classList.contains('active'), 'Starts at easy');
        assert.strictEqual(window.getGameState().currentDifficulty, 'easy');

        // Simulate adaptive difficulty acceptance event
        window.dispatchEvent(new window.CustomEvent('c2_change_difficulty', {
            detail: { difficulty: 'medium', mode: 'jeu_de_la_grue' }
        }));

        assert.ok(btnMedium.classList.contains('active'), 'Medium button is now active after event');
        assert.strictEqual(btnEasy.classList.contains('active'), false, 'Easy button is no longer active');
        assert.strictEqual(window.getGameState().currentDifficulty, 'medium', 'Game state updated to medium');
    });

    test('7. Fast click on adaptive difficulty popup does not cause double level re-scramble', () => {
        const { window, document } = createGrueEnvironment();

        let startLevelCalls = 0;
        const originalStartNewLevel = window.startNewLevel;
        window.startNewLevel = function () {
            startLevelCalls++;
            return originalStartNewLevel.apply(this, arguments);
        };

        // Reset call count after initial load
        startLevelCalls = 0;

        // Simulate adaptive popup acceptance
        window.dispatchEvent(new window.CustomEvent('c2_change_difficulty', {
            detail: { difficulty: 'medium', mode: 'jeu_de_la_grue' }
        }));

        assert.strictEqual(startLevelCalls, 1, 'startNewLevel called exactly once on difficulty change');
        assert.strictEqual(window.getGameState().currentDifficulty, 'medium');

        // Verify that adaptive dismissed also starts a level once
        startLevelCalls = 0;
        window.dispatchEvent(new window.CustomEvent('c2_adaptive_dismissed', {
            detail: { difficulty: 'medium', mode: 'jeu_de_la_grue' }
        }));
        assert.strictEqual(startLevelCalls, 1, 'startNewLevel called exactly once on dismissed');
    });
});
