import React, { useEffect, useRef } from 'react';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();
// Cache results by URL so we never process the same image twice
const colorCache = new Map();

export default function DynamicThemeWrapper({ children, imageUrl, className }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;
    let cancelled = false;

    const apply = (hex, rgba) => {
      if (cancelled || !wrapperRef.current) return;
      wrapperRef.current.style.setProperty('--theme-glow', hex);
      wrapperRef.current.style.setProperty('--theme-bg', rgba);
    };

    if (colorCache.has(imageUrl)) {
      const { hex, rgba } = colorCache.get(imageUrl);
      apply(hex, rgba);
      return;
    }

    fac.getColorAsync(imageUrl)
      .then(color => {
        colorCache.set(imageUrl, { hex: color.hex, rgba: color.rgba });
        apply(color.hex, color.rgba);
      })
      .catch(() => {/* ignore cross-origin errors */});

    return () => { cancelled = true; };
  }, [imageUrl]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
