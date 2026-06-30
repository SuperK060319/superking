const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");
let stars = [];
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
let comets = [];

function resetStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(180, Math.floor(window.innerWidth / 7)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.35,
    a: Math.random() * 0.7 + 0.25,
    s: Math.random() * 0.18 + 0.03,
    phase: Math.random() * Math.PI * 2
  }));
}

function draw(t) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    star.y += star.s;
    star.x += Math.sin((t / 6000) + star.phase) * 0.035;
    if (star.y > window.innerHeight + 10) star.y = -10;
    const pulse = 0.35 + Math.sin((t / 1100) + star.phase) * 0.25;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.15, star.a + pulse * 0.25)})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (pointer.active) {
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 180);
    glow.addColorStop(0, "rgba(240,193,90,.18)");
    glow.addColorStop(0.36, "rgba(111,159,216,.08)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(pointer.x - 180, pointer.y - 180, 360, 360);
  }

  comets = comets.filter((comet) => comet.life > 0);
  for (const comet of comets) {
    comet.x += comet.vx;
    comet.y += comet.vy;
    comet.life -= 1;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(240,193,90,${comet.life / comet.maxLife})`;
    ctx.lineWidth = comet.width;
    ctx.moveTo(comet.x, comet.y);
    ctx.lineTo(comet.x - comet.vx * 10, comet.y - comet.vy * 10);
    ctx.stroke();
  }
  requestAnimationFrame(draw);
}

resetStars();
requestAnimationFrame(draw);
window.addEventListener("resize", resetStars);

function installPointerEffects() {
  if (!document.body.classList.contains("fusion-body")) return;

  const aura = document.createElement("div");
  const core = document.createElement("div");
  aura.className = "cursor-aura";
  core.className = "cursor-core";
  document.body.append(aura, core);

  let trailTick = 0;

  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
    aura.style.left = `${event.clientX}px`;
    aura.style.top = `${event.clientY}px`;
    core.style.left = `${event.clientX}px`;
    core.style.top = `${event.clientY}px`;

    trailTick += 1;
    if (trailTick % 3 === 0) {
      const trail = document.createElement("span");
      trail.className = "trail";
      trail.style.left = `${event.clientX}px`;
      trail.style.top = `${event.clientY}px`;
      document.body.appendChild(trail);
      trail.addEventListener("animationend", () => trail.remove());
    }
  });

  window.addEventListener("pointerdown", (event) => {
    for (let i = 0; i < 18; i += 1) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 18;
      const distance = 42 + Math.random() * 54;
      spark.className = "spark";
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
      document.body.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove());
    }
  });

  window.addEventListener("wheel", (event) => {
    const direction = event.deltaY > 0 ? 1 : -1;
    for (let i = 0; i < 8; i += 1) {
      comets.push({
        x: pointer.x + (Math.random() - 0.5) * 120,
        y: pointer.y + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 2.2,
        vy: direction * (2.8 + Math.random() * 2.6),
        width: 1 + Math.random() * 1.4,
        life: 34,
        maxLife: 34
      });
    }
  }, { passive: true });
}

installPointerEffects();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.animate([
      { opacity: 0, transform: "translateY(18px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" });
  });
}, { threshold: 0.16 });

document.querySelectorAll(".demo, .arch-item").forEach((el) => observer.observe(el));
