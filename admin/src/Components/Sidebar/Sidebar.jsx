import { NavLink } from 'react-router-dom'
import { ListBulletIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

const navItems = [
  { to: '/add-product', label: 'Add Product', description: 'Create a new listing', icon: PlusCircleIcon },
  { to: '/product-list', label: 'Product List', description: 'Manage your catalog', icon: ListBulletIcon },
]

const Sidebar = () => {
  return (
    <aside className="w-full rounded-3xl border border-white/60 bg-white/90 shadow-xl shadow-slate-900/5 ring-1 ring-black/5 md:w-72">
      <div className="flex flex-col gap-6 p-5">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 p-5 text-white shadow-lg">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Catalog</p>
          <p className="mt-2 text-xl font-semibold">Manage storefront</p>
          <p className="mt-1 text-sm text-white/80">Keep listings fresh and inventory synced.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-slate-50 ${isActive
                    ? 'border-brand-200 bg-brand-50 text-brand-800 shadow-inner'
                    : 'border-slate-100 bg-white text-slate-600 shadow-sm'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-6 w-6 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-500'}`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar