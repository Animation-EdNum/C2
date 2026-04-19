/**
 * confetti.js — Moteur de confettis partagé
 *
 * Usage : Appeler launchConfetti()
 * Nécessite un <canvas id="confetti-canvas"></canvas> dans le HTML, ou il sera créé dynamiquement.
 */
function launchConfetti() {
    let cvs = document.getElementById('confetti-canvas');
    if (!cvs) {
        cvs = document.createElement('canvas');
        cvs.id = 'confetti-canvas';
        cvs.style.position = 'fixed';
        cvs.style.top = '0';
        cvs.style.left = '0';
        cvs.style.width = '100%';
        cvs.style.height = '100%';
        cvs.style.pointerEvents = 'none';
        cvs.style.zIndex = '9999';
        document.body.appendChild(cvs);
    }
    const ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    let parts = [];
    let cols = ['#667eea', '#4caf50', '#ff9800', '#e91e63', '#d946ef'];
    for (let i = 0; i < 80; i++) {
        parts.push({
            x: Math.random() * cvs.width,
            y: -50,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 4 + 2,
            c: cols[Math.floor(Math.random() * cols.length)],
            s: Math.random() * 6 + 3,
            rot: 0,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }
    function anim() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        let alive = false;
        parts.forEach(p => {
            if (p.y > cvs.height) return;
            alive = true;
            p.x += p.vx;
            p.vy += 0.1;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
            ctx.restore();
        });
        if (alive) requestAnimationFrame(anim);
        else ctx.clearRect(0, 0, cvs.width, cvs.height);
    }
    anim();
}
