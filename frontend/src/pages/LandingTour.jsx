import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, MoveUpRight, Play, Sparkles, Star } from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const CHAPTERS = [
  { n: '01', label: 'Arrive Ready',   sub: 'Your first day in a new city should feel like home, not a showroom floor.' },
  { n: '02', label: 'Curate Freely',  sub: 'Choose what you love, swap what you outgrow. No questions, no penalty.' },
  { n: '03', label: 'Live Lightly',   sub: 'Modern furniture. Latest appliances. Zero long-term commitment.' },
  { n: '04', label: 'Upgrade Always', sub: 'New launch drops every week. Your home can keep pace with your life.' },
];

const STATS = [
  { value: '12,000+', label: 'Homes made ready' },
  { value: '24 hr',   label: 'Avg. delivery' },
  { value: '98%',     label: 'Satisfaction rate' },
  { value: '40+',     label: 'Indian cities' },
];

const SCENES = [
  {
    bg: '/images/hero_smart_living_1787992393083.jpg',
    eyebrow: 'Chapter I — Arrive Ready',
    title: 'Make the move.\nLeave the heavy lifting.',
    body: 'We deliver, assemble, and style your entire home while you focus on what actually matters — settling in.',
    link: '/catalog',
    cta: 'Browse appliances',
    accent: 'rgba(92, 69, 253, 0.55)',
  },
  {
    bg: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg',
    eyebrow: 'Chapter II — Curate Freely',
    title: 'Your space,\nyour rules.',
    body: 'Swap, upgrade, or return any item at any time. Rentova is built around the way modern life actually works.',
    link: '/room-configurator',
    cta: '3D room planner',
    accent: 'rgba(16, 185, 129, 0.45)',
  },
  {
    bg: '/images/curate_space_1787992412507.jpg',
    eyebrow: 'Chapter III — Live Lightly',
    title: 'Premium gear.\nZero clutter.',
    body: 'From 1-month stays to 3-year leases — the same great furniture, priced around your timeline.',
    link: '/packages',
    cta: 'See packages',
    accent: 'rgba(245, 158, 11, 0.42)',
  },
  {
    bg: '/images/seamless_upgrades_1787992425854.jpg',
    eyebrow: 'Chapter IV — Upgrade Always',
    title: 'New drops\nevery week.',
    body: 'Curated by designers, delivered by us. Your home never has to fall behind the times.',
    link: '/inspiration',
    cta: 'Get inspired',
    accent: 'rgba(239, 68, 68, 0.42)',
  },
];

const CARDS = [
  {
    img: '/downloaded_images/appliances/tv/tv_001_pid5202925.jpg',
    title: 'Smart TVs',
    n: '74+ models',
    tag: '4K · OLED · QLED',
    link: '/catalog?category=tv',
  },
  {
    img: '/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg',
    title: 'Refrigerators',
    n: '58+ models',
    tag: 'Single · Double door',
    link: '/catalog?category=refrigerator',
  },
  {
    img: '/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg',
    title: 'Washing Machines',
    n: '42+ models',
    tag: 'Front · Top load',
    link: '/catalog?category=washing-machine',
  },
];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <svg aria-hidden="true" style={{
      position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none',
      opacity: 0.04, mixBlendMode: 'overlay', width: '100%', height: '100%',
    }}>
      <filter id="rvgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#rvgrain)" />
    </svg>
  );
}

