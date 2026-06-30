const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");
let stars = [];

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
  requestAnimationFrame(draw);
}

resetStars();
requestAnimationFrame(draw);
window.addEventListener("resize", resetStars);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.animate([
      { opacity: 0, transform: "translateY(18px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" });
  });
}, { threshold: 0.16 });

document.querySelectorAll(".demo, .arch-item").forEach((el) => observer.observe(el));
