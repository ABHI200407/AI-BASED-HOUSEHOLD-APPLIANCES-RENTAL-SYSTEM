import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { supportedCities, trustHighlights } from '../data/rentova';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-brand__mark">R</div>
          <div>
            <div className="site-footer__title">Rentova</div>
            <p className="site-footer__copy">
              Furniture, appliances, and business setups on rent with a more premium, less stressful flow.
            </p>
          </div>
        </div>

        <div className="site-footer__columns">
          <div className="site-footer__column">
            <h4>Explore</h4>
            <Link to="/">Launch page</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/financials">Financials &amp; Calculator</Link>
            <Link to="/tour">Take the Tour</Link>
            <Link to="/business">Rentova for Business</Link>
            <Link to="/my-bookings">My bookings</Link>
            <Link to="/owner">Owner dashboard</Link>
          </div>

          <div className="site-footer__column">
            <h4>Service</h4>
            {trustHighlights.map((item) => (
              <span key={item}>
                <Sparkles size={14} /> {item}
              </span>
            ))}
          </div>

          <div className="site-footer__column">
            <h4>Coverage</h4>
            {supportedCities.slice(0, 6).map((city) => (
              <span key={city}>
                <MapPin size={14} /> {city}
              </span>
            ))}
          </div>

          <div className="site-footer__column">
            <h4>Contact</h4>
            <span>
              <Phone size={14} /> 24/7 support
            </span>
            <span>
              <Mail size={14} /> support@rentova.com
            </span>
            <span>
              <ArrowUpRight size={14} /> Bulk quotes for business
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
