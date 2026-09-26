import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  Check, 
  MapPin, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';

const STORIES = [
  { 
    id: 1, 
    title: 'The 48-Hour Relocation', 
    author: 'Priya S.', 
    city: 'Bengaluru', 
    neighborhood: 'Bellandur',
    color: 'clay', 
    image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg', 
    items: ['Fast 24h Setup', 'Fully Furnished', 'Zero Hassle'], 
    content: 'Got a job offer on Tuesday, moved on Thursday. Rentova completely furnished my empty 2BHK in Bellandur before my flight even landed. I walked into a warm, curated home rather than an empty box.' 
  },
  { 
    id: 2, 
    title: 'First Apartment Magic', 
    author: 'Rahul & Aditi', 
    city: 'Mumbai', 
    neighborhood: 'Bandra West',
    color: 'ink', 
    image: '/downloaded_images/bedroom/full_room/full_room_001_pid6903157.jpg', 
    items: ['Bedroom Suite', 'Solid Oak Finish', 'Budget Friendly'], 
    content: 'Moving out together meant buying a mountain of heavy furniture we couldn\'t afford. Renting the curated bedroom set gave us the designer aesthetic we wanted without draining our early career savings.' 
  },
  { 
    id: 3, 
    title: 'The Nomadic Executive', 
    author: 'Vikram M.', 
    city: 'Gurugram', 
    neighborhood: 'CyberCity',
    color: 'olive', 
    image: '/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg', 
    items: ['Mid-Century Living', 'Flexible Tenure', '1-Click Return'], 
    content: 'I jump between cities every 8 to 12 months for client expansions. Rentova is my urban superpower. I subscribe to the exact same high-density minimalist aesthetic everywhere. Returning is a single tap.' 
  },
  { 
    id: 4, 
    title: 'The Growing Family', 
    author: 'Neha T.', 
    city: 'Pune', 
    neighborhood: 'Kalyani Nagar',
    color: 'clay', 
    image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg', 
    items: ['Kid Friendly', 'Free Style Swaps', 'Stain-Resistant'], 
    content: 'When the baby arrived, we needed different furniture overnight. We swapped our glass coffee table for a plush, kid-safe ottoman and upgraded to a larger sectional seamlessly with zero penalty.' 
  },
  { 
    id: 5, 
    title: 'The Startup Studio', 
    author: 'Karan D.', 
    city: 'Hyderabad', 
    neighborhood: 'Hitec City',
    color: 'ink', 
    image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg', 
    items: ['Ergonomic Desks', 'Lumbar Chairs', 'Zero Sunk Capital'], 
    content: 'Bootstrapping a fintech company from a residential apartment. We rented four ergonomic motorized desks. As our team doubled, we scaled up seamlessly with zero capital stuck in depreciating assets.' 
  },
  { 
    id: 6, 
    title: 'The Style Swap', 
    author: 'Ananya P.', 
    city: 'Delhi NCR', 
    neighborhood: 'Vasant Vihar',
    color: 'olive', 
    image: '/downloaded_images/lifestyle/apartments/apartments_001_pid4792297.jpg', 
    items: ['Seasonal Refresh', 'Living Room', 'Jewel Tones'], 
    content: 'I get bored of static interior aesthetics quickly. For the festive season, I used the Style Swap feature to transform our living space from muted greys to vibrant warm tones in an afternoon.' 
  },
  { 
    id: 7, 
    title: 'The Semester Residency', 
    author: 'Rishabh C.', 
    city: 'Bengaluru', 
    neighborhood: 'Koramangala',
    color: 'clay', 
    image: '/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg', 
    items: ['6-Month Term', 'Dynamic Deposit', 'Easy Move Out'], 
    content: 'Here for a 6-month research residency. Buying a bed and appliance set just to sell it later on classifieds seemed exhausting. The short-tenure plan was effortless.' 
  },
  { 
    id: 8, 
    title: 'The Pet-Friendly Pad', 
    author: 'Sneha & Max', 
    city: 'Mumbai', 
    neighborhood: 'Juhu',
    color: 'olive', 
    image: '/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg', 
    items: ['Pet Friendly', 'Free Deep Cleaning', 'Olefin Fabric'], 
    content: 'Adopted a Golden Retriever puppy. I was terrified of him scratching an expensive sofa. Rentova\'s pet-friendly Olefin fabric bundle with annual free deep cleaning made home living stress-free.' 
  }
];

/**
 * StoryCard — Three layered interactions:
 * 1. Spotlight: a soft radial light follows the cursor across the card surface
 * 2. Peek overlay: on hover, a frosted preview panel slides up from the bottom 
 *    revealing the story excerpt and a "Drag to read" prompt
 * 3. Drag/click to read: clicking expands the card into a full-story modal
 *    with a satisfying drag-open spring animation
 */
