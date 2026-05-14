/* ================================================================
   SVGS DES BOUTONS DU BLUE-BOT
   ================================================================ */
const MAT_CONFIG = {
    'none': { name: 'Aucun tapis', desc: 'Grille standard.', content: '', icon: '🚫' },
    'custom': { name: 'Tapis personnalisé', desc: 'Votre propre image', icon: '🖼️', content: '' },
    'alphabet': { name: 'Alphabet et nombres', desc: 'Lettres A-Z et chiffres 0-9.', example: 'Épelle ton prénom.', content: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), icon: '🔤' },
    'emotions': {
        name: 'Émotions et sentiments',
        desc: 'Reconnaître et nommer les émotions.',
        example: 'Comment te sens-tu aujourd\'hui ?',
        icon: '🎭',
        content: [
            '😀', '😢', '😡', '😨',
            '🤢', '😴', '🤔', '🤩',
            '😭', '🥳', '🥱', '🤐',
            '🤧', '🤒', '🤕', '🤑'
        ]
    },
    'seasons': {
        name: 'Saisons et météo',
        desc: 'Les saisons et les différents types de météo.',
        example: 'Quel temps fait-il aujourd\'hui ?',
        icon: '☀️',
        content: [
            '☀️', '🌧️', '⛅', '⛈️', '❄️',
            '⛄', '🍂', '🍁', '🌸', '🏖️',
            '🧥', '🧣', '🧤', '☂️', '🌈',
            '🌪️', '🌫️', '🌂', '🌡️', '🌬️'
        ]
    },
    'city': {
        name: 'Cité',
        desc: 'Thème ville et routes.',
        example: 'Amène le robot au supermarché.',
        icon: '<i data-fa="city"></i>'
    },
    'math': {
        name: 'Calcul mental',
        desc: 'Chiffres de 0 à 100 pour s\'entraîner au calcul.',
        example: 'Quel est le résultat de 5 + 7 ?',
        icon: '🔢',
        content: Array.from({ length: 101 }, (_, i) => i.toString())
    },
    'shapes': {
        name: 'Couleurs et formes',
        desc: 'Formes géométriques colorées.',
        example: 'Trouve le carré rouge.',
        icon: '🔵',
        content: [],
        baseContent: [
            '<i data-fa="square" style="color: #e74c3c;"></i>', '<i data-fa="square" style="color: #3498db;"></i>', '<i data-fa="square" style="color: #f1c40f;"></i>', '<i data-fa="square" style="color: #2ecc71;"></i>',
            '<i data-fa="circle" style="color: #e74c3c;"></i>', '<i data-fa="circle" style="color: #3498db;"></i>', '<i data-fa="circle" style="color: #f1c40f;"></i>', '<i data-fa="circle" style="color: #2ecc71;"></i>',
            '<i data-fa="triangle" style="color: #e74c3c;"></i>', '<i data-fa="triangle" style="color: #3498db;"></i>', '<i data-fa="triangle" style="color: #f1c40f;"></i>', '<i data-fa="triangle" style="color: #2ecc71;"></i>',
            '<i data-fa="star" style="color: #e74c3c;"></i>', '<i data-fa="star" style="color: #3498db;"></i>', '<i data-fa="star" style="color: #f1c40f;"></i>', '<i data-fa="star" style="color: #2ecc71;"></i>',
            '<i data-fa="star" style="color: #e67e22;"></i>', '<i data-fa="star" style="color: #9b59b6;"></i>', '<i data-fa="heart" style="color: #e74c3c;"></i>', '<i data-fa="heart" style="color: #3498db;"></i>',
            '<i data-fa="heart" style="color: #f1c40f;"></i>', '<i data-fa="heart" style="color: #2ecc71;"></i>', '<i data-fa="heart" style="color: #e67e22;"></i>', '<i data-fa="heart" style="color: #9b59b6;"></i>',
            '<i data-fa="square" style="color: #e67e22;"></i>', '<i data-fa="square" style="color: #9b59b6;"></i>', '<i data-fa="square" style="color: #e84393;"></i>', '<i data-fa="square" class="shape-black"></i>',
            '<i data-fa="circle" style="color: #e67e22;"></i>', '<i data-fa="circle" style="color: #9b59b6;"></i>', '<i data-fa="circle" style="color: #e84393;"></i>', '<i data-fa="circle" class="shape-black"></i>',
            '<i data-fa="triangle" style="color: #e67e22;"></i>', '<i data-fa="triangle" style="color: #9b59b6;"></i>', '<i data-fa="triangle" style="color: #e84393;"></i>', '<i data-fa="triangle" class="shape-black"></i>',
            '<i data-fa="moon" style="color: #e74c3c;"></i>', '<i data-fa="square" style="color: #95a5a6;"></i>', '<i data-fa="square" style="color: #1abc9c;"></i>', '<i data-fa="square" style="color: #d35400;"></i>',
            '<i data-fa="square" style="color: #8e44ad;"></i>', '<i data-fa="square" style="color: #7f8c8d;"></i>', '<i data-fa="moon" style="color: #3498db;"></i>', '<i data-fa="circle" style="color: #95a5a6;"></i>',
            '<i data-fa="circle" style="color: #1abc9c;"></i>', '<i data-fa="circle" style="color: #d35400;"></i>', '<i data-fa="circle" style="color: #8e44ad;"></i>', '<i data-fa="circle" style="color: #7f8c8d;"></i>',
            '<i data-fa="moon" style="color: #f1c40f;"></i>', '<i data-fa="triangle" style="color: #95a5a6;"></i>', '<i data-fa="triangle" style="color: #1abc9c;"></i>', '<i data-fa="triangle" style="color: #d35400;"></i>',
            '<i data-fa="triangle" style="color: #8e44ad;"></i>', '<i data-fa="triangle" style="color: #7f8c8d;"></i>', '<i data-fa="star" style="color: #e84393;"></i>', '<i data-fa="star" class="shape-black"></i>',
            '<i data-fa="moon" style="color: #2ecc71;"></i>', '<i data-fa="star" style="color: #95a5a6;"></i>', '<i data-fa="star" style="color: #1abc9c;"></i>', '<i data-fa="star" style="color: #d35400;"></i>',
            '<i data-fa="star" style="color: #8e44ad;"></i>', '<i data-fa="star" style="color: #7f8c8d;"></i>', '<i data-fa="heart" style="color: #e84393;"></i>', '<i data-fa="heart" class="shape-black"></i>',
            '<i data-fa="moon" style="color: #e67e22;"></i>', '<i data-fa="heart" style="color: #95a5a6;"></i>', '<i data-fa="heart" style="color: #1abc9c;"></i>', '<i data-fa="heart" style="color: #d35400;"></i>',
            '<i data-fa="heart" style="color: #8e44ad;"></i>', '<i data-fa="heart" style="color: #7f8c8d;"></i>', '<i data-fa="diamond" style="color: #e74c3c;"></i>', '<i data-fa="diamond" style="color: #3498db;"></i>',
            '<i data-fa="diamond" style="color: #f1c40f;"></i>', '<i data-fa="diamond" style="color: #2ecc71;"></i>', '<i data-fa="diamond" style="color: #e67e22;"></i>', '<i data-fa="diamond" style="color: #9b59b6;"></i>',
            '<i data-fa="diamond" style="color: #e84393;"></i>', '<i data-fa="diamond" class="shape-black"></i>', '<i data-fa="moon" style="color: #9b59b6;"></i>', '<i data-fa="diamond" style="color: #95a5a6;"></i>',
            '<i data-fa="diamond" style="color: #1abc9c;"></i>', '<i data-fa="diamond" style="color: #d35400;"></i>', '<i data-fa="diamond" style="color: #8e44ad;"></i>', '<i data-fa="diamond" style="color: #7f8c8d;"></i>',
            '<i data-fa="hexagon" style="color: #e74c3c;"></i>', '<i data-fa="hexagon" style="color: #3498db;"></i>', '<i data-fa="hexagon" style="color: #f1c40f;"></i>', '<i data-fa="hexagon" style="color: #2ecc71;"></i>',
            '<i data-fa="hexagon" style="color: #e67e22;"></i>', '<i data-fa="hexagon" style="color: #9b59b6;"></i>', '<i data-fa="hexagon" style="color: #e84393;"></i>', '<i data-fa="hexagon" class="shape-black"></i>',
            '<i data-fa="moon" style="color: #e84393;"></i>', '<i data-fa="hexagon" style="color: #95a5a6;"></i>', '<i data-fa="hexagon" style="color: #1abc9c;"></i>', '<i data-fa="hexagon" style="color: #d35400;"></i>',
            '<i data-fa="hexagon" style="color: #8e44ad;"></i>', '<i data-fa="hexagon" style="color: #7f8c8d;"></i>', '<i data-fa="octagon" style="color: #e74c3c;"></i>', '<i data-fa="octagon" style="color: #3498db;"></i>'
        ]
    },
    'geo': {
        name: 'Géographie',
        desc: 'Drapeaux du monde.',
        example: 'Dans quel pays se trouve Tokyo ?',
        icon: '🌍',
        content: [
            '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇵🇹', '🇬🇧', '🇧🇪', '🇳🇱', '🇦🇹', '🇬🇷',
            '🇸🇪', '🇳🇴', '🇺🇸', '🇨🇦', '🇲🇽', '🇨🇭', '🇨🇴', '🇦🇷', '🇯🇵', '🇰🇷',
            '🇧🇷', '🇿🇦', '🇦🇺', '🇳🇿', '🇨🇳', '🇮🇳', '🇪🇬', '🇲🇦', '🇸🇳', '🇰🇪',
            '🇷🇺', '🇹🇷', '🇵🇱', '🇩🇰', '🇫🇮', '🇮🇪', '🇨🇿', '🇭🇺', '🇷🇴', '🇧🇬',
            '🇷🇸', '🇭🇷', '🇸🇮', '🇸🇰', '🇺🇦', '🇨🇱', '🇵🇪', '🇻🇪', '🇺🇾', '🇵🇾',
            '🇧🇴', '🇪🇨', '🇨🇺', '🇯🇲', '🇭🇹', '🇩🇴', '🇵🇷', '🇲🇬', '🇳🇬', '🇬🇭',
            '🇨🇮', '🇨🇲', '🇩🇿', '🇹🇳', '🇱🇾', '🇸🇩', '🇪🇹', '🇸🇴', '🇹🇿', '🇺🇬',
            '🇷🇼', '🇿🇲', '🇿🇼', '🇲🇿', '🇦🇴', '🇳🇦', '🇧🇼', '🇲🇾', '🇮🇩', '🇵🇭',
            '🇹🇭', '🇻🇳', '🇲🇲', '🇰🇭', '🇱🇦', '🇸🇬', '🇧🇩', '🇵🇰', '🇮🇷', '🇮🇶',
            '🇸🇦', '🇦🇪', '🇶🇦', '🇰🇼', '🇴🇲', '🇾🇪', '🇸🇾', '🇯🇴', '🇱🇧', '🇮🇱'
        ]
    },
    'time': {
        name: 'Lecture de l\'heure',
        desc: 'Wie spät ist es ?',
        icon: '⌚',
        content: [
            '🕛', '🕐', '🕑', '🕒', '🕓', '🕔',
            '🕕', '🕖', '🕗', '🕘', '🕙', '🕚',
            '🕧', '🕜', '🕝', '🕞', '🕟', '🕠',
            '🕡', '🕢', '🕣', '🕤', '🕥', '🕦'
        ]
    },
    'fairy_tale': {
        name: 'Conte personnalisable',
        desc: "L'élève raconte son histoire en programmant le parcours du robot. Mode créatif.",
        icon: '🧚',
        content: [],
        baseContent: [
            '👸', '🐉', '🧙', '🏰', '🌲', '💎', '👑', '🦄', '⚔️', '🛡️',
            '🗝️', '📜', '🐴', '🐸', '🧚', '🧜‍♀️', '🧞‍♂️', '🧝‍♀️', '🧛‍♂️', '🧟‍♀️',
            '🧞‍♀️', '🪞', '🍎', '🍄', '🌼', '🌈', '⭐', '🌙', '☀️', '☁️',
            '⚡', '🔥', '💧', '🌊', '❄️', '🌪️', '🤴', '🦹', '🦸', '🐺',
            '🕷️', '🕸️', '🦇', '🥀', '🌹', '🏹', '🪄', '🔮', '🧪', '🩸',
            '🦴', '☠️', '👻', '👽', '👾', '🤖', '🎃', '🎭', '🎨', '🎻',
            '🎺', '🪘', '🥁', '⛺', '🛶', '⛵', '⚓', '🧭', '🗺️', '🏔️',
            '🌋', '🏕️', '🛤️', '🪙', '💰', '💸', '🏺', '💍', '🦅', '🦆',
            '🦢', '🦩', '🦚', '🦜', '🐊', '🐢', '🦎', '🐍', '🦕', '🦖',
            '🐳', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙',
            '🦉', '🦔', '🐿️', '🦡', '🦦', '🪲', '🦋', '🐌', '🐞', '🐜',
            '🪶', '🪺', '🪹', '🪨', '🪵', '🪴', '🌾', '💐', '🌷', '🪷',
            '🏵️', '🌸', '🌺', '🌻', '🪻', '🍄‍🟫', '🪸', '🪼',
            '🦀', '🦞', '🦐', '🦑', '🦪', '🐚'
        ]
    }
};

