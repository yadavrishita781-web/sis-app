import { useEffect, useRef } from 'react';

export default function DarkVeil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let t = 0;

    const render = () => {
      t += 0.004; // Smooth, cinematic slow drift
      ctx.clearRect(0, 0, width, height);

      // 1. Pitch Black / Ultra Dark Obsidian Purple Base
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#000000');
      bgGrad.addColorStop(0.5, '#05020A');
      bgGrad.addColorStop(1, '#0A0314');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Heavy Ambient Deep Purple Radial Glows (Background Depth)
      const cx1 = width * 0.5 + Math.sin(t * 0.7) * (width * 0.15);
      const cy1 = height * 0.4 + Math.cos(t * 0.5) * (height * 0.15);
      const radGlow1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, Math.max(width, height) * 0.6);
      radGlow1.addColorStop(0, 'rgba(124, 58, 237, 0.35)');
      radGlow1.addColorStop(0.4, 'rgba(88, 28, 135, 0.18)');
      radGlow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGlow1;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Soft Blurred Luminous Organic Purple/Violet Light Ribbons
      ctx.globalCompositeOperation = 'screen';

      const drawRibbon = (
        baseY: number,
        amplitude: number,
        freq: number,
        speed: number,
        thickness: number,
        colorCore: string,
        colorGlow: string,
        alpha: number
      ) => {
        ctx.beginPath();
        const steps = Math.ceil(width / 8);

        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * width;
          const y =
            baseY +
            Math.sin(x * freq + t * speed) * amplitude +
            Math.cos(x * freq * 1.5 + t * speed * 0.8) * (amplitude * 0.6);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Draw thick outer soft glow stroke
        ctx.strokeStyle = colorGlow;
        ctx.lineWidth = thickness * 3;
        ctx.shadowColor = colorCore;
        ctx.shadowBlur = 80;
        ctx.globalAlpha = alpha * 0.6;
        ctx.stroke();

        // Draw vibrant core light ribbon
        ctx.strokeStyle = colorCore;
        ctx.lineWidth = thickness;
        ctx.shadowBlur = 40;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      };

      // Large Scale Soft Blurred Violet Ribbons
      drawRibbon(
        height * 0.3,
        90,
        0.0018,
        0.9,
        45,
        'rgba(168, 85, 247, 0.45)', // Vivid Violet #A855F7
        'rgba(124, 58, 237, 0.25)', // Purple #7C3AED
        0.7
      );

      drawRibbon(
        height * 0.52,
        120,
        0.0012,
        0.7,
        65,
        'rgba(192, 132, 252, 0.50)', // Light Purple Glow #C084FC
        'rgba(147, 51, 234, 0.30)',  // Deep Purple #9333EA
        0.8
      );

      drawRibbon(
        height * 0.7,
        100,
        0.0015,
        1.1,
        50,
        'rgba(147, 51, 234, 0.40)', // Purple Core
        'rgba(88, 28, 135, 0.25)',  // Ultra Deep Purple #581C87
        0.65
      );

      // Reset composite operation & shadows
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';

      // 4. Subtle Top/Bottom Edge Vignette for Cinematic Look
      const vigGrad = ctx.createLinearGradient(0, 0, 0, height);
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      vigGrad.addColorStop(0.2, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
