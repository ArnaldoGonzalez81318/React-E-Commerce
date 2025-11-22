import { Outlet } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'

const Admin = () => {
  return (
    <section className="pb-12">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-4 py-6 lg:h-[calc(100vh-7rem)] lg:flex-row lg:overflow-hidden lg:px-10">
        <div className="w-full md:w-72 lg:h-full lg:overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm ring-1 ring-black/5 lg:h-full lg:overflow-y-auto lg:p-6">
          <Outlet />
        </main>
      </div>
      <footer className="mx-auto mt-6 w-full max-w-[90rem] px-4 text-xs text-slate-500 lg:flex lg:items-center lg:justify-between lg:px-10">
        <p>© {new Date().getFullYear()} Shop Merchant Admin. All rights reserved.</p>
        <p className="mt-2 lg:mt-0">Need help? support@shop.com</p>
      </footer>
    </section>
  )
}

export default Admin