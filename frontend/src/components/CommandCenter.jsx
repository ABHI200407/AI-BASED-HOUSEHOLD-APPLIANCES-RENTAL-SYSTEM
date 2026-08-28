import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * CommandCenter – a lightweight command palette & global search overlay.
 *
 * Features
 *  - Press "/" (forward slash) anywhere to open the search input.
 *  - Press "Ctrl+K" (or "⌘+K" on mac) to toggle the palette.
 *  - Supports a few built‑in shortcuts (e.g., "g h" → go home, "g c" → catalog).
 *  - Keyboard navigation: ArrowUp/ArrowDown to move, Enter to activate.
 *  - Click outside or press Escape / X button to close.
 *  - Uses `framer-motion` for smooth fade‑in/out and scale animation.
 *  - The component is injected at the top level via `main.jsx` – it does not interfere
 *    with existing layout and respects the current theme (including cyberpunk mode).
 */
const shortcuts = [
  { keys: '/', description: 'Focus search', action: () => {} },
  { keys: 'g h', description: 'Go to Home', action: (nav) => nav('/') },
  { keys: 'g c', description: 'Go to Catalog', action: (nav) => nav('/catalog') },
  { keys: 'g a', description: 'Go to Add Appliance', action: (nav) => nav('/owner/add-appliance') },
  { keys: 'g d', description: 'Owner Dashboard', action: (nav) => nav('/owner') },
  { keys: 'g c f', description: 'Category: Furniture', action: (nav) => nav('/category/furniture') },
  { keys: 'g c a', description: 'Category: Appliances', action: (nav) => nav('/category/appliances') },
  { keys: 'g c p', description: 'Category: Packages', action: (nav) => nav('/category/packages') },
  { keys: 'g i', description: 'Installations', action: (nav) => nav('/installations') },
  { keys: 'g s', description: 'Toggle Spatial View (Infinite Canvas)', action: (nav) => nav('/spatial-view') },
  { keys: 'g w', description: 'AI Workspace (Next-Gen Concept)', action: (nav) => nav('/ai-workspace') },
];

export default function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Open on shortcut keys
  useEffect(() => {
    const handler = (e) => {
      // Ignore when typing in an input/textarea/select
      const tag = e.target.tagName.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;

      // '/' key opens the overlay (but not when shift is pressed)
      if (e.key === '/' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      // Ctrl/Cmd + K toggles
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus the input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const filtered = shortcuts.filter((s) =>
    s.keys.includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    setOpen(false);
    setQuery('');
    // Execute the navigation/action
    if (item.action.length === 0) {
      // Special case for '/' – focus input (already handled)
    } else {
      item.action(navigate);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIdx]) handleSelect(filtered[activeIdx]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-center-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={backdropStyle}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="command-center-panel"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={panelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={headerStyle}>
              <Search size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={handleKeyDown}
                style={inputStyle}
              />
              <button onClick={() => setOpen(false)} style={closeBtnStyle} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <ul style={listStyle}>
              {filtered.length === 0 && (
                <li style={noResultStyle}>No commands match "{query}".</li>
              )}
              {filtered.map((item, idx) => (
                <li
                  key={item.keys}
                  onClick={() => handleSelect(item)}
                  style={idx === activeIdx ? activeItemStyle : itemStyle}
                >
                  <span style={keysStyle}>{item.keys}</span>
                  <span style={descStyle}>{item.description}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Inline styles – keeping them simple to avoid extra CSS files.
const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const panelStyle = {
  background: 'var(--bg, #fff)',
  borderRadius: 'var(--radius-lg, 12px)',
  width: 'min(600px, 90vw)',
  maxHeight: '80vh',
  boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.2))',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--border-muted, #e2e8f0)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid var(--border-muted, #e2e8f0)',
  gap: '0.5rem',
};

const inputStyle = {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '1rem',
  color: 'var(--text, #111)',
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted, #666)',
};

const listStyle = {
  listStyle: 'none',
  margin: 0,
  padding: '0.5rem 0',
  overflowY: 'auto',
};

const itemStyle = {
  padding: '0.5rem 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
};

const activeItemStyle = {
  ...itemStyle,
  background: 'var(--accent-gradient, #e0e7ff)',
  color: 'var(--text-inverse, #fff)',
};

const keysStyle = {
  fontFamily: 'monospace',
  opacity: 0.8,
};

const descStyle = {
  marginLeft: '1rem',
  flexGrow: 1,
};

const noResultStyle = {
  padding: '0.75rem 1rem',
  color: 'var(--text-muted, #666)',
  fontStyle: 'italic',
};