function StoryCard({ story, idx, onSelect }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 }); // percent

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <motion.article
      ref={cardRef}
      layoutId={`story-card-${story.id}`}
      onClick={() => onSelect(story)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      style={{
        flex: '0 0 340px',
        scrollSnapAlign: 'start',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid var(--rv-color-border, #e2e8f0)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* ── Spotlight Light ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle 180px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.18) 0%, transparent 75%)`,
        }}
      />

      {/* Card Media */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', flexShrink: 0 }}>
        <motion.img
          src={story.image}
          alt={story.title}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* City tag */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(15, 23, 42, 0.82)',
          
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '99px',
          fontSize: '0.72rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 5,
        }}>
          <MapPin size={12} color="#38bdf8" /> {story.city} &bull; {story.neighborhood}
        </div>

        {/* Index stamp */}
        <span style={{
          position: 'absolute', bottom: '12px', right: '12px',
          background: 'rgba(255,255,255,0.93)',
          color: '#111827',
          padding: '3px 9px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          zIndex: 5,
        }}>
          0{idx + 1}
        </span>

        {/* ── Peek Overlay — slides up on hover ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.75) 100%)',
                
                padding: '1.25rem 1rem 1rem',
                zIndex: 8,
              }}
            >
              <p style={{
                fontSize: '0.82rem',
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.88)',
                margin: '0 0 0.75rem',
                fontStyle: 'italic',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                "{story.content}"
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '5px 12px',
                borderRadius: '99px',
                fontSize: '0.73rem',
                fontWeight: 700,
                color: '#ffffff',
              }}>
                <BookOpen size={12} /> Tap to read full story
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--rv-color-primary, #111827)',
            margin: '0 0 4px',
            fontFamily: 'var(--rv-font-display), "Fraunces", serif',
          }}>
            {story.title}
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            By {story.author}
          </span>
        </div>

        {/* Tag perks */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {story.items.map((item) => (
            <span
              key={item}
              style={{
                background: '#f1f5f9',
                color: '#475569',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.73rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Check size={11} color="#10b981" /> {item}
            </span>
          ))}
        </div>

        {/* Read CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9',
          color: 'var(--accent, #5c45fd)',
          fontWeight: 700,
          fontSize: '0.85rem',
          marginTop: 'auto',
          transition: 'gap 0.2s',
          gap: hovered ? '10px' : '6px',
        }}>
          <span>Read Full Story</span>
          <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <ArrowRight size={15} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

/** Full-story expanded modal — opens with a drag-spring feel */
function StoryModal({ story, onClose }) {
  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'Manrope, Inter, sans-serif',
      }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`story-card-${story.id}`}
        initial={{ scale: 0.88, y: 32 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          maxWidth: '640px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          cursor: 'grab',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '36px', height: '4px',
          borderRadius: '99px',
          background: 'rgba(255,255,255,0.55)',
          zIndex: 20,
        }} />

        {/* Modal Image Header */}
        <div style={{ height: '260px', position: 'relative' }}>
          <img
            src={story.image}
            alt={story.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Dark gradient at bottom of image */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 100%)',
          }} />

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.55)',
              
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10,
            }}
          >
            <X size={18} />
          </button>

          <div style={{
            position: 'absolute', bottom: '16px', left: '16px',
            background: 'rgba(15, 23, 42, 0.82)',
            
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.8rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <MapPin size={14} color="#38bdf8" /> {story.city} &bull; {story.neighborhood}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            fontFamily: 'var(--rv-font-display), "Fraunces", serif',
            marginBottom: '0.5rem',
            color: '#0f172a',
          }}>
            {story.title}
          </h3>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {story.items.map((it) => (
              <span
                key={it}
                style={{
                  background: '#ecfdf5',
                  color: '#065f46',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Check size={13} color="#10b981" /> {it}
              </span>
            ))}
          </div>

          <blockquote style={{
            fontSize: '1.15rem',
            lineHeight: 1.75,
            color: '#334155',
            margin: '0 0 2rem',
            fontStyle: 'italic',
            borderLeft: '3px solid var(--accent, #5c45fd)',
            paddingLeft: '1.25rem',
          }}>
            "{story.content}"
          </blockquote>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px', height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent, #5c45fd), #818cf8)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem',
              }}>
                {story.author.charAt(0)}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0f172a' }}>{story.author}</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Verified Rentova Resident</span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#111827',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '99px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close Story
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StorySphere() {
  const [selectedStory, setSelectedStory] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      width: '100%',
      margin: '4rem 0',
      position: 'relative',
    }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.825rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent, #5c45fd)',
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={14} /> The Renter's Archive
          </span>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            fontFamily: 'var(--rv-font-display), "Fraunces", serif',
            color: 'var(--rv-color-primary, #111827)',
            margin: '0 0 0.5rem',
            lineHeight: 1.1,
          }}>
            Life, arranged.
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--rv-color-secondary, #64748b)',
            margin: 0,
            maxWidth: '580px',
            lineHeight: 1.6,
          }}>
            Real stories from residents who unlocked spatial mobility and discarded the burden of permanent ownership.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => scroll('left')}
            aria-label="Previous stories"
            style={{
              width: '46px', height: '46px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid var(--rv-color-border, #e2e8f0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={20} color="#111827" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next stories"
            style={{
              width: '46px', height: '46px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid var(--rv-color-border, #e2e8f0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={20} color="#111827" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '1.75rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '1.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {STORIES.map((story, idx) => (
          <StoryCard
            key={story.id}
            story={story}
            idx={idx}
            onSelect={setSelectedStory}
          />
        ))}
      </div>

      {/* Story expand modal */}
      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
