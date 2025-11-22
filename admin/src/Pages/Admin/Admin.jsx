import { Outlet } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'

const Admin = () => {
  return (
    <section className="relative pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-40 max-w-5xl rounded-full bg-gradient-to-b from-brand-100/70 to-transparent blur-3xl" aria-hidden />
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-4 py-6 lg:h-[calc(100vh-7rem)] lg:flex-row lg:overflow-hidden lg:px-12 lg:py-10">
        <div className="w-full md:w-72 lg:w-80 lg:flex-none lg:h-full lg:overflow-y-auto lg:pr-1">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl shadow-slate-900/5 ring-1 ring-black/5 lg:h-full lg:overflow-y-auto lg:p-8">
          <Outlet />
        </main>
      </div>
      <footer className="mx-auto mt-6 w-full max-w-[90rem] px-4 text-xs text-slate-500 lg:flex lg:items-center lg:justify-between lg:px-12">
        <p>© {new Date().getFullYear()} Shop Merchant Admin. All rights reserved.</p>
        <p className="mt-2 lg:mt-0">Need help? support@shop.com</p>
      </footer>
    </section>
  )
}

export default Admin