const SKIN_CONFIG = {
    'volcano': {
        name: 'En feu 🔥',
        obstacle: '<i data-fa="snowflake" style="color: #3498db;"></i>',
        target: `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g class="treasure-pile"><g stroke="#92400e" stroke-width="1.5"><circle cx="30" cy="35" r="10" fill="url(#coin-grad)"/><circle cx="70" cy="30" r="9" fill="url(#coin-grad)"/><circle cx="20" cy="55" r="8" fill="url(#coin-grad)"/><circle cx="80" cy="65" r="11" fill="url(#coin-grad)"/><circle cx="45" cy="75" r="12" fill="url(#coin-grad)"/></g><g stroke="#92400e" stroke-width="1.5"><circle cx="45" cy="25" r="11" fill="url(#coin-grad)"/><circle cx="65" cy="50" r="13" fill="url(#coin-grad)"/><circle cx="35" cy="60" r="12" fill="url(#coin-grad)"/><circle cx="60" cy="70" r="9" fill="url(#coin-grad)"/></g><g stroke="#92400e" stroke-width="1.5"><circle cx="50" cy="45" r="15" fill="url(#coin-grad)" filter="url(#gold-glow)"/></g><g fill="none" stroke="#fef3c7" stroke-width="1" opacity="0.5"><circle cx="30" cy="35" r="6"/><circle cx="70" cy="30" r="5"/><circle cx="20" cy="55" r="4"/><circle cx="80" cy="65" r="7"/><circle cx="45" cy="75" r="8"/><circle cx="45" cy="25" r="7"/><circle cx="65" cy="50" r="9"/><circle cx="35" cy="60" r="8"/><circle cx="60" cy="70" r="5"/><circle cx="50" cy="45" r="11"/></g><g class="sparkle s1"><path d="M 30 20 L 32 28 L 40 30 L 32 32 L 30 40 L 28 32 L 20 30 L 28 28 Z" fill="white" filter="url(#gold-glow)"/></g><g class="sparkle s2"><path d="M 70 50 L 72 58 L 80 60 L 72 62 L 70 70 L 68 62 L 60 60 L 68 58 Z" fill="white" filter="url(#gold-glow)"/></g><g class="sparkle s3"><path d="M 50 35 L 53 43 L 61 45 L 53 47 L 50 55 L 47 47 L 39 45 L 47 43 Z" fill="white" filter="url(#gold-glow)"/></g></g></svg>`,
        desc: 'Réussis un décodage (extrême) du premier coup.', hidden: false
    },
    'cyberbot': { name: 'Cyber-Bot 2077', obstacle: '<i data-fa="dt-alien-8bit" style="--fa-primary: #00FF41; --fa-secondary: #FF10F0;"></i>', target: '💾', desc: 'Réussis un pilotage (extrême) du premier coup.', hidden: false },
    'unicorn': { name: 'Licorne magique', obstacle: '<i data-fa="dt-poo-storm" style="--fa-primary: #8b4513; --fa-secondary: #ffff00; --fa-primary-opacity: 1; --fa-secondary-opacity: 1;"></i>', target: '🧁', desc: 'Réussis un dessin (extrême) du premier coup.', hidden: false },
    'pirate': { name: 'Vaisseau pirate', obstacle: '<i data-fa="skull-crossbones" class="pirate-obstacle" style="color: #2c3e50;"></i>', target: '🪙', desc: 'Atteins le trésor avec les commandes masquées.', hidden: false },
    'beebot': { name: 'Bzzz-Bot', obstacle: '<i data-fa="dt-trees" class="beebot-obstacle" style="--fa-primary: #27ae60; --fa-secondary: #1e8449;"></i>', target: '🌻', desc: 'N\'utilise jamais deux fois la même instruction d\'affilée pour atteindre le trésor.', hidden: false },
    'botanique': { name: 'Bot-anique', obstacle: '<i data-fa="ram" class="botanique-obstacle"></i>', target: '🌸', desc: 'La persévérance finit par payer...', hidden: true },
    'indecis': { name: 'Indécis', obstacle: '<i data-fa="exclamation" style="color: #f39c12;"></i>', target: '⁉️', desc: 'L\'erreur est humaine, l\'hésitation aussi...', hidden: true },
    'thymio': { name: 'Thymio', obstacle: '<i data-fa="traffic-cone" style="color: #e67e22;"></i>', target: '✏️', desc: 'Atteins un trésor sans utiliser la flèche "Avancer".', hidden: false },
    'space': { name: 'Rocket', obstacle: '<i data-fa="dt-meteor" style="--fa-primary: #f39c12; --fa-secondary: #e74c3c; --fa-primary-opacity: 1; --fa-secondary-opacity: 1;"></i>', target: '💎', desc: 'Reviens sur ta case de départ après avoir fait un parcours de 20 instructions exactement.', hidden: false },
    'f1': { name: 'Formule 1', obstacle: '<i data-fa="dt-traffic-light-stop" class="f1-obstacle" style="--fa-primary: #e74c3c; --fa-secondary: #34495e; width: 55%; height: 55%;"></i>', target: '🏁', desc: 'Enchaîne 3 victoires de suite (mode Pilotage, difficulté moyenne ou plus) sans faire une seule erreur.', hidden: false },
    'manta': { name: 'Raie Manta', obstacle: '<i data-fa="narwhal"></i>', target: '🦐', desc: 'Trouve 4 paires dans le mode Memory.', hidden: false },
    'train': { name: 'Loco', obstacle: '<i data-fa="cow" style="color: #FF10F0;"></i>', target: '🚉', desc: 'Parcours un total de 100 cases.', hidden: false },
    'helicopter': { name: 'Hélico', obstacle: '<i data-fa="dt-volcano" style="--fa-primary: #e74c3c; --fa-secondary: #f39c12;"></i>', target: '🏥', desc: 'Prends garde au vertige...', hidden: true },
    'pedago': { name: 'Colorigami', obstacle: '<i data-fa="ghost" style="color: grey;"></i>', target: '🧭', desc: 'Aile orange ou verte ? Appuie sur le bouton de la même couleur pour tourner du bon côté.', hidden: true },
    'default': { name: 'Automate', obstacle: '<i data-fa="block-brick" style="color: #c0392b;"></i>', target: '⭐', desc: 'Le robot que tu connais bien.', hidden: false }
};

const AT_SVGS = {
    forward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="5 11 12 4 19 11"/></svg>`,
    backward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><polyline points="19 13 12 20 5 13"/></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20v-6a4 4 0 0 0-4-4H4"/><polyline points="10 4 4 10 10 16"/></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20v-6a4 4 0 0 1 4-4h12"/><polyline points="14 4 20 10 14 16"/></svg>`
};

window.addEventListener('DOMContentLoaded', () => {
    const padFwd = document.getElementById('pad-fwd');
    if (padFwd) padFwd.innerHTML = AT_SVGS.forward;
    const padBwd = document.getElementById('pad-bwd');
    if (padBwd) padBwd.innerHTML = AT_SVGS.backward;
    const padLeft = document.getElementById('pad-left');
    if (padLeft) padLeft.innerHTML = AT_SVGS.left;
    const padRight = document.getElementById('pad-right');
    if (padRight) padRight.innerHTML = AT_SVGS.right;

    const legendContainer = document.getElementById('legend-container');
    if (legendContainer) {
        legendContainer.innerHTML = `
        <div class="legend-item"><div class="legend-dot fwd">${AT_SVGS.forward}</div> Avancer</div>
        <div class="legend-item"><div class="legend-dot bwd">${AT_SVGS.backward}</div> Reculer</div>
        <div class="legend-item"><div class="legend-dot left">${AT_SVGS.left}</div> Gauche 90°</div>
        <div class="legend-item"><div class="legend-dot right">${AT_SVGS.right}</div> Droite 90°</div>
        <div class="legend-item"><div class="legend-dot go" style="font-size: 10px; font-weight: bold;">GO</div> Démarrer</div>
        <div class="legend-item"><div class="legend-dot clear" style="font-size: 10px; font-weight: bold;">X</div> Effacer</div>
    `;
    }
});

/* ================================================================
   SKINS ET GAMIFICATION
   ================================================================ */


function shuffleArray(array) {
    let newArr = [...array];
    let currentIndex = newArr.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]];
    }
    return newArr;
}

let drawerTriggerElement = null;


const trapListeners = new WeakMap();

function setupFocusTrap(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!trapListeners.has(modal)) {
        const listener = function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        modal.addEventListener('keydown', listener);
        trapListeners.set(modal, listener);
    }

    // Focus first element on open
    setTimeout(() => firstElement.focus(), 50);
}

function openMatsModal() {
    drawerTriggerElement = document.activeElement;
    playSound('click');
    renderMatsGrid();
    document.getElementById('mats-drawer').classList.add('active');
    document.getElementById('mats-drawer-overlay').classList.add('active');
    document.getElementById('mats-drawer-overlay').setAttribute('aria-hidden', 'false');
    document.getElementById('mats-drawer').setAttribute('aria-hidden', 'false');
    setupFocusTrap('mats-drawer');
}

function closeMatsModal() {
    if (drawerTriggerElement) drawerTriggerElement.focus();
    playSound('click');
    document.getElementById('mats-drawer').classList.remove('active');
    document.getElementById('mats-drawer-overlay').classList.remove('active');
    document.getElementById('mats-drawer-overlay').setAttribute('aria-hidden', 'true');
    document.getElementById('mats-drawer').setAttribute('aria-hidden', 'true');
}

