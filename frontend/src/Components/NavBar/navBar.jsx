import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHeart } from 'react-icons/hi2';
import { ShopContext } from '../../Context/shopContext';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';

const navLinks = [
  { label: 'Shop All', to: '/' },
  { label: 'Men', to: '/men' },
  { label: 'Women', to: '/women' },
  { label: 'Kids', to: '/kids' },
];

const getPathMenu = pathname => {
  const path = pathname.split('/')[1];
  switch (path) {
    case 'men':
      return 'Men';
    case 'women':
      return 'Women';
    case 'kids':
      return 'Kids';
    default:
      return 'Shop All';
  }
};

export const NavBar = () => {
  const { cartItems, wishlistCount } = useContext(ShopContext);
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(getPathMenu(location.pathname));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cartItems || {}).reduce((acc, value) => acc + value, 0),
    [cartItems]
  );

  useEffect(() => {
    setActiveMenu(getPathMenu(location.pathname));
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = Boolean(localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.replace('/');
  };

  const navClasses = link =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${activeMenu === link.label
      ? 'bg-slate-900 text-white shadow-lg'
      : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/60 backdrop-blur transition-shadow ${hasScrolled ? 'bg-white/95 shadow-lg' : 'bg-white/90 shadow-sm'
        }`}
    >
      <div className="container-grid flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Shop" className="h-10 w-10" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Shop</p>
            <p className="text-base font-semibold text-slate-900">Modern Essentials</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={navClasses(link)}
              onClick={() => setActiveMenu(link.label)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 md:inline-flex"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 md:inline-flex"
            >
              Login
            </Link>
          )}
          <Link
            to="/wishlist"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-100"
            aria-label="View wishlist"
          >
            <HiOutlineHeart className="h-5 w-5" aria-hidden />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-semibold leading-none text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative inline-flex items-center justify-center rounded-full border border-slate-200 p-2">
            <img src={cart_icon} alt="Cart" className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(prev => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur lg:hidden">
          <div className="container-grid flex flex-col gap-3 py-4">
            <div className="flex items-center gap-3">
              <Link
                to="/wishlist"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                <HiOutlineHeart className="h-5 w-5" aria-hidden />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                <img src={cart_icon} alt="Cart" className="h-5 w-5" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-600 px-2 text-xs font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-2xl px-4 py-3 text-base font-semibold ${activeMenu === link.label
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
                onClick={() => setActiveMenu(link.label)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-600"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;