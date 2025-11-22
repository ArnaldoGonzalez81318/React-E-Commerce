import React from 'react'
import { Link } from 'react-router-dom'
import hand_icon from '../Assets/hand_icon.png'
import hero_image from '../Assets/hero_image.png'

const highlightBadges = ['Free express shipping', 'New drops weekly', 'Size inclusive'];
const stats = [
  { value: '120+', label: 'Seasonal arrivals' },
  { value: '48h', label: 'Average delivery' },
  { value: '4.9/5', label: 'Community rating' },
]

const Home = () => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-50 via-white to-indigo-50">
      <div className="pointer-events-none absolute inset-y-0 right-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
      <div className="container-grid flex flex-col-reverse items-center gap-12 py-16 lg:flex-row lg:py-24">
        <div className="w-full max-w-xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">
            <img src={hand_icon} alt="New" className="h-5 w-5" />
            New arrivals
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Sport-luxe layers for every move you make.
          </h1>
          <p className="text-lg text-slate-600">
            Build a capsule wardrobe with breathable knits, elevated basics, and statement footwear curated by our in-house stylists.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              to="/women"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
            >
              Explore collection
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-4-4 4 4-4 4" />
              </svg>
            </Link>
            <Link
              to="/men"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              Shop men
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:justify-start">
            {highlightBadges.map(badge => (
              <span key={badge} className="rounded-full border border-white/60 bg-white/80 px-4 py-1">
                {badge}
              </span>
            ))}
          </div>
          <div className="grid w-full gap-4 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-inner sm:grid-cols-3">
            {stats.map(item => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-300/60 to-slate-900/30 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/50 p-6 shadow-2xl">
            <img src={hero_image} alt="Featured look" className="mx-auto h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home