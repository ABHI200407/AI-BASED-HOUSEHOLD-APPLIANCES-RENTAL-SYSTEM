import React from 'react';
import './ItemInspector.css';

export default function ItemInspector({ sketchfabId = 'c7b7999b5c3d425bae23e74b669e97d6' }) {
  // We use the Victorian Lounge Sofa as the default if no ID is provided
  const embedUrl = `https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=1&ui_watermark_link=0`;

  return (
    <div style={{ width: '100%', height: '500px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid var(--rv-color-border)' }}>
      <iframe 
        title="Sketchfab 3D Viewer" 
        frameBorder="0" 
        allowFullScreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking="true" 
        execution-while-out-of-viewport="true" 
        execution-while-not-rendered="true" 
        web-share="true" 
        src={embedUrl}
        style={{ width: '100%', height: '100%' }}
      >
      </iframe>
    </div>
  );
}
