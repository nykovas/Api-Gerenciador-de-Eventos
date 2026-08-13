import { NavLink, Link } from 'react-router-dom'
import { CalendarDays, LayoutDashboard, CalendarPlus, CalendarX } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/events', label: 'Eventos', icon: CalendarDays, end: false },
  { to: '/events/today', label: 'Eventos de Hoje', icon: CalendarX, end: false },
  { to: '/events/new', label: 'Criar Evento', icon: CalendarPlus, end: false },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">Eventos</p>
          <p className="text-xs text-slate-500 leading-tight">Gestão de Eventos</p>
        </div>
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-400">v1.0.0</p>
      </div>
    </aside>
  )
}
