import { useState, useCallback } from 'react'
import SplashScreen from '../components/SplashScreen'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Servicos from '../components/Servicos'
import Upgrades from '../components/Upgrades'
import Diferenciais from '../components/Diferenciais'
import CommentsSection from '../components/CommentsSection'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import Cart from '../components/Cart'

export default function PublicSite() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashEnd = useCallback(() => setShowSplash(false), [])

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashEnd} />}

      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Servicos />
          <Upgrades />
          <Diferenciais />
          <CommentsSection />
        </main>
        <Footer />
        <WhatsAppFloat />
        <Cart />
      </div>
    </>
  )
}
