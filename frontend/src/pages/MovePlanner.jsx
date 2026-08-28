import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  MoveRight,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { CityContext } from '../context/CityContext';
import { cityOptions } from '../data/experience';

export default function MovePlanner() {
  const navigate = useNavigate();
  const { city, changeCity } = useContext(CityContext);
  const [homeType, setHomeType] = useState('A room or two');
  const [moveDate, setMoveDate] = useState('');

  const launchPlanner = () => {
    const query = new URLSearchParams({ city, type: homeType });
    if (moveDate) query.set('move', moveDate);
    navigate(`/packages?${query.toString()}`);
  };

  return (
    <main className="rv-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 100px)', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <motion.aside
        className="rv-move-planner"
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ margin: '0 auto', boxShadow: 'var(--rv-shadow-lg)', position: 'relative', top: 'auto', right: 'auto' }}
      >
        <div className="rv-move-planner__topline">
          <span>Your move, mapped</span>
          <span className="rv-pulse"><i /> Live availability</span>
        </div>
        <h2>What does your next home need?</h2>
        <div className="rv-planner-field">
          <MapPin size={18} />
          <label>
            <span>Moving to</span>
            <select value={city} onChange={(event) => changeCity(event.target.value)}>
              {cityOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <ChevronRight size={17} />
        </div>
        <div className="rv-planner-field">
          <Search size={18} />
          <label>
            <span>Space to furnish</span>
            <select value={homeType} onChange={(event) => setHomeType(event.target.value)}>
              <option>A room or two</option>
              <option>My complete home</option>
              <option>A work setup</option>
              <option>My business</option>
            </select>
          </label>
          <ChevronRight size={17} />
        </div>
        <div className="rv-planner-field">
          <CalendarDays size={18} />
          <label>
            <span>Move-in date</span>
            <input
              type="date"
              value={moveDate}
              onChange={(event) => setMoveDate(event.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
        </div>
        <button type="button" onClick={launchPlanner} className="rv-planner-submit">
          Show my setup <MoveRight size={19} />
        </button>
        <p><ShieldCheck size={14} /> Delivery, setup, service, and pickup are built in.</p>
      </motion.aside>
    </main>
  );
}
