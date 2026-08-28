import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function Magnetic({ children, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform([x, y], ([xVal, yVal]) => (xVal + yVal) * 0.02);
  const rafId = useRef(null);

  const handleMove = useCallback((e) => {
    if (rafId.current) return; // Already scheduled
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.1);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.1);
    });
  }, [x, y]);

  const handleLeave = useCallback(() => {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y, rotate, originX: 0.5, originY: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
