import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CirclePlay,
  Headphones,
  MapPin,
  MoveRight,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import Hero3DView from '../components/Hero3DView';
import StorySphere from '../components/StorySphere';
import AIRecommendations from '../components/AIRecommendations';
import { CityContext } from '../context/CityContext';
import {
  cityOptions,
  inspirations,
  rentalPackages,
  roomCollections,
  trustFigures,
} from '../data/experience';

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();
  const { city, changeCity } = React.useContext(CityContext);
  const [homeType, setHomeType] = useState('A room or two');
  const [moveDate, setMoveDate] = useState('');

  return (
    <main className="rv-home">
      <section className="rv-home-hero">
        <Hero3DView />
        <div className="rv-home-hero__veil" style={{ zIndex: 1 }} />
        <div className="rv-home-hero__orb rv-home-hero__orb--one" style={{ zIndex: 1 }} />
        <div className="rv-home-hero__orb rv-home-hero__orb--two" style={{ zIndex: 1 }} />

        <div className="rv-shell rv-home-hero__layout" style={{ zIndex: 2, position: 'relative' }}>
          <motion.div
            className="rv-home-hero__copy"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.11, delayChildren: 0.08 }}
          >
            <motion.div variants={rise} className="rv-hero-kicker">
              <Sparkles size={14} /> India&apos;s considered rental home service
            </motion.div>
            <motion.h1
              variants={rise}
              whileHover={{ fontVariationSettings: '"wdth" 150, "wght" 800', letterSpacing: '2px' }}
              style={{ transition: 'all 0.3s ease' }}
            >
              Make the move.<br />
              <em>Leave the heavy lifting.</em>
            </motion.h1>
            <motion.p variants={rise}>
              Furniture, appliances, and complete homes that arrive on your schedule, look like you
              meant it, and leave when life shifts again.
            </motion.p>
            <motion.div variants={rise} className="rv-home-hero__actions">
              <Link to="/move-planner" className="rv-button rv-button--signal">
                Design my move <ArrowRight size={18} />
              </Link>
              <Link to="/room-configurator" className="rv-hero-link">
                <CirclePlay size={18} /> 3D Room Configurator
              </Link>
            </motion.div>

            <motion.div variants={rise} className="rv-home-hero__proof">
              <div className="rv-avatar-stack" aria-hidden="true">
                <span>R</span><span>A</span><span>K</span><span>+</span>
              </div>
              <p><strong>12,000+ homes</strong> made move-in ready<br />across India&apos;s fastest-moving cities.</p>
            </motion.div>
          </motion.div>


        </div>

        <div className="rv-hero-ticker">
          <div className="rv-shell rv-hero-ticker__inner">
            <span>Furniture that fits</span><i />
            <span>Appliances that work</span><i />
            <span>Terms that move with you</span><i />
            <span>Support that actually shows up</span>
          </div>
        </div>
      </section>

      <section className="rv-trust-strip rv-shell" aria-label="Rental benefits">
        <div><PackageCheck size={22} /><span><strong>24-72 hour delivery</strong> in select city zones</span></div>
        <div><WandSparkles size={22} /><span><strong>Stylist-curated</strong> room combinations</span></div>
        <div><Headphones size={22} /><span><strong>Real human support</strong> when you need it</span></div>
      </section>

      <section className="rv-section rv-shell rv-rooms-section">
        <div className="rv-section-heading">
          <div><span className="rv-section-label">Browse by feeling</span><h2>Start with the room<br />you want to come home to.</h2></div>
          <p>Rent item by item, or begin with a whole room. Either way, every piece has one job: making the in-between feel beautifully settled.</p>
        </div>
        <div className="rv-room-grid">
          {roomCollections.map((room, index) => (
            <motion.article
              key={room.id}
              className={`rv-room-card rv-room-card--${room.accent}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ delay: index * 0.08 }}
            >
              <img src={room.image} alt="" />
              <div className="rv-room-card__shade" />
              <div className="rv-room-card__content">
                <span>{room.eyebrow}</span>
                <h3>{room.title}</h3>
                <p>{room.copy}</p>
                <Link to={`/catalog?category=${room.title.toLowerCase().replace(' ', '-')}`}>Explore the room <ArrowDownRight size={18} /></Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <AIRecommendations />

      <section className="rv-section rv-shell rv-package-section">
        <div className="rv-package-heading">
          <div><span className="rv-section-label">Done-for-you rooms</span><h2>Not in the mood<br />to make 47 decisions?</h2></div>
          <p>Pick a starting point. We&apos;ve assembled the pieces people need together most, and made every bundle easy to adjust.</p>
        </div>
        <ul className="rv-package-grid" style={{ listStyle: 'none', padding: 0 }}>
          {rentalPackages.map((pack, index) => (
            <li key={pack.id} style={{ display: 'contents' }}>
              <article className={`rv-package-card rv-package-card--${pack.color}`}>
                <div className="rv-package-card__media"><img src={pack.image} alt="" /><span>{pack.label}</span></div>
                <div className="rv-package-card__body">
                  <div><h3>{pack.title}</h3><strong>{pack.price}</strong></div>
                  <ul>{pack.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
                  <Link to={`/packages?pack=${pack.id}`}>See what&apos;s inside <ArrowRight size={17} /></Link>
                </div>
                <span className="rv-package-card__number">0{index + 1}</span>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="rv-section rv-lifestyle-section">
        <div className="rv-shell rv-lifestyle-grid">
          <div className="rv-lifestyle-card rv-lifestyle-card--story">
            <span className="rv-section-label">The Rentova way</span>
            <h2>Your home isn&apos;t a purchase order.</h2>
            <p>It&apos;s a living system. We designed Rentova around the moments that change it: a new job, a new city, a growing family, or simply the urge for more breathing room.</p>
            <Link to="/inspiration" className="rv-button rv-button--dark">Meet the movement <ArrowRight size={17} /></Link>
          </div>
          <div className="rv-lifestyle-card rv-lifestyle-card--image"><img src="/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg" alt="A fully furnished interior" /><span>Built for a life in motion</span></div>
          <div className="rv-lifestyle-card rv-lifestyle-card--stats">
            {trustFigures.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="rv-shell">
        <StorySphere />
      </section>

      <section className="rv-cta-band">
        <div className="rv-shell rv-cta-band__inner">
          <div><span className="rv-section-label">Rentova for business</span><h2>Spaces at scale.<br />Still personal.</h2></div>
          <p>From co-living to offices, we make full-space setup easier to plan, manage, and adapt.</p>
          <Link to="/business" className="rv-button rv-button--light">Explore business rentals <ArrowRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}
