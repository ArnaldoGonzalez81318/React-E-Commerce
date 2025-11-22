import { NavLink } from 'react-router-dom'
import { ListBulletIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

const navItems = [
  { to: '/add-product', label: 'Add Product', description: 'Create a new listing', icon: PlusCircleIcon },
  { to: '/product-list', label: 'Product List', description: 'Manage your catalog', icon: ListBulletIcon },
]

const Sidebar = () => {
  return (
    <aside className="w-full rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 md:w-72">
      <div className="flex flex-col gap-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
          <p className="text-lg font-semibold text-slate-900">Manage catalog</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50 ${isActive
                  ? 'border-brand-200 bg-brand-50 text-brand-800 shadow-inner'
                  : 'border-slate-100 bg-white text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-7 w-7 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} aria-hidden="true" />
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
    </aside>
  )
}

export default Sidebar