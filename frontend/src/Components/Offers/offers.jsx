import React from 'react'
import { Link } from 'react-router-dom'
import exclusive_image from '../Assets/exclusive_image.png'
import './offers.css'

const perks = ['Member-only pricing', '48h early access', 'Free returns in the US']

const Offers = () => {
  return (
    <section className="offers section-shell" aria-labelledby="offers-heading">
      <div className="offers-card">
        <div className="offers-left">
          <p className="pill">Exclusive drop</p>
          <h2 id="offers-heading">Unlock weekly capsule offers</h2>
          <p className="offers-copy">
            Join our insider list for styled bundles, surprise restocks, and concierge support tailored to your size and vibe.
          </p>
          <ul className="offers-perks">
            {perks.map(perk => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
          <div className="offers-cta">
            <Link to="/women" className="btn-primary">
              Shop capsule
            </Link>
            <Link to="/men" className="btn-secondary">
              Browse menswear
            </Link>
          </div>
        </div>
        <div className="offers-right" aria-hidden>
          <div className="offers-blob" />
          <img src={exclusive_image} alt="Exclusive capsule" loading="lazy" />
        </div>
      </div>
    </section>
  )
}

export default Offers