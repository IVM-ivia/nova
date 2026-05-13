'use client';

import { useEffect } from 'react';

export default function MagneticCursor() {
  useEffect(() => {
    // Create cursor elements
    const ring = document.createElement('div');
    ring.id = 'cursorRing';
    const dot = document.createElement('div');
    dot.id = 'cursorDot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let cx = 0, cy = 0, rx = 0, ry = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
    };

    const loop = () => {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      dot.style.transform  = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener('mousemove', onMove);

    const TARGETS = 'button,.btn,.nav-item,.tool-link,.opt,.svc-card,.lang-btn,a,input,textarea';

    const addHover = () => {
      document.querySelectorAll(TARGETS).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          ring.classList.add('cursor-hover');
          dot.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('cursor-hover');
          dot.classList.remove('cursor-hover');
        });
      });
    };
    addHover();

    // Re-attach on DOM changes (SPA navigation)
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousedown', () => ring.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('cursor-click'));

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
      ring.remove();
      dot.remove();
    };
  }, []);

  return null;
}
