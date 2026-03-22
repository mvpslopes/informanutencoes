import { useCart } from '../context/CartContext'

const WHATSAPP_NUMBER = '5531975221824'

function formatWhatsAppMsg(items, total) {
  const lines = items.map(
    (i) => `• ${i.name} x${i.qty} — R$ ${(i.priceNum * i.qty).toFixed(2).replace('.', ',')}`
  )
  return encodeURIComponent(
    `Olá! Vim pelo site da Infor Manutenções e gostaria de fazer o seguinte pedido:\n\n` +
    `🛒 *Meu Pedido*\n` +
    lines.join('\n') +
    `\n\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n` +
    `_(Instalação profissional já inclusa em todos os itens)_`
  )
}

export default function Cart() {
  const { items, count, total, isOpen, setIsOpen, removeItem, changeQty, clearCart } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-400 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
              <CartIcon className="w-5 h-5 text-[#007BFF]" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-lg leading-none">Carrinho</h2>
              <p className="text-gray-400 text-xs mt-0.5">{count} {count === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-20">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                <CartIcon className="w-10 h-10 text-gray-200" />
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Carrinho vazio</p>
                <p className="text-gray-400 text-sm mt-1">Adicione peças e upgrades para finalizar</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#007BFF]/10 text-[#007BFF] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#007BFF]/20 transition-colors"
              >
                Ver produtos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 rounded-2xl p-4">
                {/* Imagem */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/64x64/e5e7eb/9ca3af?text=...' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-bold text-sm leading-tight">{item.name}</p>
                  <p className="text-[#19A3B0] font-black text-base mt-1">
                    R$ {(item.priceNum * item.qty).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">R$ {item.priceNum.toFixed(2).replace('.', ',')} / un.</p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-2 py-1 shadow-sm">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#007BFF] font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-gray-900 font-black text-sm w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, +1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#007BFF] font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-4">
            {/* Info inclusa */}
            <div className="flex items-center gap-2 bg-[#25D366]/10 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-[#25D366] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-gray-600 text-xs font-medium">Instalação profissional inclusa em todos os itens</p>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-gray-900 font-black text-2xl">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${formatWhatsAppMsg(items, total)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={clearCart}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-[#25D366] to-[#19A3B0] text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              <WhatsAppIcon />
              Finalizar pelo WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="w-full text-gray-400 text-xs hover:text-red-400 transition-colors py-1"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function CartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
