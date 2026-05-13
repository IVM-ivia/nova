'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  a: number;
}

export default function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, pts: Particle[] = [];
    let mx = 0, my = 0;
    let rafId: number;

    function resize() {
      W = cvs!.width = window.innerWidth;
      H = cvs!.height = window.innerHeight;
    }

    function init() {
      pts = [];
      const n = Math.floor((W * H) / 16000);
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1, 0, 6.28);
        ctx!.fillStyle = `rgba(0,217,255,${p.a})`;
        ctx!.fill();
      }
      const D = 130;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < D) {
            ctx!.beginPath();
            ctx!.moveTo(pts[i].x, pts[i].y);
            ctx!.lineTo(pts[j].x, pts[j].y);
            ctx!.strokeStyle = `rgba(0,217,255,${(1 - d / D) * 0.12})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(mx, my);
          ctx!.strokeStyle = `rgba(139,92,246,${(1 - d / 160) * 0.3})`;
          ctx!.lineWidth = 0.7;
          ctx!.stroke();
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onResize = () => { resize(); init(); };

    resize();
    init();
    draw();

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