function renderMatsGrid() {
    const container = document.getElementById('mats-list-container');
    container.innerHTML = Object.keys(MAT_CONFIG).filter(matId => matId !== 'none' && matId !== 'custom').map(matId => {
        const config = MAT_CONFIG[matId];
        const isActive = activeMat === matId;

        const exampleHtml = config.example ? `<div class="skin-item-desc" style="font-style: italic; color: var(--accent); margin-top: 4px; font-size: 0.8em;">💡 ${config.example}</div>` : '';

        return `
                    <div class="skin-list-item ${isActive ? 'active-skin' : ''}" data-mat="${matId}" tabindex="0">
                        <div class="skin-item-avatar" style="font-size: 32px;">
                            ${config.icon || 'A'}
                        </div>
                        <div class="skin-item-info">
                            <div class="skin-item-name">${config.name}</div>
                            <div class="skin-item-desc">${config.desc}</div>
                            ${exampleHtml}
                        </div>
                    </div>
                `;
    }).join('');
    if (window.fa && typeof window.fa.createIcons === 'function') {
        window.fa.createIcons();
    }

    // Prepend the custom upload at the beginning
    const customConfig = MAT_CONFIG['custom'];
    const isCustomActive = activeMat === 'custom';
    const customHtml = `
                <div class="skin-list-item ${isCustomActive ? 'active-skin' : ''}" data-mat="custom" tabindex="0" style="margin-bottom: 15px; border-bottom: 1px solid var(--grid-border); border-radius: 12px 12px 0 0; padding-bottom: 15px;">
                    <div class="skin-item-avatar" style="font-size: 32px;">
                        ${customConfig.icon}
                    </div>
                    <div class="skin-item-info">
                        <div class="skin-item-name">${customConfig.name}</div>
                        <div class="skin-item-desc">${customConfig.desc}</div>
                        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;" onclick="event.stopPropagation()">
                            <label for="customMatUpload" class="btn btn-outline btn-small"
                                style="cursor: pointer; flex-grow: 1; text-align: center; font-size: 0.85em; padding: 4px 8px;">
                                <i data-fa="upload" style="width: 14px; height: 14px; margin-right: 5px; vertical-align: middle;"></i>
                                Télécharger image
                            </label>
                            <input type="file" id="customMatUpload" accept="image/*" style="display: none;">
                        </div>
                        <div id="customMatStatus" style="font-size: 0.8em; color: var(--text-muted); margin-top: 5px;"></div>
                    </div>
                </div>
            `;
    container.innerHTML = customHtml + container.innerHTML;
    fa.createIcons();

    // Re-bind the upload listener here since the DOM is recreated
    const uploadInput = document.getElementById('customMatUpload');
    if (uploadInput) {
        // Ensure we call the existing global function if defined, or define one dynamically
        uploadInput.addEventListener('change', function (e) {
            if (typeof handleCustomMatUpload === 'function') {
                handleCustomMatUpload(e);
            }
        });
    }
}


function generateMatContent(matId) {
    if (matId === 'custom') {
        if (!localStorage.getItem('at_custom_mat_image')) {
            console.warn("Custom mat selected but no image uploaded.");
        }
        return;
    }
    const config = MAT_CONFIG[matId];
    const endContainer = document.getElementById('sim-end-container');
    const toggleEndBtn = document.getElementById('btn-toggle-end-container');
    const placeElementsBtn = document.getElementById('btn-place-elements');
    
    if (config && (config.content || config.baseContent)) {
        if (toggleEndBtn) toggleEndBtn.style.display = 'inline-block';
        if (placeElementsBtn) placeElementsBtn.style.display = 'none';
        // Hide by default unless user has manually opened it (or we can just keep it closed on new mat)
        if (endContainer && !endContainer.classList.contains('manually-toggled')) {
            endContainer.style.display = 'none';
        }
    } else {
        if (toggleEndBtn) toggleEndBtn.style.display = 'none';
        if (placeElementsBtn) placeElementsBtn.style.display = 'inline-block';
        if (endContainer) {
            endContainer.style.display = 'none';
            endContainer.classList.remove('manually-toggled');
        }
    }

    if (!config) {
        console.warn(`Unknown matId: ${matId}`);
        return;
    }

    // 1. Preserve original content the first time
    if (!config.originalContent && config.content) {
        config.originalContent = [...config.content];
    }

    // 2. Always reset config.content to original before any mode generation
    if (config.originalContent) {
        config.content = [...config.originalContent];
    }

    const needed = GRID_ROWS * GRID_COLS;
    if (memoryMode && matId !== 'none' && matId !== 'custom' && matId !== 'city') {
        const pool = config.baseContent || config.originalContent;
        if (pool && pool.length > 0) {
            const neededPairs = Math.floor(needed / 2);
            let pairsContent = [];
            const shuffledPool = shuffleArray([...pool]);

            for (let i = 0; i < neededPairs; i++) {
                const item = shuffledPool[i % shuffledPool.length];
                pairsContent.push(item, item);
            }

            if (needed % 2 !== 0) {
                pairsContent.push(shuffledPool[neededPairs % shuffledPool.length]);
            }

            config.content = shuffleArray(pairsContent);
            if (typeof memoryPairsFound !== 'undefined') memoryPairsFound = 0;
            return;
        }
    }

    if (config.baseContent) {
        if (matId === 'shapes') {
            const needed = GRID_ROWS * GRID_COLS;
            let content = [];
            let baseIndex = 0;

            // Pick from baseContent in order (simpler first) to fill the grid
            while (content.length < needed) {
                content.push(config.baseContent[baseIndex % config.baseContent.length]);
                baseIndex++;
            }

            config.content = shuffleArray(content);
        } else if (matId === 'fairy_tale') {
            config.content = shuffleArray([...config.baseContent]).slice(0, GRID_ROWS * GRID_COLS);
        }
    }
}


function updateEndModesVisibility() {
    const spellBtn = document.getElementById('btn-toggle-spell-mode');
    const memoryBtn = document.getElementById('btn-toggle-memory-mode');
    const placeElementsBtn = document.getElementById('btn-place-elements');
    const config = MAT_CONFIG[activeMat];
    const hasContent = activeMat !== 'none' && activeMat !== 'custom' && activeMat !== 'city' && config && (config.content || config.baseContent);

    if (hasContent) {
        if (spellBtn) spellBtn.style.display = 'inline-block';
        if (memoryBtn) memoryBtn.style.display = 'inline-block';
        if (placeElementsBtn) placeElementsBtn.style.display = 'none';
    } else {
        if (spellBtn) spellBtn.style.display = 'none';
        if (memoryBtn) memoryBtn.style.display = 'none';
        if (placeElementsBtn) placeElementsBtn.style.display = 'inline-block';
        
        // Also close the container if no content
        const endContainer = document.getElementById('sim-end-container');
        if (endContainer) {
            endContainer.style.display = 'none';
            endContainer.classList.remove('manually-toggled');
        }
        memoryMode = false;
        spellMode = false;
        collectMode = false;
    }
}



function cycleMat() {
    const matKeys = Object.keys(MAT_CONFIG).filter(key => {
        if (key === 'custom' && !localStorage.getItem('at_custom_mat_image')) {
            return false;
        }
        return true;
    });

    let currentIndex = matKeys.indexOf(activeMat);
    if (currentIndex === -1) currentIndex = 0;

    const nextIndex = (currentIndex + 1) % matKeys.length;
    selectMat(matKeys[nextIndex]);
}

function selectMat(matId) {
    if (matId === 'custom' && !localStorage.getItem('at_custom_mat_image')) {
        // If user selects custom mat but no image uploaded yet, prompt upload
        const uploadInput = document.getElementById('customMatUpload');
        if (uploadInput) {
            uploadInput.click();
        }
        return;
    }

    playSound('click');
    activeMat = matId;
    localStorage.setItem('at_active_mat', matId);
    
    simState.obstacles = [];
    simState.targetRow = null;
    simState.targetCol = null;
    if (typeof exploreState !== 'undefined') {
        exploreState.obstacles = [];
        exploreState.targetRow = null;
        exploreState.targetCol = null;
    }
    
    const endContainer = document.getElementById('sim-end-container');
    if (endContainer) {
        endContainer.classList.remove('manually-toggled');
        endContainer.style.display = 'none';
    }

    generateMatContent(matId);

    renderMatsGrid();
    closeMatsModal();
    updateGridSizeSlidersState();
    updateEndModesVisibility();

    // Re-render grids to apply mat
    buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
    renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
    TrailManager.clear('sim-grid');
    if (simState.targetRow !== null && simState.targetCol !== null) {
        renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
    }

    if (typeof exploreState !== 'undefined' && exploreState.robotRow !== undefined && exploreState.robotRow !== null) {
        buildGrid('explore-grid', GRID_ROWS, GRID_COLS, exploreState.obstacles || []);
        renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
        TrailManager.clear('explore-grid');
        if (exploreState.targetRow !== null && exploreState.targetCol !== null) {
            renderTarget('explore-grid', 'explore-target', exploreState.targetRow, exploreState.targetCol);
        }
    }
    if (chalState.robotRow !== null) {
        buildGrid('chal-grid', GRID_ROWS, GRID_COLS, chalState.obstacles || []);
        renderRobot('chal-grid', 'chal-robot', chalState.robotRow, chalState.robotCol, chalState.robotDir);
        TrailManager.clear('chal-grid');
        if (chalState.targetRow !== null) renderTarget('chal-grid', 'chal-target', chalState.targetRow, chalState.targetCol);
    }
    if (typeof readState !== 'undefined' && readState.robotRow !== undefined && readState.robotRow !== null) {
        buildGrid('read-grid', GRID_ROWS, GRID_COLS, readState.obstacles || []);
        renderRobot('read-grid', 'read-robot', readState.robotRow, readState.robotCol, readState.robotDir);
        TrailManager.clear('read-grid');
    }
    if (typeof drawState !== 'undefined' && drawState.robotRow !== undefined && drawState.robotRow !== null) {
        buildGrid('draw-grid', GRID_ROWS, GRID_COLS, []);
        renderRobot('draw-grid', 'draw-robot', drawState.robotRow, drawState.robotCol, drawState.robotDir);
        TrailManager.clear('draw-grid');
    }
}

function openSkinsModal() {
    drawerTriggerElement = document.activeElement;
    playSound('click');
    renderSkinsList();
    document.getElementById('ui-panel').classList.add('active');
    document.getElementById('ui-panel-overlay').classList.add('active');
    document.getElementById('ui-panel-overlay').setAttribute('aria-hidden', 'false');
    document.getElementById('ui-panel').setAttribute('aria-hidden', 'false');
    setupFocusTrap('ui-panel');
}

function closeSkinsModal() {
    if (drawerTriggerElement) drawerTriggerElement.focus();
    playSound('click');
    document.getElementById('ui-panel').classList.remove('active');
    document.getElementById('ui-panel-overlay').classList.remove('active');
    document.getElementById('ui-panel-overlay').setAttribute('aria-hidden', 'true');
    document.getElementById('ui-panel').setAttribute('aria-hidden', 'true');
}

