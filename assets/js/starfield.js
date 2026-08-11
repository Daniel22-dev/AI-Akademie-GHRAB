export function startStarfield(canvas) {
  if (!canvas) return () => {};
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return () => {};

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let frame = 0;
  let raf = 0;
  let stars = [];

  const makeStars = () => {
    const count = Math.min(190, Math.max(65, Math.floor((width * height) / 10500)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.35 + 0.2,
      speed: Math.random() * 0.09 + 0.015,
      alpha: Math.random() * 0.55 + 0.2,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    frame += 1;
    for (const star of stars) {
      if (!reduceMotion) {
        star.y += star.speed;
        if (star.y > height + 4) {
          star.y = -4;
          star.x = Math.random() * width;
        }
      }
      const twinkle = reduceMotion ? 1 : 0.72 + Math.sin(frame * 0.018 + star.phase) * 0.28;
      context.beginPath();
      context.fillStyle = `rgba(185, 228, 255, ${star.alpha * twinkle})`;
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }
    raf = requestAnimationFrame(draw);
  };

  resize();
  addEventListener('resize', resize, { passive: true });
  draw();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
  };
}
