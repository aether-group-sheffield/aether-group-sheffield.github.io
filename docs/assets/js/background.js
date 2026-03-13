const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let W = 0, H = 0, DPR = 1;
function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = Math.floor(innerWidth * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener('resize', resize);
resize();

// Create a bunch of circles with random positions and velocities
const N = 300;
const circles = Array.from({ length: N }, () => {
    const r = 1;
    const speed = 30 + Math.random() * 60; // px per second
    const angle = Math.random() * Math.PI * 2;
    return {
        x: Math.random() * (W / DPR),
        y: Math.random() * (H / DPR),
        r,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() < 0.5 ? 'rgba(130,209,255,0.9)' : 'rgba(193,255,130,0.9)'
    };
});

function step(dt) {
    const Wcss = W / DPR, Hcss = H / DPR;
    for (const c of circles) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;

        // Bounce on walls
        if (c.x < c.r) { c.x = c.r; c.vx *= -1; }
        if (c.x > Wcss - c.r) { c.x = Wcss - c.r; c.vx *= -1; }
        if (c.y < c.r) { c.y = c.r; c.vy *= -1; }
        if (c.y > Hcss - c.r) { c.y = Hcss - c.r; c.vy *= -1; }
    }
}

function draw() {
    // Clear with slight alpha for a soft trail effect; use 1.0 for hard clear
    ctx.fillStyle = 'rgba(11, 77, 11, 0.35)';
    ctx.fillRect(0, 0, W, H);

    for (const c of circles) {
        // outer glow
        ctx.beginPath();
        ctx.fillStyle = c.color.replace('0.9', '0.10');
        ctx.arc(c.x, c.y, c.r * 1.1, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.beginPath();
        //ctx.fillStyle = c.color;
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

let last = performance.now();
function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); // clamp dt for stability
    last = now;
    step(dt);
    draw();
    requestAnimationFrame(loop);
}
loop(performance.now());