function renderSkinsList() {
    const container = document.getElementById('skins-list-container');
    container.innerHTML = Object.keys(SKIN_CONFIG).filter(id => {
        const config = SKIN_CONFIG[id];
        return !config.hidden || unlockedSkins.includes(id);
    }).map(skinId => {
        const config = SKIN_CONFIG[skinId];
        const isUnlocked = unlockedSkins.includes(skinId);
        const isActive = activeSkin === skinId;

        let svg = ROBOT_SVGS[skinId] || ROBOT_SVGS['default'];
        svg = svg.replace(/<\/?animate[a-zA-Z]*[\s\S]*?>/gi, ''); // Remove animations for preview
        svg = svg.replace(/animation:[^;]+;/gi, ''); // Remove CSS animations
        if (skinId === 'volcano') {
            svg = svg.replace(/<g transform="scale\(1\.4\) translate\(-14, -14\)">/, '<g transform="scale(0.6) translate(36, 0)">');
        }
        let btnHtml = '';
        let lockIcon = '';

        if (!isUnlocked) {
            lockIcon = `<div class="lock-icon" style="position: absolute; font-size: 24px; z-index: 2;">🔒</div>`;
        }

        return `
                    <div class="skin-list-item ${!isUnlocked ? 'locked' : ''} ${isActive ? 'active-skin' : ''}" data-skin="${skinId}" tabindex="0">
                        <div class="skin-item-avatar">
                            ${lockIcon}
                            ${svg}
                        </div>
                        <div class="skin-item-info">
                            <div class="skin-item-name">${config.name}</div>
                            <div class="skin-item-desc">${config.desc}</div>
                        </div>
                        <div class="skin-item-miniatures">
                            <div class="skin-item-mini" data-tooltip="Obstacle">${config.obstacle}</div>
                            <div class="skin-item-mini" data-tooltip="Récompense">${config.target}</div>
                        </div>

                    </div>
                `;
    }).join('');
    if (window.fa && typeof window.fa.createIcons === 'function') {
        window.fa.createIcons();
    }
}

function redrawTrail(containerId, state) {
    let maxIndex = state.program.length - 1;
    if (state.running || state.failed) {
        maxIndex = state.stepIndex - 1;
    }
    TrailManager.clear(containerId);
    TrailManager.captureInitialState(containerId, state.startRow, state.startCol, state.startDir);
    let tempState = { robotRow: state.startRow, robotCol: state.startCol, robotDir: state.startDir, obstacles: state.obstacles };
    for (let i = 0; i <= maxIndex; i++) {
        let cmd = state.program[i];
        let res = moveRobot(tempState, cmd);
        if (res.robotRow !== tempState.robotRow || res.robotCol !== tempState.robotCol) {
            TrailManager.addSegment(containerId, res.robotRow, res.robotCol);
        }
        tempState = res;
    }
}

function updateSkinGrids() {
    const grids = ['sim-grid', 'explore-grid', 'chal-grid', 'read-grid', 'draw-grid'];
    grids.forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        // Mettre à jour les classes
        Array.from(grid.classList).forEach(cls => {
            if (cls.startsWith('skin-')) grid.classList.remove(cls);
        });
        if (activeSkin !== 'volcano') grid.classList.remove('ground-fire');
        if (activeSkin !== 'pirate' && activeSkin !== 'manta') grid.classList.remove('ground-ocean');
        else grid.classList.add('ground-ocean');
        grid.classList.add(`skin-${activeSkin}`);

        // Mettre à jour les obstacles
        const obstacles = grid.querySelectorAll('.obstacle');
        const obsSkin = SKIN_CONFIG[activeSkin].obstacle;
        obstacles.forEach(cell => {
            if (obsSkin.includes('<svg') || obsSkin.includes('<i')) {
                cell.innerHTML = obsSkin;
                delete cell.dataset.obstacle;
            } else {
                cell.innerHTML = '';
                cell.dataset.obstacle = obsSkin;
            }
        });
    });
    if (window.fa && typeof window.fa.createIcons === 'function') {
        window.fa.createIcons();
    }
}

function updateSkinEntities() {
    // Mettre à jour les robots et cibles pour sim-grid
    renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
    if (simState.targetRow !== null && simState.targetCol !== null) {
        renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
    }

    // Mettre à jour les robots et cibles pour explore-grid
    if (typeof exploreState !== 'undefined' && exploreState.robotRow !== undefined && exploreState.robotRow !== null) {
        renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
        if (exploreState.targetRow !== null && exploreState.targetCol !== null) {
            renderTarget('explore-grid', 'explore-target', exploreState.targetRow, exploreState.targetCol);
        }
    }

    // Mettre à jour les robots et cibles pour chal-grid
    if (chalState.robotRow !== null) {
        renderRobot('chal-grid', 'chal-robot', chalState.robotRow, chalState.robotCol, chalState.robotDir);
        if (chalState.targetRow !== null) {
            renderTarget('chal-grid', 'chal-target', chalState.targetRow, chalState.targetCol);
        }
    }

    // Mettre à jour les robots et cibles pour read-grid
    if (typeof readState !== 'undefined' && readState.robotRow !== undefined && readState.robotRow !== null) {
        renderRobot('read-grid', 'read-robot', readState.robotRow, readState.robotCol, readState.robotDir);
        // La cible n'est pas rendue ici pour ne pas révéler la solution dans le mode lecture
    }

    // Mettre à jour les robots et cibles pour draw-grid
    if (typeof drawState !== 'undefined' && drawState.robotRow !== undefined && drawState.robotRow !== null) {
        renderRobot('draw-grid', 'draw-robot', drawState.robotRow, drawState.robotCol, drawState.robotDir);
    }
}

function updateSkinButtons() {
    const tgtBtn = document.getElementById('btn-target-icon');
    if (tgtBtn) {
        const tg = SKIN_CONFIG[activeSkin].target;
        if (tg && tg.includes('<svg')) {
            tgtBtn.innerHTML = tg;
            const svg = tgtBtn.querySelector('svg');
            if (svg) {
                svg.style.width = '1.2em';
                svg.style.height = '1.2em';
                svg.style.display = 'inline-block';
                svg.style.verticalAlign = 'middle';
            }
        } else {
            tgtBtn.innerText = tg || '';
        }
    }
    const obsBtn = document.getElementById('btn-obstacle-icon');
    if (obsBtn) {
        const ob = SKIN_CONFIG[activeSkin].obstacle;
        if (ob && (ob.includes('<svg') || ob.includes('<i'))) {
            obsBtn.innerHTML = ob;
            if (window.fa && typeof window.fa.createIcons === 'function') {
                window.fa.createIcons();
            }
            const svg = obsBtn.querySelector('svg');
            if (svg) {
                svg.style.width = '1.2em';
                svg.style.height = '1.2em';
                svg.style.display = 'inline-block';
                svg.style.verticalAlign = 'middle';
            }
        } else {
            obsBtn.innerText = ob || '';
        }
    }
}

function updateSkinTrails() {
    // Redraw trails to match new skin
    if (simState.program.length > 0 || simState.running || simState.failed) {
        redrawTrail('sim-grid', simState);
    } else {
        TrailManager.clear('sim-grid');
    }
    if (typeof exploreState !== 'undefined' && exploreState.history && exploreState.history.length > 0) {
        // Explore doesn't have a program queue, so we just clear or keep the trail depending on state. For now, clear is safer.
        TrailManager.clear('explore-grid');
    } else {
        TrailManager.clear('explore-grid');
    }
    if (typeof drawState !== 'undefined' && drawState.program.length > 0) {
        redrawTrail('draw-grid', drawState);
    } else {
        TrailManager.clear('draw-grid');
    }
    if (typeof readState !== 'undefined' && readState.program.length > 0 && readState.isAnimating) {
        // Not perfectly redrawing read path because it uses obstacles in moveRobot which readState has.
        redrawTrail('read-grid', readState);
    } else if (typeof readState !== 'undefined' && !readState.isAnimating) {
        TrailManager.clear('read-grid');
    }
    if (typeof chalState !== 'undefined') {
        // Just clear since chal doesn't store current active program explicitly
        TrailManager.clear('chal-grid');
    }
}

function selectSkin(skinId) {
    if (!unlockedSkins.includes(skinId)) return;
    playSound('click');
    activeSkin = skinId;
    localStorage.setItem('at_active_skin', skinId);

    // Cyber-Bot, Volcano and Unicorn force Dark Mode
    if (skinId === 'cyberbot' || skinId === 'volcano' || skinId === 'unicorn') {
        if (!document.body.classList.contains('dark')) toggleTheme();
    }

    if (skinId === 'pirate' || skinId === 'manta') {
        startOceanRipples();
    } else {
        stopOceanRipples();
    }

    renderSkinsList();
    closeSkinsModal();

    // Met à jour les grilles sans réinitialiser leur état
    updateSkinGrids();
    updateSkinEntities();
    updateSkinButtons();
    updateSkinTrails();
}

function unlockSkin(skinId) {
    // Check if skin unlocking is disabled by URL parameter
    if (typeof window.isSkinUnlockDisabled !== 'undefined' && window.isSkinUnlockDisabled) {
        return;
    }
    if (!unlockedSkins.includes(skinId)) {
        unlockedSkins.push(skinId);

        localStorage.setItem('at_unlocked_skins', JSON.stringify(unlockedSkins));

        if (activeSkin === 'volcano') {
            launchFire();
        } else {
            launchConfetti();
        }

        showToast(`Nouveau Skin débloqué : ${SKIN_CONFIG[skinId].name} ! 🎁`, 'success');
        selectSkin(skinId);
    }
}




let collectMode = localStorage.getItem('at_collect_mode') === 'true';
let memoryMode = localStorage.getItem('at_memory_mode') === 'true';
let spellMode = localStorage.getItem('at_spell_mode') === 'true';

if (memoryMode) {
    collectMode = true;
    spellMode = false;
} else if (spellMode) {
    collectMode = false;
    memoryMode = false;
}

let activeMat = localStorage.getItem('at_active_mat') || 'none';
generateMatContent(activeMat);
if (!MAT_CONFIG[activeMat]) activeMat = 'none';

const MAT_GRID_CONSTRAINTS = {
    'alphabet': { cols: 6, rows: 6 },
    'time': { cols: 6, rows: 4 },
    'emotions': { cols: 4, rows: 4 },
    'seasons': { cols: 5, rows: 4 },
    'city': { cols: 8, rows: 8 },
};

function updateGridSizeSlidersState() {
    if (!gridColsSlider || !gridRowsSlider) return;
    const constraint = MAT_GRID_CONSTRAINTS[activeMat];
    const locked = !!constraint;
    const title = locked ? `Taille fixe de ${constraint.cols}x${constraint.rows} pour ce tapis` : '';

    gridColsSlider.disabled = locked;
    gridRowsSlider.disabled = locked;
    gridColsSlider.parentElement.style.opacity = locked ? '0.5' : '1';
    gridRowsSlider.parentElement.style.opacity = locked ? '0.5' : '1';
    gridColsSlider.parentElement.setAttribute('data-tooltip', title);
    gridRowsSlider.parentElement.setAttribute('data-tooltip', title);

    if (locked && (GRID_COLS !== constraint.cols || GRID_ROWS !== constraint.rows)) {
        gridColsSlider.value = constraint.cols;
        gridRowsSlider.value = constraint.rows;
        onGridSizeChanged();
    }
}



let unlockedSkins = JSON.parse(localStorage.getItem('at_unlocked_skins') || '["default"]');
if ((typeof window.unlockAllSkins !== 'undefined' && window.unlockAllSkins) || new URLSearchParams(window.location.search).get('unlockAllSkins') === '1') {
    unlockedSkins = Object.keys(SKIN_CONFIG);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateSkinToolbarButtonsVisibility === 'function') {

    }
});
let activeSkin = localStorage.getItem('at_active_skin') || 'default';
if (!SKIN_CONFIG[activeSkin]) activeSkin = 'default';

