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
    const audioText = document.getElementById('audioToggleText');
    const audioBtn = document.getElementById('audio-toggle-btn');

    const t = (key, fallback) => (typeof window !== 'undefined' && window.I18N && typeof window.I18N.t === 'function')
        ? window.I18N.t(key, fallback)
        : fallback;

    if (audioText) {
        // Dans un menu avec libellé d'action (« Activer son » / « Couper son »), l'icône illustre l'action proposée
        if (iconOn) iconOn.style.display = isMuted ? 'block' : 'none';
        if (iconOff) iconOff.style.display = isMuted ? 'none' : 'block';
        audioText.textContent = isMuted
            ? t('common.audio_on', 'Activer son')
            : t('common.audio_off', 'Couper son');
    } else {
        // Bouton icône seule (ex. barre d'outils) : reflète l'état réel (muet = haut-parleur barré)
        if (iconOn) iconOn.style.display = isMuted ? 'none' : 'block';
        if (iconOff) iconOff.style.display = isMuted ? 'block' : 'none';
        if (audioBtn) {
            const label = isMuted
                ? t('common.audio_on', 'Activer le son')
                : t('common.audio_off', 'Couper le son');
            audioBtn.title = label;
            audioBtn.setAttribute('aria-label', label);
        }
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
