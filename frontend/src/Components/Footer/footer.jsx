import React from 'react'
import { Link } from 'react-router-dom'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pinterest_icon from '../Assets/pinterest_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const navigationColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/' },
      { label: 'Men', to: '/men' },
      { label: 'Women', to: '/women' },
      { label: 'Kids', to: '/kids' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', to: '/faq' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
]

const socialLinks = [
  { href: 'https://www.instagram.com/', icon: instagram_icon, label: 'Instagram' },
  { href: 'https://www.pinterest.com/', icon: pinterest_icon, label: 'Pinterest' },
  { href: 'https://www.whatsapp.com/', icon: whatsapp_icon, label: 'WhatsApp' },
]

const supportEmail = 'support@shop.co'
const supportPhone = '+1 (555) 204-2024'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container-grid space-y-10 py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={footer_logo} alt="Shop" className="h-12 w-12" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Shop</p>
                <p className="text-lg font-semibold text-white">Everyday Performance Wear</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400">
              Curated essentials engineered for movement, crafted for modern life. Designed in-house, delivered worldwide.
            </p>
            <div className="flex gap-3" aria-label="Social media">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link"
                >
                  <img src={link.icon} alt={link.label} className="footer-social-icon" />
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {navigationColumns.map(column => (
              <div key={column.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{column.title}</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {column.links.map(link => (
                    <li key={link.label}>
                      <Link to={link.to} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© {year} Shop. All rights reserved.</p>
          <p className="mt-2 flex items-center gap-4 sm:mt-0">
            <a href={`mailto:${supportEmail}`} className="hover:text-white transition">
              {supportEmail}
            </a>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <a href={`tel:${supportPhone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition">
              {supportPhone}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer