/**
 * Gestion centralisée de l'audio (Web Audio API) pour la suite C2
 */
let audioCtx = null;
let isMuted = true;

function playSound(type) {
    if (isMuted) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    if (type === 'click') {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = 'square';
        o.frequency.setValueAtTime(600, t);
        g.gain.setValueAtTime(0.04, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        o.start(); o.stop(t + 0.04);
    } else if (type === 'success') {
        [523.25, 659.25, 783.99].forEach((f, i) => {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.connect(g); g.connect(audioCtx.destination);
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0.15, t + i * 0.12);
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.3);
            o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.3);
        });
    } else if (type === 'error') {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(300, t);
        o.frequency.exponentialRampToValueAtTime(150, t + 0.25);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(); o.stop(t + 0.25);
    }
}

function toggleAudio() {
    isMuted = !isMuted;
    const iconOn = document.getElementById('icon-vol-on');
    const iconOff = document.getElementById('icon-vol-off');
    if (iconOn) iconOn.style.display = isMuted ? 'none' : 'block';
    if (iconOff) iconOff.style.display = isMuted ? 'block' : 'none';

    const audioText = document.getElementById('audioToggleText');
    if (audioText) {
        audioText.textContent = isMuted ? 'Activer le son' : 'Couper le son';
    }
}


