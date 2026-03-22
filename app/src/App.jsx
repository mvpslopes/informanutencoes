import { useState, useCallback } from 'react'
import { CartProvider } from './context/CartContext'
import SplashScreen from './components/SplashScreen'
import Header from './components/Header'
import Hero from './components/Hero'
import Servicos from './components/Servicos'
import Upgrades from './components/Upgrades'
import Diferenciais from './components/Diferenciais'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Cart from './components/Cart'

function App() {
  const [splashDone, setSplashDone] = useState(false)
  const handleFinish = useCallback(() => setSplashDone(true), [])

  return (
    <CartProvider>
      {!splashDone && <SplashScreen onFinish={handleFinish} />}

      <div
        className={`min-h-screen transition-opacity duration-700 ${
          splashDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Header />
        <main>
          <Hero />
          <Servicos />
          <Upgrades />
          <Diferenciais />
        </main>
        <Footer />
        <WhatsAppFloat />
        <Cart />
      </div>
    </CartProvider>
  )
}

export default App
