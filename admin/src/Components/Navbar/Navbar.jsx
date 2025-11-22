import { Link, useLocation } from 'react-router-dom'
import { BoltIcon, ListBulletIcon, PlusIcon } from '@heroicons/react/24/outline'
import navLogo from '../../assets/nav-logo.svg'

const routeNameMap = {
  '/add-product': 'Add Product',
  '/product-list': 'Product List',
}

const GenericAvatar = () => (
  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 shadow-inner ring-1 ring-white/60">
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z"
        fill="currentColor"
      />
    </svg>
  </span>
)

const Navbar = () => {
  const location = useLocation()
  const pageTitle = routeNameMap[location.pathname] ?? 'Dashboard'
  const isAddProductPage = location.pathname === '/add-product'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-[90rem] px-4 py-4 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3 text-left">
            <img src={navLogo} alt="Shop brand mark" className="h-12 w-auto" />
            <div className="flex flex-col leading-tight">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Shop</p>
              <p className="text-sm font-semibold text-slate-900">Merchant Admin</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!isAddProductPage && (
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                Add a product
              </Link>
            )}
            <Link
              to="/product-list"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
            >
              <ListBulletIcon className="h-4 w-4" aria-hidden="true" />
              View inventory
            </Link>
            <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/80 px-3 py-2 shadow">
              <div className="text-right text-[11px] text-slate-500">
                <p className="font-semibold uppercase tracking-wide text-slate-400">Admin</p>
                <p className="text-base font-semibold text-slate-900">You</p>
              </div>
              <GenericAvatar />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
              {pageTitle}
            </span>
            <span className="hidden text-slate-400 sm:inline">•</span>
            <span className="text-slate-400">{location.pathname}</span>
          </div>
          <span className="inline-flex items-center gap-2 text-emerald-500">
            <BoltIcon className="h-4 w-4" aria-hidden="true" />
            Live synchronization
          </span>
        </div>
      </div>
    </header>
  )
}

export default Navbar