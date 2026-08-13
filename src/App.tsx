import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import DashboardPage from '@/pages/DashboardPage'
import EventsListPage from '@/pages/EventsListPage'
import EventDetailPage from '@/pages/EventDetailPage'
import EventFormPage from '@/pages/EventFormPage'
import EventsTodayPage from '@/pages/EventsTodayPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <MobileNav />
          <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/events" element={<EventsListPage />} />
              <Route path="/events/today" element={<EventsTodayPage />} />
              <Route path="/events/new" element={<EventFormPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/events/:id/edit" element={<EventFormPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
