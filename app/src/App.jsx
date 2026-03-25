import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import PublicSite from './pages/PublicSite'
import CommentsPage from './pages/CommentsPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { sendPageView } from './analytics.js'

function GoogleAnalyticsRouteTracker() {
  const location = useLocation()
  useEffect(() => {
    sendPageView(location.pathname + location.search)
  }, [location.pathname, location.search])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <GoogleAnalyticsRouteTracker />
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/comentarios" element={<CommentsPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/painel" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}
