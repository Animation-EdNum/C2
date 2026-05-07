import sys

filepath = 'webapps/routage_reseau.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        function newChallenge() {
            const pool = networkPool[difficulty];
            // Anti-répétition : choisir un index différent du dernier
            let idx;
            if (pool.length > 1) {
                do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastNetworkIndex);
            } else {
                idx = 0;
            }
            lastNetworkIndex = idx;
            parseNetwork(pool[idx]);
"""

replace_block = """
        // PRNG simple pour lockTopology
        function mulberry32(a) {
            return function() {
                var t = a += 0x6D2B79F5;
                t = Math.imul(t ^ t >>> 15, t | 1);
                t ^= t + Math.imul(t ^ t >>> 7, t | 61);
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            }
        }

        let seededRandom = null;
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const seedParam = urlParams.get('seed');
            if (urlParams.get('lockTopology') === '1' && seedParam) {
                // Créer un hash simple du seed string vers un nombre pour initialiser le PRNG
                let seedNum = 0;
                for (let i = 0; i < seedParam.length; i++) {
                    seedNum = Math.imul(31, seedNum) + seedParam.charCodeAt(i) | 0;
                }
                seededRandom = mulberry32(seedNum);
            }
        });

        function newChallenge() {
            const pool = networkPool[difficulty];
            // Anti-répétition : choisir un index différent du dernier
            let idx;

            // Random source
            const rng = seededRandom ? seededRandom : Math.random;

            if (pool.length > 1) {
                do { idx = Math.floor(rng() * pool.length); } while (idx === lastNetworkIndex && !seededRandom);
            } else {
                idx = 0;
            }
            lastNetworkIndex = idx;
            parseNetwork(pool[idx]);
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("routage_reseau.html updated successfully.")
else:
    print("Search block not found in routage_reseau.html")