function RevealText({ children, delay = 0, tag: Tag = 'span' }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ display: 'block' }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function LandingTour() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [navStuck, setNavStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloaded, setPreloaded] = useState(false);
  const [preloadPct, setPreloadPct] = useState(0);
  const [cursorActive, setCursorActive] = useState(false);
  const cursorRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  /* cursor ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const move = (e) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  /* preloader ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    let pct = 0;
    const id = setInterval(() => {
      pct += Math.random() * 22;
      if (pct >= 100) { pct = 100; clearInterval(id); setTimeout(() => setPreloaded(true), 420); }
      setPreloadPct(Math.min(Math.round(pct), 100));
    }, 120);
    return () => clearInterval(id);
  }, []);

  /* nav hide-on-scroll ──────────────────────────────────────────────────────── */
  useEffect(() => {
    let lastY = 0;
    const unsub = scrollYProgress.on('change', (v) => {
      const total = containerRef.current?.scrollHeight || 1;
      const curY = v * total;
      setNavStuck(curY > 80);
      lastY = curY;
    });
    return unsub;
  }, [scrollYProgress]);

  /* active chapter ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(Math.floor(v * SCENES.length), SCENES.length - 1);
      setActiveChapter(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  /* scene transforms (4 scenes across 0→1) — must NOT be inside .map() ───── */
  const seg = 1 / SCENES.length;

  const op0 = useTransform(scrollYProgress, [0*seg - seg*0.14, 0*seg, 1*seg - seg*0.14, 1*seg], [0,1,1,0]);
  const op1 = useTransform(scrollYProgress, [1*seg - seg*0.14, 1*seg, 2*seg - seg*0.14, 2*seg], [0,1,1,0]);
  const op2 = useTransform(scrollYProgress, [2*seg - seg*0.14, 2*seg, 3*seg - seg*0.14, 3*seg], [0,1,1,0]);
  const op3 = useTransform(scrollYProgress, [3*seg - seg*0.14, 3*seg, 4*seg - seg*0.14, 4*seg], [0,1,1,0]);
  const sceneOpacities = [op0, op1, op2, op3];

  const sc0 = useTransform(scrollYProgress, [0*seg, 1*seg], [1, 1.07]);
  const sc1 = useTransform(scrollYProgress, [1*seg, 2*seg], [1, 1.07]);
  const sc2 = useTransform(scrollYProgress, [2*seg, 3*seg], [1, 1.07]);
  const sc3 = useTransform(scrollYProgress, [3*seg, 4*seg], [1, 1.07]);
  const sceneScales = [sc0, sc1, sc2, sc3];

  const ty0 = useTransform(scrollYProgress, [0*seg, 1*seg], [0, -60]);
  const ty1 = useTransform(scrollYProgress, [1*seg, 2*seg], [0, -60]);
  const ty2 = useTransform(scrollYProgress, [2*seg, 3*seg], [0, -60]);
  const ty3 = useTransform(scrollYProgress, [3*seg, 4*seg], [0, -60]);
  const textYs = [ty0, ty1, ty2, ty3];

  // Chapter index opacity (fades out as user scrolls past first section)
  const chapterIndexOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  /* ── render ──────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
          width: 26, height: 26, marginTop: -13, marginLeft: -13,
          borderRadius: '50%', border: '1px solid rgba(92,69,253,0.55)',
          transition: 'width .35s, height .35s, background .35s, border-color .35s',
          ...(cursorActive ? { width: 52, height: 52, marginTop: -26, marginLeft: -26, background: 'rgba(92,69,253,0.08)', borderColor: 'rgba(92,69,253,0.8)' } : {}),
          mixBlendMode: 'difference',
        }}
      />

      {/* Preloader */}
      <AnimatePresence>
        {!preloaded && (
          <motion.div
            exit={{ opacity: 0, visibility: 'hidden' }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200, background: '#05070a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', width: 'min(420px,74vw)' }}>
              {/* Brand mark */}
              <svg width="44" height="44" viewBox="0 0 44 44" style={{ margin: '0 auto 26px', opacity: 0.9 }}>
                <rect width="44" height="44" rx="10" fill="#0f1720"/>
                <rect x="6" y="6" width="32" height="32" rx="6" fill="none" stroke="#5c45fd" strokeWidth="1.5"/>
                <path d="M14 22h16M14 16h16M14 28h10" stroke="#dfe7e0" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: 12, letterSpacing: '0.5em', color: 'rgba(223,231,224,0.5)', marginBottom: 20 }}>RENTOVA</p>
              <div style={{ height: 1, background: 'rgba(223,231,224,0.14)', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  style={{ position: 'absolute', inset: '0 auto 0 0', background: '#5c45fd', width: `${preloadPct}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)' }}>
                <span>Loading experience</span>
                <b style={{ color: 'rgba(223,231,224,0.7)', fontVariantNumeric: 'tabular-nums' }}>{preloadPct}%</b>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GrainOverlay />

      {/* Vignette */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 55, pointerEvents: 'none',
        background: 'radial-gradient(125% 95% at 50% 42%, transparent 40%, rgba(2,4,6,.5) 100%)',
      }} />

      {/* Progress rail */}
      <nav aria-label="Chapter navigation" style={{
        position: 'fixed', right: 'clamp(20px,3.4vw,56px)', top: '50%', transform: 'translateY(-50%)',
        zIndex: 45, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
      }}>
        {CHAPTERS.map((ch, i) => (
          <button
            key={i}
            aria-label={ch.label}
            onClick={() => {
              const el = containerRef.current;
              if (!el) return;
              const target = (i / SCENES.length) * el.scrollHeight;
              window.scrollTo({ top: el.offsetTop + target, behavior: 'smooth' });
            }}
            style={{
              width: 22, height: 10, background: 'none', border: 0, cursor: 'pointer',
              display: 'grid', placeItems: 'center',
            }}
            onMouseEnter={() => setCursorActive(true)}
            onMouseLeave={() => setCursorActive(false)}
          >
            <span style={{
              display: 'block',
              width: activeChapter === i ? 22 : 14,
              height: 1,
              background: activeChapter === i ? '#dfe7e0' : 'rgba(223,231,224,0.26)',
              transition: 'width .5s cubic-bezier(.16,1,.3,1), background .5s',
            }} />
          </button>
        ))}
      </nav>

      {/* Top nav bar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: 84, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 24,
        padding: '0 clamp(20px,3.4vw,56px)',
        transition: 'transform .55s cubic-bezier(.22,.61,.36,1)',
      }}>
        {/* backdrop */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none',
          background: 'rgba(5,7,10,.62)', 
          opacity: navStuck ? 1 : 0, transition: 'opacity .5s',
        }} />
        <div style={{
          position: 'absolute', left: 'clamp(20px,3.4vw,56px)', right: 'clamp(20px,3.4vw,56px)',
          bottom: 0, height: 1, background: 'rgba(223,231,224,0.07)',
          opacity: navStuck ? 1 : 0, transition: 'opacity .5s',
        }} />

        {/* Brand */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flex: '0 0 auto', textDecoration: 'none' }}>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <rect width="34" height="34" rx="8" fill="#0f1720"/>
            <rect x="4" y="4" width="26" height="26" rx="5" fill="none" stroke="#5c45fd" strokeWidth="1.2"/>
            <path d="M9 17h16M9 12h16M9 22h10" stroke="#dfe7e0" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
            <b style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', color: '#dfe7e0', fontFamily: 'Manrope, sans-serif' }}>RENTOVA</b>
            <i style={{ fontStyle: 'normal', fontSize: 8, letterSpacing: '0.3em', color: 'rgba(223,231,224,0.45)', fontFamily: 'Manrope, sans-serif' }}>SMART HOME RENTALS</i>
          </div>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 'clamp(18px,2.6vw,46px)', marginLeft: 'auto' }}>
          {[['Catalog', '/catalog'], ['Packages', '/packages'], ['Financials', '/financials'], ['Inspiration', '/inspiration']].map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{
                position: 'relative', fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'rgba(223,231,224,0.6)', height: 15,
                lineHeight: '15px', overflow: 'hidden', display: 'block',
                fontFamily: 'Manrope, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#dfe7e0'; setCursorActive(true); }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(223,231,224,0.6)'; setCursorActive(false); }}
            >
              {label}
            </a>
          ))}
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            marginLeft: 'clamp(18px,2.6vw,42px)',
            padding: '10px 22px',
            border: '1px solid rgba(223,231,224,0.2)',
            borderRadius: 100,
            fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#dfe7e0', background: 'none', fontFamily: 'Manrope, sans-serif',
            transition: 'background .4s, border-color .4s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dfe7e0'; e.currentTarget.style.color = '#05070a'; setCursorActive(true); }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#dfe7e0'; setCursorActive(false); }}
        >
          Sign In
        </button>
      </header>

      {/* ── SCROLL CONTAINER ─────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ position: 'relative', height: `${SCENES.length * 100}vh`, background: '#05070a' }}
      >
        {/* Sticky scene stack */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* All 4 scene layers */}
          {SCENES.map((scene, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute', inset: 0,
                opacity: sceneOpacities[i],
                scale: sceneScales[i],
                backgroundImage: `url('${scene.bg}')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            >
              {/* Top scrim */}
              <div style={{
                position: 'absolute', left: 0, right: 0, top: 0, height: '46%', pointerEvents: 'none',
                background: 'linear-gradient(rgba(3,6,9,.75), rgba(3,6,9,.36) 46%, transparent)',
              }} />

              {/* Radial text scrim */}
              <div style={{
                position: 'absolute', inset: '-22% -4%', zIndex: 1, pointerEvents: 'none',
                background: `radial-gradient(110% 62% at 28% 55%, rgba(4,7,10,.88), rgba(4,7,10,.6) 42%, rgba(4,7,10,.18) 74%, rgba(4,7,10,0))`,
                maskImage: 'linear-gradient(transparent, #000 38%)',
                WebkitMaskImage: 'linear-gradient(transparent, #000 38%)',
              }} />

              {/* Accent color tint */}
              <div style={{
                position: 'absolute', inset: 0, background: scene.accent,
                mixBlendMode: 'color', pointerEvents: 'none', zIndex: 2, opacity: 0.35,
              }} />

              {/* Copy block */}
              <motion.div style={{
                position: 'absolute', bottom: '14%', left: 'clamp(20px,3.4vw,56px)',
                maxWidth: 'min(640px, 52vw)', zIndex: 10, y: textYs[i],
              }}>
                {/* Eyebrow */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(223,231,224,0.55)',
                  fontFamily: 'Manrope, sans-serif',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5c45fd', boxShadow: '0 0 10px #5c45fd', flexShrink: 0 }} />
                  {scene.eyebrow}
                </div>

                {/* Heading */}
                <h2 style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 'clamp(28px, 3.1vw, 52px)',
                  fontWeight: 400,
                  lineHeight: 1.055,
                  letterSpacing: '-0.012em',
                  color: '#dfe7e0',
                  textShadow: '0 2px 34px rgba(3,6,8,.72)',
                  margin: '0 0 18px',
                  textTransform: 'uppercase',
                  whiteSpace: 'pre-line',
                }}>
                  {scene.title}
                </h2>

                {/* Body */}
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'clamp(14px,1.02vw,17px)',
                  lineHeight: 1.72,
                  color: '#b4bfb7',
                  fontWeight: 300,
                  textShadow: '0 1px 20px rgba(3,6,8,.88)',
                  maxWidth: '44ch',
                  marginBottom: 32,
                }}>
                  {scene.body}
                </p>

                {/* CTA */}
                <a
                  href={scene.link}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 12,
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: '#dfe7e0',
                    fontFamily: 'Manrope, sans-serif',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={() => setCursorActive(true)}
                  onMouseLeave={() => setCursorActive(false)}
                >
                  {scene.cta}
                  <span style={{
                    width: 34, height: 34, border: '1px solid rgba(223,231,224,0.26)',
                    borderRadius: '50%', display: 'grid', placeItems: 'center',
                    transition: 'background .45s, border-color .45s',
                  }}>
                    <MoveUpRight size={13} />
                  </span>
                </a>
              </motion.div>
            </motion.div>
          ))}

          {/* ── Hero chapter index (bottom bar, visible on scene 0) ────────── */}
          <motion.div style={{
            position: 'absolute', bottom: 'clamp(22px,4.2vh,42px)',
            left: 'clamp(20px,3.4vw,56px)', right: 'clamp(20px,3.4vw,56px)',
            zIndex: 20, opacity: chapterIndexOpacity,
          }}>
            {/* scroll cue */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 14, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)', fontFamily: 'Manrope,sans-serif' }}>
              Scroll to explore
              <div style={{ width: 54, height: 1, background: 'rgba(223,231,224,0.15)', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  style={{ position: 'absolute', inset: 0, background: '#dfe7e0', transformOrigin: 'left' }}
                  animate={{ scaleX: [0, 1, 1] }}
                  transition={{ duration: 2.8, ease: [0.65, 0, 0.35, 1], repeat: Infinity }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(14px,2.4vw,40px)',
              borderTop: '1px solid rgba(223,231,224,0.07)', paddingTop: 18,
            }}>
              {CHAPTERS.map((ch, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' }}
                  onMouseEnter={() => setCursorActive(true)}
                  onMouseLeave={() => setCursorActive(false)}
                  onClick={() => {
                    const el = containerRef.current;
                    if (!el) return;
                    window.scrollTo({ top: el.offsetTop + (i / SCENES.length) * el.scrollHeight, behavior: 'smooth' });
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(26px,2.5vw,36px)', fontWeight: 300, letterSpacing: '-.02em',
                    color: activeChapter === i ? '#818cf8' : '#dfe7e0',
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1, flexShrink: 0,
                    transition: 'color .4s, transform .5s',
                    transform: activeChapter === i ? 'translateY(-2px)' : 'none',
                    fontFamily: 'Fraunces,Georgia,serif',
                  }}>
                    {ch.n}
                  </span>
                  <div style={{ paddingTop: 3 }}>
                    <b style={{
                      display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '0.2em',
                      textTransform: 'uppercase', marginBottom: 6,
                      color: activeChapter === i ? '#dfe7e0' : 'rgba(223,231,224,0.55)',
                      transition: 'color .4s', fontFamily: 'Manrope,sans-serif',
                      textShadow: '0 1px 16px rgba(3,6,8,.9)',
                    }}>
                      {ch.label}
                    </b>
                    <p style={{
                      margin: 0, fontSize: 11, lineHeight: 1.5,
                      color: activeChapter === i ? 'rgba(223,231,224,0.55)' : '#4d5750',
                      maxWidth: '22ch', transition: 'color .4s',
                      fontFamily: 'Manrope,sans-serif',
                    }}>
                      {ch.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vertical Japanese-style label */}
          <div style={{
            position: 'absolute', zIndex: 20, right: 'clamp(20px,3.4vw,56px)',
            top: '50%', transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            pointerEvents: 'none',
          }}>
            <span style={{
              writingMode: 'vertical-rl', fontSize: 13, letterSpacing: '0.62em',
              color: 'rgba(223,231,224,0.3)', fontFamily: 'Manrope,sans-serif',
            }}>
              RENTOVA · 2025
            </span>
          </div>
        </div>
      </div>

      {/* ── Sub-sections container flowing after scenes ── */}
      <div style={{ position: 'relative', background: '#05070a', color: '#dfe7e0', zIndex: 10 }}>
        {/* ── Section: Gate (Story) ─────────────────────────────────────────── */}
        <section id="story" style={{
          position: 'relative', padding: 'clamp(88px,15vh,190px) clamp(20px,3.4vw,56px)',
          background: 'transparent', zIndex: 10,
        }}>
          {/* Section scrim */}
          <div style={{
            position: 'absolute', inset: '-22% -4%', zIndex: -1, pointerEvents: 'none',
            background: 'radial-gradient(110% 62% at 30% 50%, rgba(4,7,10,.88), rgba(4,7,10,.62) 42%, rgba(4,7,10,.18) 74%, rgba(4,7,10,0))',
            maskImage: 'linear-gradient(transparent, #000 44%)', WebkitMaskImage: 'linear-gradient(transparent, #000 44%)',
          }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 'clamp(30px,5vh,66px)' }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)', fontFamily: 'Manrope,sans-serif' }}>
              <b style={{ color: '#5c45fd' }}>I</b> · THE RENTOVA WAY
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(223,231,224,0.07)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.02fr) minmax(0,1fr)',
            gap: 'clamp(28px,5vw,90px)',
            alignItems: 'start',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 style={{
                fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(30px,4vw,60px)',
                fontWeight: 400, lineHeight: 1.055, letterSpacing: '-0.005em',
                color: '#dfe7e0', textShadow: '0 2px 34px rgba(3,6,8,.72)',
                maxWidth: '11ch', margin: 0, textTransform: 'uppercase',
              }}>
                Your home is not a purchase order.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              style={{ paddingTop: 6 }}
            >
              <p style={{
                fontSize: 'clamp(15px,1.16vw,19px)', lineHeight: 1.66,
                color: '#c2cdc5', textShadow: '0 1px 20px rgba(3,6,8,.9)',
                fontFamily: 'Manrope,sans-serif',
              }}>
                It's a living system. We designed Rentova around the moments that change it — a new job, a new city, a growing family, or simply the urge for more breathing room.
              </p>
              <p style={{ marginTop: 20, fontFamily: 'Manrope,sans-serif', fontSize: 14, lineHeight: 1.68, color: '#9aa5a0', textShadow: '0 1px 18px rgba(3,6,8,.85)' }}>
                We take care of delivery, assembly, maintenance, and removal. You just live.
              </p>

              <a
                href="/inspiration"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 34,
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#dfe7e0', textDecoration: 'none', fontFamily: 'Manrope,sans-serif',
                }}
              >
                Meet the movement
                <span style={{ width: 34, height: 34, border: '1px solid rgba(223,231,224,0.26)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                  <MoveUpRight size={13} />
                </span>
              </a>

              {/* Stats */}
              <div style={{
                display: 'flex', gap: 'clamp(24px,4vw,62px)', marginTop: 'clamp(46px,8vh,96px)',
                borderTop: '1px solid rgba(223,231,224,0.07)', paddingTop: 24,
              }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <b style={{ display: 'block', fontSize: 'clamp(22px,2.1vw,32px)', fontWeight: 300, letterSpacing: '-.02em', color: '#dfe7e0', fontFamily: 'Fraunces,Georgia,serif' }}>
                      {s.value}
                    </b>
                    <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)', fontFamily: 'Manrope,sans-serif' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Section: Catalog cards ────────────────────────────────────────── */}
        <section id="pathways" style={{
          position: 'relative', padding: 'clamp(88px,15vh,190px) clamp(20px,3.4vw,56px)',
          background: 'transparent', zIndex: 10,
        }}>
          <div style={{
            position: 'absolute', inset: '-22% -4%', zIndex: -1, pointerEvents: 'none',
            background: 'radial-gradient(108% 64% at 50% 50%, rgba(4,7,10,.72), rgba(4,7,10,.44) 50%, rgba(4,7,10,0))',
          }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 'clamp(30px,5vh,66px)' }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)', fontFamily: 'Manrope,sans-serif' }}>
              <b style={{ color: '#5c45fd' }}>II</b> · FEATURED CATEGORIES
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(223,231,224,0.07)' }} />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 'clamp(10px,1.4vw,22px)', alignItems: 'start',
          }}>
            {CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
                style={{
                  position: 'relative', cursor: 'pointer',
                  transform: `translateY(${i === 1 ? 'clamp(26px,5vw,74px)' : i === 2 ? 'clamp(52px,10vw,148px)' : '0'})`,
                }}
                onClick={() => navigate(card.link)}
                onMouseEnter={() => setCursorActive(true)}
                onMouseLeave={() => setCursorActive(false)}
              >
                {/* Frame */}
                <div style={{
                  position: 'relative', aspectRatio: '4/5',
                  outline: '1px solid rgba(223,231,224,0.08)', outlineOffset: -1,
                  transition: 'outline-color .5s',
                  backgroundImage: `url('${card.img}')`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  backgroundBlendMode: 'multiply',
                  background: `linear-gradient(180deg,rgba(3,6,9,.04) 36%,rgba(3,6,9,.72) 100%), url('${card.img}') center/cover no-repeat`,
                }}>
                  {/* Glow dot */}
                  <div style={{
                    position: 'absolute', top: '36%', left: '54%',
                    width: 80, height: 80,
                    background: 'radial-gradient(closest-side, rgba(92,69,253,0.6), rgba(92,69,253,0.2) 40%, transparent 72%)',
                    animation: 'rv-glow-pulse 3.4s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />

                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(transparent 46%, rgba(4,6,9,.8))',
                    pointerEvents: 'none',
                  }} />

                  {/* Arrow */}
                  <div style={{
                    position: 'absolute', top: 14, right: 14, zIndex: 2,
                    width: 26, height: 26, opacity: 0, transform: 'translate(-4px,4px)',
                    transition: '.5s cubic-bezier(.16,1,.3,1)',
                  }} className="rv-card-ar">
                    <MoveUpRight size={20} color="#dfe7e0" />
                  </div>

                  {/* Label */}
                  <div style={{
                    position: 'absolute', left: 16, right: 16, bottom: 14, zIndex: 2,
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10,
                  }}>
                    <b style={{ fontSize: 'clamp(13px,1.15vw,17px)', fontWeight: 400, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#dfe7e0', fontFamily: 'Manrope,sans-serif' }}>
                      {card.title}
                    </b>
                    <span style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(223,231,224,0.55)', fontFamily: 'Manrope,sans-serif' }}>
                      {card.tag}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.35)', fontFamily: 'Manrope,sans-serif' }}>
                  <span>{card.n}</span>
                  <span>View all →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section: Curriculum / how it works ───────────────────────────── */}
        <section id="curriculum" style={{
          position: 'relative', padding: 'clamp(88px,15vh,190px) clamp(20px,3.4vw,56px)',
          background: 'transparent', zIndex: 10,
        }}>
          <div style={{ position: 'absolute', inset: '-22% -4%', zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(110% 62% at 30% 50%, rgba(4,7,10,.88), rgba(4,7,10,.62) 42%, rgba(4,7,10,.18) 74%, rgba(4,7,10,0))', maskImage: 'linear-gradient(transparent, #000 44%)', WebkitMaskImage: 'linear-gradient(transparent, #000 44%)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,.72fr)', gap: 'clamp(28px,5vw,90px)', alignItems: 'end', marginBottom: 'clamp(34px,6vh,72px)' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.16,1,.3,1] }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)', fontFamily: 'Manrope,sans-serif' }}>
                  <b style={{ color: '#5c45fd' }}>III</b> · HOW IT WORKS
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(223,231,224,0.07)' }} />
              </div>
              <h2 style={{ fontFamily: 'Fraunces,Georgia,serif', fontSize: 'clamp(30px,4vw,60px)', fontWeight: 400, lineHeight: 1.055, letterSpacing: '-.005em', color: '#dfe7e0', textShadow: '0 2px 34px rgba(3,6,8,.72)', maxWidth: '13ch', margin: 0, textTransform: 'uppercase' }}>
                From click to comfort in four steps.
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.16,1,.3,1], delay: 0.1 }} style={{ fontSize: 14, lineHeight: 1.68, color: '#9aa5a0', fontFamily: 'Manrope,sans-serif', textShadow: '0 1px 18px rgba(3,6,8,.85)' }}>
              No furniture showrooms. No haggling. No moving trucks. We handle every step of getting your home ready.
            </motion.p>
          </div>

          {/* Steps list */}
          <div style={{ borderTop: '1px solid rgba(223,231,224,0.07)' }}>
            {[
              { n: '01', title: 'Choose your items', sub: 'Appliances, furniture, or a full-room bundle — browse and add to cart.', t: '2 min' },
              { n: '02', title: 'Pick your lease',   sub: 'Monthly, quarterly, or annual — price adjusts automatically.', t: '30 sec' },
              { n: '03', title: 'We deliver & install', sub: '24–72 hour slot. Our team assembles everything, then leaves it spotless.', t: '< 1 day' },
              { n: '04', title: 'Upgrade anytime',   sub: 'Swap, return, or add items at any time — free of charge.', t: 'Always' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.07 }}
                style={{
                  position: 'relative', display: 'grid', alignItems: 'center',
                  gridTemplateColumns: '64px minmax(0,1.05fr) minmax(0,1.25fr) 86px',
                  gap: 'clamp(14px,2.4vw,40px)',
                  padding: 'clamp(20px,2.4vw,30px) 0',
                  borderBottom: '1px solid rgba(223,231,224,0.07)',
                  cursor: 'pointer',
                  transition: 'padding-left .5s cubic-bezier(.16,1,.3,1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.paddingLeft = 'clamp(8px,1.2vw,18px)'; setCursorActive(true); }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0'; setCursorActive(false); }}
              >
                {/* Hover bar */}
                <div style={{ position: 'absolute', left: 0, bottom: -1, height: 1, width: '100%', background: '#5c45fd', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .7s cubic-bezier(.16,1,.3,1)' }} className="rv-les-bar" />
                <span style={{ fontSize: 11, letterSpacing: '0.16em', color: 'rgba(223,231,224,0.35)', fontVariantNumeric: 'tabular-nums', fontFamily: 'Manrope,sans-serif' }}>{step.n}</span>
                <h3 style={{ fontSize: 'clamp(16px,1.5vw,23px)', fontWeight: 400, letterSpacing: '-.005em', color: '#dfe7e0', fontFamily: 'Fraunces,Georgia,serif', margin: 0 }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#909b95', textShadow: '0 1px 16px rgba(3,6,8,.92)', fontFamily: 'Manrope,sans-serif' }}>{step.sub}</p>
                <div style={{ textAlign: 'right', fontSize: 11, letterSpacing: '0.14em', color: '#8b958f', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 16px rgba(3,6,8,.92)', fontFamily: 'Manrope,sans-serif' }}>{step.t}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section: Eternity / CTA ───────────────────────────────────────── */}
        <section id="eternity" style={{
          position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: 'clamp(88px,15vh,190px) clamp(20px,3.4vw,56px)', zIndex: 10,
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(82% 58% at 50% 46%, rgba(4,7,10,.26), rgba(4,7,10,.66) 56%, rgba(4,7,10,.9) 82%, rgba(4,7,10,0))' }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 26 }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.4)', fontFamily: 'Manrope,sans-serif' }}>
              <b style={{ color: '#5c45fd' }}>IV</b> · GET STARTED
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Fraunces,Georgia,serif',
              fontSize: 'clamp(38px,7.4vw,124px)',
              lineHeight: 0.94, letterSpacing: '-.03em', textTransform: 'uppercase',
              color: '#dfe7e0', textShadow: '0 2px 34px rgba(3,6,8,.72)', margin: 0,
            }}
          >
            Move in.<br />Live well.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            style={{ maxWidth: '44ch', margin: '26px auto 0', fontFamily: 'Manrope,sans-serif', fontSize: 14, color: '#9aa5a0', lineHeight: 1.72 }}
          >
            Join 12,000+ tenants who made the move with Rentova. Start renting in under 5 minutes — no credit checks, no deposits hassle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            style={{ marginTop: 44, display: 'flex', gap: 16 }}
          >
            <button
              onClick={() => navigate('/register')}
              style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 14,
                padding: '17px 30px', border: '1px solid rgba(223,231,224,0.2)', borderRadius: 100,
                fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#dfe7e0', background: 'none', overflow: 'hidden',
                transition: 'color .45s, border-color .45s', cursor: 'pointer',
                fontFamily: 'Manrope,sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dfe7e0'; e.currentTarget.style.color = '#05070a'; e.currentTarget.style.borderColor = '#dfe7e0'; setCursorActive(true); }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#dfe7e0'; e.currentTarget.style.borderColor = 'rgba(223,231,224,0.2)'; setCursorActive(false); }}
            >
              <Sparkles size={14} />
              Start for free
            </button>

            <button
              onClick={() => navigate('/catalog')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '17px 30px', background: 'rgba(92,69,253,0.18)',
                border: '1px solid rgba(92,69,253,0.35)', borderRadius: 100,
                fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#818cf8', cursor: 'pointer', transition: 'background .4s, border-color .4s',
                fontFamily: 'Manrope,sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(92,69,253,0.32)'; setCursorActive(true); }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(92,69,253,0.18)'; setCursorActive(false); }}
            >
              Browse catalog <ArrowRight size={14} />
            </button>
          </motion.div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────────── */}
        <footer style={{
          position: 'relative', padding: 'clamp(50px,8vh,96px) clamp(20px,3.4vw,56px) clamp(26px,4vh,40px)',
          borderTop: '1px solid rgba(223,231,224,0.07)', background: 'rgba(4,7,10,.55)', zIndex: 10,
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', background: 'linear-gradient(rgba(4,7,10,.55), rgba(4,7,10,.94) 40%, rgba(4,7,10,.98))' }} />

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) repeat(3,minmax(0,.6fr))', gap: 'clamp(22px,4vw,60px)', marginBottom: 'clamp(38px,6vh,74px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
                <svg width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0f1720"/><rect x="5" y="5" width="30" height="30" rx="6" fill="none" stroke="#5c45fd" strokeWidth="1.2"/><path d="M11 20h18M11 14h18M11 26h12" stroke="#dfe7e0" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.22em', color: '#dfe7e0', fontFamily: 'Manrope,sans-serif' }}>RENTOVA</span>
              </div>
              <p style={{ fontSize: 13, color: '#79847e', lineHeight: 1.68, maxWidth: '34ch', fontFamily: 'Manrope,sans-serif' }}>
                India's considered rental home service. Furniture and appliances that arrive on your schedule, look like you meant it, and leave when life shifts again.
              </p>
            </div>
            {[
              { head: 'Explore', links: ['Catalog', 'Packages', 'Inspiration', 'Room Planner'] },
              { head: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
              { head: 'Support', links: ['Help Center', 'Contact', 'Delivery Info', 'Returns'] },
            ].map(col => (
              <div key={col.head}>
                <h4 style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.35)', fontFamily: 'Manrope,sans-serif' }}>{col.head}</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: '#8f9a93', transition: 'color .35s', fontFamily: 'Manrope,sans-serif' }} onMouseEnter={e => e.currentTarget.style.color = '#dfe7e0'} onMouseLeave={e => e.currentTarget.style.color = '#8f9a93'}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingTop: 20, borderTop: '1px solid rgba(223,231,224,0.07)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(223,231,224,0.3)', fontFamily: 'Manrope,sans-serif' }}>
            <span>© 2025 Rentova Technologies Pvt. Ltd.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" style={{ color: 'rgba(223,231,224,0.3)', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: 'rgba(223,231,224,0.3)', textDecoration: 'none' }}>Terms</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes rv-glow-pulse {
          from { opacity: 0.6; transform: scale(0.95); }
          50%  { opacity: 1;   transform: scale(1.06); }
          to   { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
    </>
  );
}