const ROBOT_SVGS = {
    'indecis': `
        <svg viewBox="0 0 200 250" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#81b1ff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4a90e2;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#34495e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2c3e50;stop-opacity:1" />
                </linearGradient>

                <style>
                    .indecis-eye {
                        /* Boucle de 30 secondes, répétée à l'infini */
                        animation: blink-pseudo-random 30s infinite;
                    }
                    /* Point d'ancrage au centre de chaque oeil pour qu'il se ferme sur lui-même */
                    .indecis-left-eye { transform-origin: -25px 0px; }
                    .indecis-right-eye { transform-origin: 25px 0px; }

                    /* Répartition sur 30 secondes pour simuler l'aléatoire (entre 5s et 10s d'écart) :
                       - Clignement 1 à 6s (20%)
                       - Clignement 2 à 14s (46.6%) -> écart 8s
                       - Clignement 3 à 21s (70%) -> écart 7s
                       - Clignement 4 à 29s (96.6%) -> écart 8s
                       (Le suivant sera à 6s du cycle d'après -> écart 7s)
                    */
                    @keyframes blink-pseudo-random {
                        0%, 19.5%, 20.5%, 46.1%, 47.1%, 69.5%, 70.5%, 96.1%, 97.1%, 100% {
                            transform: scaleY(1);
                        }
                        20%, 46.6%, 70%, 96.6% {
                            /* On écrase l'oeil sur l'axe Y pour simuler la paupière */
                            transform: scaleY(0.1);
                        }
                    }
                </style>
            </defs>

            <path d="M60,80 C60,30 140,30 140,80 C140,110 110,120 100,140 L100,160"
                  fill="none"
                  stroke="url(#bodyGradient)"
                  stroke-width="35"
                  stroke-linecap="round" />

            <g transform="translate(100, 60)">
                <g class="indecis-eye indecis-left-eye">
                    <circle cx="-25" cy="0" r="10" fill="white" />
                    <circle cx="-25" cy="2" r="5" fill="#333" />
                    <circle cx="-28" cy="-2" r="2" fill="white" />
                </g>

                <g class="indecis-eye indecis-right-eye">
                    <circle cx="25" cy="0" r="10" fill="white" />
                    <circle cx="25" cy="2" r="5" fill="#333" />
                    <circle cx="22" cy="-2" r="2" fill="white" />
                </g>

                <path d="M-10,15 Q0,10 10,15" fill="none" stroke="#333" stroke-width="2" />

                <path d="M-35,-15 Q-25,-20 -15,-15" fill="none" stroke="#333" stroke-width="2" />
                <path d="M15,-12 Q25,-15 35,-10" fill="none" stroke="#333" stroke-width="2" />
            </g>

            <g transform="translate(100, 210)">
                <circle r="18" fill="#4a90e2" />
            </g>
        </svg>`,
    'pirate': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(0.8) translate(12.5, 12.5)">

                        <path d="M 50 0 Q 30 10 15 35" fill="none" stroke="#38bdf8" stroke-linecap="round">
                            <animate attributeName="stroke-width" values="1; 2; 1" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5; 0.9; 0.5" dur="1.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M 50 0 Q 70 10 85 35" fill="none" stroke="#38bdf8" stroke-linecap="round">
                            <animate attributeName="stroke-width" values="1; 2; 1" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5; 0.9; 0.5" dur="1.5s" repeatCount="indefinite" />
                        </path>

                        <ellipse cx="50" cy="85" rx="5" ry="2" fill="none" stroke="#7dd3fc">
                            <animate attributeName="cy" values="85; 130" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="rx" values="5; 35" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="ry" values="2; 15" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="stroke-width" values="2; 0.5" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </ellipse>

                        <ellipse cx="50" cy="85" rx="5" ry="2" fill="none" stroke="#7dd3fc">
                            <animate attributeName="cy" values="85; 130" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="rx" values="5; 35" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="ry" values="2; 15" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="stroke-width" values="2; 0.5" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                        </ellipse>

                        <ellipse cx="50" cy="85" rx="5" ry="2" fill="none" stroke="#7dd3fc">
                            <animate attributeName="cy" values="85; 130" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="rx" values="5; 35" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="ry" values="2; 15" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="stroke-width" values="2; 0.5" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                        </ellipse>

                        <circle cx="42" cy="85" r="2" fill="#bae6fd">
                            <animate attributeName="cy" values="85; 120" dur="1.5s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="1.5s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <circle cx="58" cy="85" r="3" fill="#bae6fd">
                            <animate attributeName="cy" values="85; 115" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
                            <animate attributeName="opacity" values="0.7; 0" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>

                        <line x1="50" y1="20" x2="50" y2="-15" stroke="#3E2723" stroke-width="3" stroke-linecap="round"/>

                        <path d="M 50 0 L 75 30 L 65 85 Q 50 95 35 85 L 25 30 Z" fill="#5C4033" stroke="#271811" stroke-width="2"/>

                        <path d="M 50 6 L 70 32 L 61 82 Q 50 88 39 82 L 30 32 Z" fill="#8B4513" stroke="#3E2723" stroke-width="1"/>
                        <line x1="38" y1="25" x2="62" y2="25" stroke="#3E2723" stroke-width="0.5" opacity="0.6"/>
                        <line x1="33" y1="45" x2="67" y2="45" stroke="#3E2723" stroke-width="0.5" opacity="0.6"/>
                        <line x1="37" y1="65" x2="63" y2="65" stroke="#3E2723" stroke-width="0.5" opacity="0.6"/>

                        <g fill="#111">
                            <rect x="23" y="38" width="10" height="4" rx="1"/>
                            <rect x="67" y="38" width="10" height="4" rx="1"/>
                            <rect x="25" y="62" width="10" height="4" rx="1"/>
                            <rect x="65" y="62" width="10" height="4" rx="1"/>
                        </g>

                        <circle cx="50" cy="35" r="4" fill="#271811"/>
                        <circle cx="50" cy="65" r="4" fill="#271811"/>
                        <path d="M 15 35 Q 50 5 85 35 Q 65 25 50 25 Q 35 25 15 35 Z" fill="#F5F5DC" stroke="#D3D3D3" stroke-width="1"/>
                        <path d="M 10 65 Q 50 30 90 65 Q 70 50 50 50 Q 30 50 10 65 Z" fill="#F5F5DC" stroke="#D3D3D3" stroke-width="1"/>
                        <line x1="20" y1="32" x2="80" y2="32" stroke="#271811" stroke-width="2" stroke-linecap="round"/>
                        <line x1="15" y1="62" x2="85" y2="62" stroke="#271811" stroke-width="2" stroke-linecap="round"/>

                        <g transform="translate(50, 65) scale(0.7)">
                            <path d="M 0 0 Q -10 15 -25 5 L -25 -15 Q -10 -5 0 -20 Z" fill="#111">
                                <animate attributeName="d" values="M 0 0 Q -10 15 -25 5 L -25 -15 Q -10 -5 0 -20 Z; M 0 0 Q -15 5 -25 5 L -25 -15 Q -15 -15 0 -20 Z; M 0 0 Q -10 15 -25 5 L -25 -15 Q -10 -5 0 -20 Z" dur="1s" repeatCount="indefinite" />
                            </path>
                            <circle cx="-12" cy="-5" r="3" fill="white"/>
                            <line x1="-16" y1="-9" x2="-8" y2="-1" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="-16" y1="-1" x2="-8" y2="-9" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        </g>
                    </g>
                </svg>`,
    'manta': `
<svg viewBox="0 0 100 95" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; width: 100%; height: auto;">
  <defs>
    <path id="mantaShape" d="M 50 15
           C 46 15, 45 10, 43 10 C 40 10, 40 15, 42 18
           L 40 20
           C 20 25, 2 40, 2 55
           C 2 68, 25 78, 50 85
           C 75 78, 98 68, 98 55
           C 98 40, 80 25, 60 20
           L 58 18
           C 60 15, 60 10, 57 10 C 55 10, 54 15, 50 15 Z" />

    <clipPath id="clipManta">
      <use href="#mantaShape" />
    </clipPath>

    <radialGradient id="skinGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0f172a" />
    </radialGradient>

    <filter id="manta-soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" />
    </filter>
  </defs>

  <style>
    .manta-tail {
      transform-origin: 50px 85px;
      animation: manta-wave 3s ease-in-out infinite alternate;
    }
    @keyframes manta-wave {
      0% { transform: rotate(-3deg); }
      100% { transform: rotate(3deg); }
    }
  </style>

  <!-- La Queue XXL (Elle dépasse maintenant de 50 unités en bas) -->
  <path class="manta-tail" d="M 50 85 Q 53 110 50 145" fill="none" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round" />

  <!-- CORPS (Parfaitement centré dans la fenêtre 100x95) -->
  <g clip-path="url(#clipManta)">
    <use href="#mantaShape" fill="url(#skinGrad)" />
    <ellipse cx="40" cy="25" rx="8" ry="4" fill="white" opacity="0.3" filter="url(#manta-soft)" transform="rotate(-30, 40, 25)" />
    <ellipse cx="60" cy="25" rx="8" ry="4" fill="white" opacity="0.3" filter="url(#manta-soft)" transform="rotate(30, 60, 25)" />
  </g>

  <use href="#mantaShape" fill="none" stroke="#475569" stroke-width="0.3" />
</svg>`,
    'f1': `
                <svg viewBox="0 0 100 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="carbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#111827" />
                    <stop offset="50%" stop-color="#374151" />
                    <stop offset="100%" stop-color="#111827" />
                    </linearGradient>

                    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <style>
                    /* Vibration violente (Amplitude x10 par rapport à avant) */
                    .f1-hyper-vibration { 
                    animation: nitroThrob 0.07s ease-in-out infinite alternate; 
                    }
                    @keyframes nitroThrob {
                    from { transform: translateX(-1.5px); }
                    to { transform: translateX(1.5px); }
                    }
                    
                    .exhaust { 
                    animation: flame 0.1s linear infinite; 
                    }
                    @keyframes flame {
                    0% { opacity: 0.8; transform: scaleY(1); }
                    100% { opacity: 0.2; transform: scaleY(2); }
                    }
                </style>

                <g class="f1-hyper-vibration" transform-origin="50 90">
                    <!-- Ombre -->
                    <path d="M 30 20 L 70 20 L 85 175 L 15 175 Z" fill="#000000" opacity="0.15" />

                    <!-- PNEUS (Noir profond pour le contraste) -->
                    <g fill="#000000">
                    <rect x="14" y="35" width="13" height="26" rx="2" /> 
                    <rect x="73" y="35" width="13" height="26" rx="2" />
                    <rect x="8" y="135" width="16" height="32" rx="3" /> 
                    <rect x="76" y="135" width="16" height="32" rx="3" />
                    </g>

                    <!-- AILERON AVANT (Rouge Vif #ef4444) -->
                    <rect x="16" y="20" width="68" height="10" rx="1" fill="#ef4444" />
                    <rect x="40" y="22" width="20" height="2" fill="#facc15" /> <!-- Détail Jaune -->

                    <!-- CHÂSSIS (Forme moderne épurée) -->
                    <path d="M 50 12 
                            L 41 35 
                            L 34 70 
                            C 34 105, 23 125, 23 155 
                            L 77 155 
                            C 77 125, 66 105, 66 70 
                            L 59 35 Z" 
                        fill="url(#carbonGrad)" stroke="#4b5563" stroke-width="0.5" />

                    <!-- COCKPIT, HALO & CASQUE -->
                    <path d="M 38 85 C 38 65, 50 60, 50 60 C 50 60, 62 65, 62 85" fill="none" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" />
                    <circle cx="50" cy="88" r="5.5" fill="#facc15" filter="url(#neonGlow)" /> <!-- Casque Jaune Fluo -->

                    <!-- PONTONS (Rouge Sport #dc2626) -->
                    <path d="M 34 75 Q 24 85, 28 115 L 39 115 Z" fill="#dc2626" />
                    <path d="M 66 75 Q 76 85, 72 115 L 61 115 Z" fill="#dc2626" />

                    <!-- AILERON ARRIÈRE (Spoiler massif) -->
                    <rect x="20" y="158" width="60" height="14" rx="1" fill="#ef4444" />
                    <rect x="25" y="162" width="50" height="4" fill="#000000" opacity="0.4" />

                    <!-- FLAMME D'ÉCHAPPEMENT -->
                    <path class="exhaust" d="M 46 155 L 54 155 L 50 175 Z" fill="#f97316" filter="url(#neonGlow)" />
                </g>
                </svg>`,
    'unicorn': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(0.8) translate(12.5, 12.5)">
                    <path d="M 45 80 Q 25 105 50 110 Q 75 105 55 80 Z" fill="#FFB6C1" opacity="0.9"/>
                    <path d="M 48 80 Q 35 100 50 105 Q 65 100 52 80 Z" fill="#87CEEB" opacity="0.9"/>

                    <rect x="18" y="65" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(40, 25, 75)"/>
                    <rect x="68" y="65" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(-40, 75, 75)"/>
                    <rect x="20" y="30" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(-45, 27, 42)"/>
                    <rect x="66" y="30" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(45, 73, 42)"/>

                    <ellipse cx="50" cy="55" rx="24" ry="34" fill="#FFF" stroke="#FFC0CB" stroke-width="2"/>

                    <path d="M 50 25 Q 35 45 52 65 Q 60 75 48 85" fill="none" stroke="#FF69B4" stroke-width="6" stroke-linecap="round"/>
                    <path d="M 50 25 Q 65 40 48 60 Q 40 75 52 85" fill="none" stroke="#87CEEB" stroke-width="6" stroke-linecap="round"/>

                    <polygon points="38,22 20,15 34,30" fill="#FFF" stroke="#FFC0CB" stroke-width="2" stroke-linejoin="round"/>
                    <polygon points="62,22 80,15 66,30" fill="#FFF" stroke="#FFC0CB" stroke-width="2" stroke-linejoin="round"/>

                    <ellipse cx="50" cy="25" rx="16" ry="20" fill="#FFF" stroke="#FFC0CB" stroke-width="2"/>

                    <ellipse cx="37" cy="24" rx="2.5" ry="4.5" fill="#000" transform="rotate(-15, 36, 24)"/>
                    <ellipse cx="63" cy="24" rx="2.5" ry="4.5" fill="#000" transform="rotate(15, 64, 24)"/>

                    <ellipse cx="50" cy="10" rx="12" ry="8" fill="#FFC0CB" />

                    <polygon points="45,10 55,10 50,-15" fill="#FFD700" stroke="#DAA520" stroke-width="1.5" stroke-linejoin="round"/>

                    <path d="M 46,10 L 54,8 M 47,2 L 53,0 M 48,-6 L 52,-8" stroke="#DAA520" stroke-width="2" stroke-linecap="round"/>
                </g>
            </svg>
            `,
    'train': `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 510" width="125%" height="125%" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="volumeChaudiere" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#111" />
                    <stop offset="50%" stop-color="#444" />
                    <stop offset="100%" stop-color="#0a0a0a" />
                </linearGradient>
                <linearGradient id="cuivre" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffb347" />
                    <stop offset="100%" stop-color="#8b4513" />
                </linearGradient>
                
                <style>
                    .skin-train-vibration { 
                        animation: skin-train-shake 0.4s ease-in-out infinite alternate; 
                        transform-origin: center;
                    }
                    @keyframes skin-train-shake {
                        from { transform: translateX(-2px); }
                        to { transform: translateX(2px); }
                    }
                </style>
            </defs>

            <!-- Groupe vibrant global sans translation superflue -->
            <g class="skin-train-vibration">
                
                <!-- Ombre au sol (ajustée pour la nouvelle vue) -->
                <rect x="135" y="40" width="130" height="510" fill="rgba(0,0,0,0.15)" rx="10" />

                <!-- === STRUCTURE DE LA LOCOMOTIVE === -->
                <!-- Cabine (Le "cul" du train) -->
                <rect x="130" y="450" width="140" height="90" fill="#700" rx="3" />
                <rect x="135" y="455" width="130" height="80" fill="#333" rx="5" />
                <rect x="187" y="442" width="6" height="4" fill="#666" rx="1" />
                <rect x="140" y="460" width="15" height="15" fill="#222" rx="2" />
                <rect x="245" y="460" width="15" height="15" fill="#222" rx="2" />

                <!-- Chaudière -->
                <rect x="155" y="140" width="90" height="310" fill="url(#volumeChaudiere)" />
                <circle cx="200" cy="380" r="22" fill="url(#cuivre)" />
                <rect x="195" y="380" width="10" height="10" fill="#4a3018" rx="2" />
                <circle cx="180" cy="330" r="8" fill="#444" />
                <circle cx="220" cy="330" r="8" fill="#444" />
                
                <!-- Avant & Cheminée -->
                <rect x="155" y="100" width="90" height="40" fill="#111" />
                <circle cx="200" cy="120" r="25" fill="#0a0a0a" />
                <circle cx="200" cy="120" r="14" fill="#000" />
                
                <!-- Chasse-buffle (L'avant à y=40) -->
                <polygon points="200,40 145,100 255,100" fill="#222" />
                <rect x="135" y="85" width="15" height="10" fill="#333" rx="1" />
                <rect x="250" y="85" width="15" height="10" fill="#333" rx="1" />
                <circle cx="200" cy="90" r="6" fill="#ffffcc" />
                
                <!-- Le Phare : il commence à y=85 et vise y=-100, donc il sort de la viewBox qui commence à y=40 -->
                <polygon points="195,85 100,-100 300,-100 205,85" fill="#ffffcc" opacity="0.2" />

                <!-- === ANIMATION DE LA FUMÉE COMPLEXE === -->
                <g class="smoke-puffs">
                <!-- Puff 1 -->
                <circle cx="200" cy="120" r="10" fill="#eee">
                    <animate attributeName="cy" values="120; 450" dur="2.5s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="r" values="8; 85" dur="2.5s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="opacity" values="0; 0.7; 0" dur="2.5s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="cx" values="200; 210; 190; 200" dur="2.5s" repeatCount="indefinite" begin="0s" />
                </circle>
                <!-- Puff 2 -->
                <circle cx="200" cy="120" r="10" fill="#ddd">
                    <animate attributeName="cy" values="120; 500" dur="2.8s" repeatCount="indefinite" begin="0.4s" />
                    <animate attributeName="r" values="8; 95" dur="2.8s" repeatCount="indefinite" begin="0.4s" />
                    <animate attributeName="opacity" values="0; 0.6; 0" dur="2.8s" repeatCount="indefinite" begin="0.4s" />
                    <animate attributeName="cx" values="200; 195; 205; 200" dur="2.8s" repeatCount="indefinite" begin="0.4s" />
                </circle>
                <!-- Puff 3 -->
                <circle cx="200" cy="120" r="10" fill="#ccc">
                    <animate attributeName="cy" values="120; 550" dur="3s" repeatCount="indefinite" begin="0.8s" />
                    <animate attributeName="r" values="8; 110" dur="3s" repeatCount="indefinite" begin="0.8s" />
                    <animate attributeName="opacity" values="0; 0.5; 0" dur="3s" repeatCount="indefinite" begin="0.8s" />
                </circle>
                <!-- Puff 4 -->
                <circle cx="200" cy="120" r="10" fill="#bbb">
                    <animate attributeName="cy" values="120; 400" dur="3.2s" repeatCount="indefinite" begin="1.2s" />
                    <animate attributeName="r" values="10; 70" dur="3.2s" repeatCount="indefinite" begin="1.2s" />
                    <animate attributeName="opacity" values="0; 0.8; 0" dur="3.2s" repeatCount="indefinite" begin="1.2s" />
                </circle>
                <!-- Puff 5 -->
                <circle cx="200" cy="120" r="10" fill="#aaa">
                    <animate attributeName="cy" values="120; 600" dur="3.5s" repeatCount="indefinite" begin="1.6s" />
                    <animate attributeName="r" values="10; 130" dur="3.5s" repeatCount="indefinite" begin="1.6s" />
                    <animate attributeName="opacity" values="0; 0.4; 0" dur="3.5s" repeatCount="indefinite" begin="1.6s" />
                </circle>
                <!-- Puff 6 -->
                <circle cx="200" cy="120" r="10" fill="#999">
                    <animate attributeName="cy" values="120; 480" dur="2.7s" repeatCount="indefinite" begin="2.0s" />
                    <animate attributeName="r" values="6; 100" dur="2.7s" repeatCount="indefinite" begin="2.0s" />
                    <animate attributeName="opacity" values="0; 0.6; 0" dur="2.7s" repeatCount="indefinite" begin="2.0s" />
                </circle>
                </g>
            </g>
        </svg>`,
    'helicopter': `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -130 600 750" width="100%" height="100%">
                <defs>
                    <linearGradient id="redBody" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#7a0a0a" />
                    <stop offset="15%" stop-color="#b81d1d" />
                    <stop offset="50%" stop-color="#ff3333" />
                    <stop offset="85%" stop-color="#b81d1d" />
                    <stop offset="100%" stop-color="#520303" />
                    </linearGradient>

                    <radialGradient id="glassGradient" cx="50%" cy="40%" r="60%" fx="40%" fy="30%">
                    <stop offset="0%" stop-color="#8ab4f8" />
                    <stop offset="30%" stop-color="#2c4c70" />
                    <stop offset="80%" stop-color="#0a192f" />
                    <stop offset="100%" stop-color="#020812" />
                    </radialGradient>

                    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#555" />
                    <stop offset="50%" stop-color="#aaa" />
                    <stop offset="100%" stop-color="#333" />
                    </linearGradient>

                    <linearGradient id="tailRed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#8f1111" />
                    <stop offset="50%" stop-color="#e62e2e" />
                    <stop offset="100%" stop-color="#730909" />
                    </linearGradient>

                    <filter id="ground-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
                    <feOffset dx="25" dy="35" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    </filter>

                    <filter id="rotor-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                    <feOffset dx="15" dy="25" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    </filter>

                    <g id="main-blade">
                    <rect x="-8" y="-220" width="16" height="220" rx="3" fill="#2b2d30" />
                    <rect x="-8" y="-220" width="4" height="220" fill="#66686b" />
                    <rect x="-8" y="-220" width="16" height="12" rx="2" fill="#ffcc00" />
                    <line x1="0" y1="-205" x2="0" y2="-15" stroke="#1a1b1c" stroke-width="1" />
                    </g>
                </defs>

                <g filter="url(#ground-shadow)">
                    <path d="M 185 200 L 225 200 M 185 300 L 225 300" stroke="#333" stroke-width="6" stroke-linecap="round" />
                    <path d="M 315 200 L 275 200 M 315 300 L 275 300" stroke="#333" stroke-width="6" stroke-linecap="round" />
                    <rect x="181" y="140" width="8" height="220" rx="4" fill="url(#metal)" />
                    <rect x="311" y="140" width="8" height="220" rx="4" fill="url(#metal)" />

                    <rect x="195" y="470" width="110" height="18" rx="5" fill="url(#tailRed)" />
                    <line x1="195" y1="479" x2="305" y2="479" stroke="#5c0707" stroke-width="1" opacity="0.6"/>

                    <path d="M 238 350 L 262 350 L 255 520 L 245 520 Z" fill="url(#tailRed)" />
                    
                    <rect x="247" y="500" width="6" height="40" rx="2" fill="#991414" />

                    <path d="M 250 100 
                            C 285 100, 305 180, 290 280 
                            C 280 340, 265 360, 250 360 
                            C 235 360, 220 340, 210 280 
                            C 195 180, 215 100, 250 100 Z" 
                        fill="url(#redBody)" />

                    <path d="M 218 200 Q 250 210 282 200" stroke="#5c0707" stroke-width="1.5" fill="none" opacity="0.7" />
                    <path d="M 212 260 Q 250 275 288 260" stroke="#5c0707" stroke-width="1.5" fill="none" opacity="0.7" />
                    <path d="M 222 320 Q 250 330 278 320" stroke="#5c0707" stroke-width="1.5" fill="none" opacity="0.7" />

                    <path d="M 250 105 
                            C 275 105, 283 150, 275 190 
                            C 270 205, 230 205, 225 190 
                            C 217 150, 225 105, 250 105 Z" 
                        fill="url(#glassGradient)" />
                        
                    <path d="M 250 105 L 250 202" stroke="#222" stroke-width="2.5" />
                    <path d="M 230 150 Q 250 142 270 150" stroke="#222" stroke-width="2.5" />
                    <path d="M 226 180 Q 250 174 274 180" stroke="#222" stroke-width="2" />

                    <path d="M 233 210 L 267 210 L 275 280 L 225 280 Z" fill="#2b2b2b" />
                    <line x1="240" y1="220" x2="260" y2="220" stroke="#111" stroke-width="2" />
                    <line x1="240" y1="225" x2="260" y2="225" stroke="#111" stroke-width="2" />
                    <line x1="240" y1="230" x2="260" y2="230" stroke="#111" stroke-width="2" />
                    <circle cx="238" cy="265" r="7" fill="#111" />
                    <circle cx="262" cy="265" r="7" fill="#111" />
                    <circle cx="238" cy="265" r="4" fill="#000" />
                    <circle cx="262" cy="265" r="4" fill="#000" />

                    <circle cx="205" cy="250" r="3" fill="#ff3333" />
                    <circle cx="295" cy="250" r="3" fill="#33ff33" />
                    <circle cx="250" cy="450" r="3.5" fill="#ffffff" />
                    <circle cx="250" cy="450" r="6" fill="#ff0000" opacity="0.4" />
                </g>

                <g filter="url(#rotor-shadow)">
                    
                    <g transform="translate(250, 245)">
                    <circle cx="0" cy="0" r="220" fill="#222" opacity="0.03" />

                    <g>
                        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="0.3s" repeatCount="indefinite" />
                        
                        <use href="#main-blade" transform="rotate(0)" />
                        <use href="#main-blade" transform="rotate(90)" />
                        <use href="#main-blade" transform="rotate(180)" />
                        <use href="#main-blade" transform="rotate(270)" />

                        <g>
                        <rect x="-4" y="-30" width="8" height="60" rx="2" fill="#555" />
                        <rect x="-30" y="-4" width="60" height="8" rx="2" fill="#555" />
                        <circle cx="0" cy="-25" r="4" fill="#222" />
                        <circle cx="0" cy="25" r="4" fill="#222" />
                        <circle cx="-25" cy="0" r="4" fill="#222" />
                        <circle cx="25" cy="0" r="4" fill="#222" />
                        </g>
                    </g>

                    <circle cx="0" cy="0" r="22" fill="#333" opacity="0.8"/>
                    <circle cx="0" cy="0" r="18" fill="#444" opacity="0.8"/>
                    <circle cx="0" cy="0" r="12" fill="#222" />
                    <circle cx="0" cy="0" r="8" fill="#555" />
                    <circle cx="0" cy="0" r="4" fill="#111" />
                    </g>
                </g> 
                </svg>`,
    'default': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect x="15" y="15" width="70" height="80" rx="27" ry="40" fill="#fff" fill-opacity=".8" stroke="#3b82f6" stroke-width="3"/>
                    <circle cx="50" cy="35" r="7" fill="#f97316"/>
                    <path d="m50 31 3 3m-3-3-3 3m3-3v8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="50" cy="50" r="8" fill="#10b981"/>
                    <text x="50" y="52" text-anchor="middle" font-family="sans-serif" font-size="6" fill="#fff" font-weight="bold">GO</text>
                    <circle cx="50" cy="65" r="7" fill="#f97316"/>
                    <path d="m50 69 3-3m-3 3-3-3m3 3v-8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="32" cy="50" r="7" fill="#f97316"/>
                    <path d="m28 50 3-3m-3 3 3 3m-3-3h8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="68" cy="50" r="7" fill="#f97316"/>
                    <path d="m72 50-3-3m3 3-3 3m3-3h-8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="35" cy="75" r="6" fill="#3b82f6"/>
                    <text x="35" y="77" text-anchor="middle" font-family="sans-serif" font-size="6" fill="#fff" font-weight="bold">X</text>
                    <circle cx="65" cy="75" r="6" fill="#3b82f6"/>
                    <path d="M63.5 73v4m3-4v4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
                    <circle cx="28" cy="15" r="10" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
                    <circle cx="72" cy="15" r="10" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
                    <circle cx="28" cy="12" r="3" fill="#1e293b"/>
                    <circle cx="72" cy="12" r="3" fill="#1e293b"/>
                    <circle cx="29" cy="11" r="1" fill="#fff" fill-opacity=".7"/>
                    <circle cx="71" cy="11" r="1" fill="#fff" fill-opacity=".7"/></svg>`,
    'thymio': `
                <svg viewBox="5 5 90 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="violetGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <filter id="greyGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <style>
                    .obey-light {
                        animation: obey-pulse 2s ease-in-out infinite alternate;
                        filter: url(#violetGlow);
                    }
                    @keyframes obey-pulse {
                        0% { opacity: 1; }
                        100% { opacity: 0.3; }
                    }
                </style>

                <rect x="13" y="42" width="6" height="32" rx="3" fill="#1c1917" />
                <rect x="81" y="42" width="6" height="32" rx="3" fill="#1c1917" />

                <path d="M 16 88 L 16 35 Q 50 5 84 35 L 84 88 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />

                <rect x="24.95" y="27.6" width="2.5" height="1.5" fill="#1c1917" transform="rotate(-31.7 26.2 28.35)" />
                <rect x="36.85" y="22.05" width="2.5" height="1.5" fill="#1c1917" transform="rotate(-17.1 38.1 22.8)" />
                <rect x="48.75" y="20.25" width="2.5" height="1.5" fill="#1c1917" />
                <rect x="60.65" y="22.05" width="2.5" height="1.5" fill="#1c1917" transform="rotate(17.1 61.9 22.8)" />
                <rect x="72.55" y="27.6" width="2.5" height="1.5" fill="#1c1917" transform="rotate(31.7 73.8 28.35)" />

                <rect x="33.75" y="86.5" width="2.5" height="1.5" fill="#1c1917" />
                <rect x="63.75" y="86.5" width="2.5" height="1.5" fill="#1c1917" />

                <g fill="#94a3b8" stroke="#94a3b8" stroke-width="1.5" filter="url(#greyGlow)">
                    <polygon points="50,28 46,33 54,33" fill="#94a3b8" stroke="none" />
                    <polygon points="50,52 46,47 54,47" fill="#94a3b8" stroke="none" />
                    <polygon points="38,40 43,36 43,44" fill="#94a3b8" stroke="none" />
                    <polygon points="62,40 57,36 57,44" fill="#94a3b8" stroke="none" />
                    <circle cx="50" cy="40" r="16" fill="none" stroke="#fbbf24" stroke-width="2.5" />
                </g>

                <g>
                    <circle cx="50" cy="75" r="5" fill="#1c1917" />
                    <g fill="#9333ea" class="obey-light">
                        <circle cx="40" cy="75" r="3" />
                        <circle cx="60" cy="75" r="3" />
                    </g>
                </g>
            </svg>`,
    'beebot': `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
            <defs>
                <clipPath id="bodyClip">
                    <rect x="50" y="20" width="100" height="150" rx="50" />
                </clipPath>
                    
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#FFB300" />
                    <stop offset="50%" stop-color="#FFD54F" />
                    <stop offset="100%" stop-color="#FFA000" />
                </linearGradient>
                    
                <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#E1F5FE" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#B3E5FC" stop-opacity="0.5"/>
                </linearGradient>
            </defs>

            <path d="M 70 25 Q 40 5 30 20" fill="none" stroke="#2C3E50" stroke-width="4" stroke-linecap="round"/>
            <circle cx="30" cy="20" r="6" fill="#FF5252" stroke="#2C3E50" stroke-width="2"/>
                
            <path d="M 130 25 Q 160 5 170 20" fill="none" stroke="#2C3E50" stroke-width="4" stroke-linecap="round"/>
            <circle cx="170" cy="20" r="6" fill="#FF5252" stroke="#2C3E50" stroke-width="2"/>

            <g stroke="#2C3E50" stroke-width="3">
                <ellipse cx="30" cy="100" rx="35" ry="60" fill="url(#wingGrad)" transform="rotate(-25 30 100)"/>
                <ellipse cx="170" cy="100" rx="35" ry="60" fill="url(#wingGrad)" transform="rotate(25 170 100)"/>
            </g>

            <rect x="50" y="20" width="100" height="150" rx="50" fill="url(#bodyGrad)" stroke="#2C3E50" stroke-width="6" />

            <g clip-path="url(#bodyClip)">
                <rect x="50" y="65" width="100" height="20" fill="#2C3E50" />
                <rect x="50" y="105" width="100" height="20" fill="#2C3E50" />
                <rect x="50" y="145" width="100" height="20" fill="#2C3E50" />

                <ellipse cx="100" cy="40" rx="30" ry="10" fill="#FFFFFF" opacity="0.4" />
            </g>

            <circle cx="75" cy="45" r="8" fill="#18FFFF" stroke="#2C3E50" stroke-width="3" />
            <circle cx="125" cy="45" r="8" fill="#18FFFF" stroke="#2C3E50" stroke-width="3" />
            <circle cx="77" cy="43" r="2" fill="#FFFFFF" />
            <circle cx="127" cy="43" r="2" fill="#FFFFFF" />

            <circle cx="100" cy="105" r="30" fill="#ECEFF1" stroke="#2C3E50" stroke-width="4" />
            <circle cx="100" cy="105" r="24" fill="#37474F" />
                
            <polygon points="100,86 108,96 92,96" fill="#29B6F6" />
            <polygon points="100,124 108,114 92,114" fill="#8e44ad" />
            <polygon points="81,105 91,97 91,113" fill="#FFD54F" />
            <polygon points="119,105 109,97 109,113" fill="#00E676" />

            <circle cx="100" cy="105" r="7" fill="#FFFFFF" />
            <circle cx="100" cy="105" r="4" fill="#18FFFF" />
            </svg>`,
    'space': `
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <!-- Rocket body -->
                    <path d="M 50 10 Q 80 30 80 70 L 20 70 Q 20 30 50 10 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
                    <!-- Window / Eye -->
                    <circle cx="50" cy="40" r="15" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
                    <circle cx="55" cy="35" r="4" fill="white" opacity="0.7"/>

                    <!-- Fins -->
                    <path d="M 20 70 L 5 90 L 25 80 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
                    <path d="M 80 70 L 95 90 L 75 80 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>

                    <!-- Flames (CSS animated later if possible, but basic SVG here) -->
                    <path class="rocket-flame" d="M 35 70 Q 50 100 65 70 Q 50 85 35 70 Z" fill="#f97316"/>
                    <path class="rocket-flame-inner" d="M 42 70 Q 50 90 58 70 Q 50 80 42 70 Z" fill="#fef08a"/>
                </svg>`,
    'volcano': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .wing-l { transform-origin: 40px 50px; animation: flapL 0.7s ease-in-out infinite alternate; }
                    .wing-r { transform-origin: 60px 50px; animation: flapR 0.7s ease-in-out infinite alternate; }
                    .fire { transform-origin: 50px 0px; animation: spit 0.15s ease-in-out infinite alternate; }
                    .tail { transform-origin: 50px 80px; animation: swish 1.5s ease-in-out infinite alternate; }

                    @keyframes flapL { 0% { transform: rotate(5deg) scaleY(1); } 100% { transform: rotate(-20deg) scaleY(0.85); } }
                    @keyframes flapR { 0% { transform: rotate(-5deg) scaleY(1); } 100% { transform: rotate(20deg) scaleY(0.85); } }
                    @keyframes spit { 0% { transform: scaleY(1) scaleX(0.9); opacity: 0.8; } 100% { transform: scaleY(1.3) scaleX(1.1); opacity: 1; } }
                    @keyframes swish { 0% { transform: rotate(-12deg); } 100% { transform: rotate(12deg); } }
                </style>
                <g transform="scale(1.4) translate(-14, -14)">
                    <g class="tail">
                        <path d="M 45 75 Q 50 135 50 155 Q 50 135 55 75 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="1.5"/>
                        <polygon points="50,155 40,140 60,140" fill="#f97316" filter="url(#glow)"/>
                        <polygon points="50,115 45,100 55,100" fill="#ea580c"/>
                    </g>
                    <g class="wing-l">
                        <!-- Scaled up wings -->
                        <g transform="scale(1.5) translate(-13, -15)">
                            <path d="M 40 45 C 5 20 -20 40 0 65 C 10 55 20 70 25 58 C 30 68 35 60 40 60 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="1.5" stroke-opacity="0.7"/>
                            <path d="M 40 45 Q 15 30 0 65 M 40 45 Q 20 45 25 58 M 40 45 Q 30 55 35 60" fill="none" stroke="#7f1d1d" stroke-width="2.5"/>
                        </g>
                    </g>
                    <g class="wing-r">
                        <!-- Scaled up wings -->
                        <g transform="scale(1.5) translate(-20, -15)">
                            <path d="M 60 45 C 95 20 120 40 100 65 C 90 55 80 70 75 58 C 70 68 65 60 60 60 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="1.5" stroke-opacity="0.7"/>
                            <path d="M 60 45 Q 85 30 100 65 M 60 45 Q 80 45 75 58 M 60 45 Q 70 55 65 60" fill="none" stroke="#7f1d1d" stroke-width="2.5"/>
                        </g>
                    </g>
                    <path d="M 50 22 C 68 28 72 60 50 82 C 28 60 32 28 50 22 Z" fill="#991b1b" stroke="#991b1b" stroke-width="2"/>
                    <path d="M 50 32 C 57 45 56 60 50 72 C 44 60 43 45 50 32 Z" fill="url(#lava)" filter="url(#glow)"/>
                    <path d="M 40 26 C 40 8 46 3 50 -2 C 54 3 60 8 60 26 Z" fill="#ea580c" stroke="#7f1d1d" stroke-width="1.5"/>
                    <path d="M 40 20 Q 25 8 20 25 Q 32 18 40 23" fill="#991b1b" stroke="#f97316" stroke-width="1"/>
                    <path d="M 60 20 Q 75 8 80 25 Q 68 18 60 23" fill="#991b1b" stroke="#f97316" stroke-width="1"/>
                    <polygon points="44,10 49,13 43,16" fill="#fef08a" filter="url(#glow)"/>
                    <polygon points="56,10 51,13 57,16" fill="#fef08a" filter="url(#glow)"/>
                </g>
            </svg>`,
    'cyberbot': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(0.85) translate(13, 13)">
                        <!-- ===== COUCHE GLITCH : 3 copies RGB décalées ===== -->

                        <!-- Rose fluo (décalée gauche) -->
                        <use href="#cyber-arrow" fill="#FF10F0" opacity="0.85" filter="url(#cyber-neon)">
                            <animateTransform attributeName="transform" type="translate"
                            values="-2,0; 1,-1; -3,1; 0,0; -2,0" dur="0.4s" repeatCount="indefinite"/>
                        </use>

                        <!-- Vert Matrix (décalée droite) -->
                        <use href="#cyber-arrow" fill="#00FF41" opacity="0.85" filter="url(#cyber-neon)">
                            <animateTransform attributeName="transform" type="translate"
                            values="2,0; -1,1; 3,-1; 0,0; 2,0" dur="0.35s" repeatCount="indefinite"/>
                        </use>

                        <!-- Cyan (couche centrale qui saute) -->
                        <use href="#cyber-arrow" fill="#00FFFF" opacity="0.5" filter="url(#cyber-neon)">
                            <animateTransform attributeName="transform" type="translate"
                            values="0,0; 0,0; 4,-2; 0,0; -3,2; 0,0" dur="0.8s" repeatCount="indefinite"/>
                            <animate attributeName="opacity"
                            values="0.5;0.2;0.8;0.1;0.5" dur="0.6s" repeatCount="indefinite"/>
                        </use>

                        <!-- Contour net vert qui pulse -->
                        <use href="#cyber-arrow" fill="none" stroke="#00FF41" stroke-width="0.4">
                            <animate attributeName="stroke"
                            values="#00FF41;#FF10F0;#00FFFF;#00FF41" dur="1.5s" repeatCount="indefinite"/>
                        </use>

                        <!-- ===== BANDES DE SCANLINES QUI GLITCH ===== -->
                        <g opacity="0.7">
                            <rect x="0" y="20" width="100" height="1.5" fill="#FF10F0">
                            <animate attributeName="y" values="10;45;25;80;15;60" dur="0.9s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0;0.9;0;0.7;0" dur="0.9s" repeatCount="indefinite"/>
                            </rect>
                            <rect x="0" y="60" width="100" height="0.8" fill="#00FF41">
                            <animate attributeName="y" values="70;30;85;20;55" dur="1.1s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.8;0;0.6;0;0.8" dur="1.1s" repeatCount="indefinite"/>
                            </rect>
                        </g>

                        <!-- ===== BLOCS DE CORRUPTION ===== -->
                        <rect x="0" y="45" width="100" height="3" fill="#FF10F0" opacity="0">
                            <animate attributeName="opacity" values="0;0;0.4;0;0;0" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="y" values="45;45;48;45;45;45" dur="2s" repeatCount="indefinite"/>
                        </rect>
                    </g>
                </svg>`,
    'botanique': `
            <svg width="166%" height="166%" viewBox="-25 -10 250 250" xmlns="http://www.w3.org/2000/svg">
            <!-- Définitions des dégradés pour le réalisme -->
            <defs>
                <!-- Dégradé pour la carapace rouge -->
                <radialGradient id="wingGradient" cx="50%" cy="40%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" style="stop-color:#ff3333;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#880000;stop-opacity:1" />
                </radialGradient>
                
                <!-- Reflet brillant sur le dessus -->
                <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:white;stop-opacity:0.4" />
                <stop offset="100%" style="stop-color:white;stop-opacity:0" />
                </linearGradient>
            </defs>

            <!-- Pattes supprimées -->

            <!-- Antennes repositionnées pour une tête plus petite -->
            <path d="M93 42 Q85 15 75 10" stroke="black" fill="none" stroke-width="2"/>
            <path d="M107 42 Q115 15 125 10" stroke="black" fill="none" stroke-width="2"/>

            <!-- Tête (Corps / Thorax) réduite -->
            <ellipse cx="100" cy="55" rx="18" ry="15" fill="#111" />
            
            <!-- Taches blanches sur le thorax adaptées à la plus petite tête -->
            <circle cx="92" cy="48" r="3" fill="white" opacity="0.8" />
            <circle cx="108" cy="48" r="3" fill="white" opacity="0.8" />

            <!-- Carapace rouge (Élytres) -->
            <path d="M100 170 C 40 170, 40 70, 100 70 C 160 70, 160 170, 100 170" fill="url(#wingGradient)" stroke="#200" stroke-width="1"/>
            
            <!-- Ligne de séparation des ailes -->
            <line x1="100" y1="70" x2="100" y2="170" stroke="black" stroke-width="1.5" />

            <!-- Les 7 points noirs (le classique) -->
            <g fill="#111">
                <circle cx="100" cy="90" r="10" /> <!-- Point central haut -->
                <circle cx="70" cy="100" r="8" />
                <circle cx="130" cy="100" r="8" />
                <circle cx="65" cy="135" r="9" />
                <circle cx="135" cy="135" r="9" />
                <circle cx="90" cy="155" r="6" />
                <circle cx="110" cy="155" r="6" />
            </g>

            <!-- Reflets brillants pour l'effet "carrosserie" -->
            <ellipse cx="80" cy="95" rx="15" ry="8" fill="url(#highlight)" transform="rotate(-30, 80, 95)" />
            </svg>`,
    'pedago': `
<svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Animation de battement d'ailes accentué */
    @keyframes skin-pedago-flap-left-pro {
      0%, 80%, 100% { transform: rotateY(0deg) translateY(0px); }
      84% { transform: rotateY(50deg) translateY(0px); } /* Battement plus ample */
      88% { transform: rotateY(10deg) translateY(0px); }
      92% { transform: rotateY(50deg) translateY(0px); } /* Deuxième battement pour la visibilité */
      96% { transform: rotateY(0deg) translateY(0px); }
    }

    @keyframes skin-pedago-flap-right-pro {
      0%, 80%, 100% { transform: rotateY(0deg) translateY(0px); }
      84% { transform: rotateY(-50deg) translateY(0px); }
      88% { transform: rotateY(-10deg) translateY(0px); }
      92% { transform: rotateY(-50deg) translateY(0px); }
      96% { transform: rotateY(0deg) translateY(0px); }
    }

    /* Application de l'animation sur les groupes d'ailes */
    .skin-pedago-wing-l {
      transform-origin: 200px 40px;
      animation: skin-pedago-flap-left-pro 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    }
    .skin-pedago-wing-r {
      transform-origin: 200px 40px;
      animation: skin-pedago-flap-right-pro 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    }
  </style>

  <defs>
    <filter id="skin-pedago-shadow-pro" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="12" flood-opacity="0.25" />
    </filter>
    <linearGradient id="skin-pedago-blue-nose-pro" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <g filter="url(#skin-pedago-shadow-pro)">

    <g class="skin-pedago-wing-l">
      <polygon points="200,40 50,320 200,270" fill="#FF9F1C" stroke="#1a1a1a" stroke-width="2" />
    </g>

    <g class="skin-pedago-wing-r">
      <polygon points="200,40 350,320 200,270" fill="#2ECC71" stroke="#1a1a1a" stroke-width="2" />
    </g>

    <polygon points="200,40 185,275 200,350" fill="#E67E22" stroke="#1a1a1a" stroke-width="2" />
    <polygon points="200,40 215,275 200,350" fill="#27AE60" stroke="#1a1a1a" stroke-width="2" />

    <g stroke="#1a1a1a" stroke-width="2">
      <path d="M200,40 L155,125 L200,110 L245,125 Z" fill="url(#skin-pedago-blue-nose-pro)" />
      <line x1="200" y1="40" x2="200" y2="110" stroke-width="1.5" />
    </g>

    <g stroke="#1a1a1a" stroke-width="2">
      <polygon points="185,275 200,350 200,270" fill="#9333EA" />
      <polygon points="215,275 200,350 200,270" fill="#7E22CE" />
    </g>

    <line x1="200" y1="40" x2="200" y2="270" stroke="#1a1a1a" stroke-width="2" opacity="0.2" />
  </g>
</svg>`
};

