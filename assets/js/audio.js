/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * Gestion centralisée de l'audio (Web Audio API) pour la suite C2
 */
let audioCtx = null;
let isMuted = localStorage.getItem('c2_audio_muted') === 'false' ? false : true;

function tone(waveType, freq, gain, start, duration, freqEnd) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = waveType;
    o.frequency.setValueAtTime(freq, start);
    if (freqEnd) {
        o.frequency.exponentialRampToValueAtTime(freqEnd, start + duration);
    }
    g.gain.setValueAtTime(gain, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    o.start(start); o.stop(start + duration);
    return o;
}

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
        tone('square', 600, 0.04, t, 0.04);
    } else if (type === 'success') {
        [523.25, 659.25, 783.99].forEach((f, i) => tone('sine', f, 0.15, t + i * 0.12, 0.3));
    } else if (type === 'tick') {
        tone('square', 600, 0.05, t, 0.05, 800);
    } else if (type === 'ding') {
        const o = tone('sine', 523.25, 0.2, t, 0.8);
        o.frequency.setValueAtTime(659.25, t + 0.1);
    } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => tone('sine', f, 0.15, t + i * 0.12, 0.4));
    } else if (type === 'error') {
        tone('sawtooth', 300, 0.1, t, 0.25, 150);
    }
}

function updateAudioUI() {
    const iconOn = document.getElementById('icon-vol-on');
    const iconOff = document.getElementById('icon-vol-off');
    if (iconOn) iconOn.style.display = isMuted ? 'block' : 'none';
    if (iconOff) iconOff.style.display = isMuted ? 'none' : 'block';

    const audioText = document.getElementById('audioToggleText');
    if (audioText) {
        audioText.textContent = isMuted ? 'Activer son' : 'Couper son';
    }
}

function toggleAudio() {
    isMuted = !isMuted;
    localStorage.setItem('c2_audio_muted', isMuted);
    updateAudioUI();
}

document.addEventListener('DOMContentLoaded', () => {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
        audioBtn.addEventListener('click', toggleAudio);
        updateAudioUI();
    }
});
