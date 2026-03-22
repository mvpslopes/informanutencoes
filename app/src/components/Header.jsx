import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

const WHATSAPP_NUMBER = '5531975221824'
const WHATSAPP_MSG = encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e gostaria de solicitar um orçamento.')

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, setIsOpen: openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Upgrades', href: '#upgrades' },
    { label: 'Contato', href: '#contato' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/10 border-b border-white/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#inicio" className="flex items-center">
          <img
            src="/logo.png"
            alt="Infor Manutenções"
            className={`h-16 w-auto transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'}`}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-medium text-sm tracking-wide transition-colors duration-200 ${
                scrolled
                  ? 'text-gray-700 hover:text-[#007BFF]'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Cart — desktop */}
          <button
            onClick={() => openCart(true)}
            className={`relative p-2 rounded-xl transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            aria-label="Carrinho"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#19A3B0] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                {count}
              </span>
            )}
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-[#19A3B0] to-[#007BFF] hover:from-[#007BFF] hover:to-[#19A3B0] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <WhatsAppIcon />
            Orçamento Grátis
          </a>
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => openCart(true)}
            className={`relative p-2 rounded-xl transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            aria-label="Carrinho"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#19A3B0] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                {count}
              </span>
            )}
          </button>

          <button
            className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/20 px-4 pb-5 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center py-3.5 text-gray-800 font-medium border-b border-gray-100 hover:text-[#007BFF] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-gradient-to-r from-[#19A3B0] to-[#007BFF] text-white font-bold px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <WhatsAppIcon />
            Solicitar Orçamento
          </a>
        </div>
      )}
    </header>
  )
}

function CartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
