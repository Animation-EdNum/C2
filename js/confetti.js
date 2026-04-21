function launchConfetti() {
    const cvs = document.getElementById('confetti-canvas');
    if (!cvs) return;
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
            ctx.translate(p.x + p.s / 2, p.y + p.s / 2);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
            ctx.restore();
        });
        if (alive) requestAnimationFrame(anim);
    }
    anim();
}

function launchFire() {
    const cvs = document.getElementById('confetti-canvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    let parts = [];

    // Create particles iteratively so it looks like a continuous breath over time
    let frameCount = 0;

    function createParticle() {
        // Start center top
        const startX = cvs.width / 2;
        const startY = -20;

        // Spread outwards and downwards
        const angle = (Math.random() * Math.PI / 2) + (Math.PI / 4); // Downwards cone
        const speed = Math.random() * 10 + 5;

        // Colors: white/yellow core, fading to orange, then red, then grey
        const cols = ['#fef08a', '#fde047', '#f59e0b', '#ea580c', '#dc2626', '#991b1b', '#292524'];

        parts.push({
            x: startX + (Math.random() - 0.5) * 40,
            y: startY,
            vx: Math.cos(angle) * speed * 0.5,
            vy: Math.sin(angle) * speed,
            c: cols[Math.floor(Math.random() * cols.length)],
            s: Math.random() * 20 + 10,
            life: 1.0,
            decay: Math.random() * 0.015 + 0.01
        });
    }

    // Pre-seed some particles
    for (let i = 0; i < 100; i++) createParticle();

    function anim() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Keep breathing fire for ~60 frames
        if (frameCount < 60) {
            for (let i = 0; i < 15; i++) createParticle();
        }
        frameCount++;

        let alive = false;

        // Use global composite operation to make it glow like fire
        ctx.globalCompositeOperation = 'screen';

        for (let i = parts.length - 1; i >= 0; i--) {
            let p = parts[i];

            p.x += p.vx;
            p.y += p.vy;
            p.s *= 0.96; // shrink as it burns
            p.life -= p.decay;

            if (p.life > 0 && p.s > 1 && p.y < cvs.height + 50) {
                alive = true;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
                ctx.fillStyle = p.c;
                ctx.globalAlpha = p.life;
                ctx.fill();
            } else {
                parts.splice(i, 1);
            }
        }

        // Reset composite for standard things
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;

        if (alive) {
            requestAnimationFrame(anim);
        } else {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
        }
    }
    anim();
}
