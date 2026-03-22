const WHATSAPP_NUMBER = '5531975221824'
const WHATSAPP_MSG = encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e gostaria de solicitar um orçamento.')
const INSTAGRAM = 'thiagocebox'

export default function Footer() {
  return (
    <footer id="contato">

      {/* Wave transition */}
      <div className="bg-white">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0 0L48 8C96 16 192 32 288 40C384 48 480 48 576 40C672 32 768 16 864 12C960 8 1056 16 1152 24C1248 32 1344 40 1392 44L1440 48V70H0V0Z"
            style={{ fill: '#001e3c' }} />
        </svg>
      </div>

      <div style={{ background: 'linear-gradient(160deg, #001e3c 0%, #002d55 60%, #003d6b 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-16">
          <div className="grid md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <img src="/logo.png" alt="Infor Manutenções" className="h-14 w-auto brightness-0 invert mb-5" />
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                Assistência técnica especializada em notebooks e computadores há quase 20 anos. Atendemos Ouro Branco e toda a região com qualidade e agilidade.
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#25D366]/30 border border-white/10 hover:border-[#25D366]/40 rounded-xl flex items-center justify-center text-white/60 hover:text-[#25D366] transition-all duration-200"
                >
                  <WhatsAppIcon />
                </a>
                <a
                  href={`https://instagram.com/${INSTAGRAM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 rounded-xl flex items-center justify-center text-white/60 hover:text-pink-400 transition-all duration-200"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Navegação</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Início', href: '#inicio' },
                  { label: 'Serviços', href: '#servicos' },
                  { label: 'Upgrades e Peças', href: '#upgrades' },
                  { label: 'Por que Nos Escolher', href: '#diferenciais' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-[#4FD1C5] text-sm transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#4FD1C5]/50 group-hover:bg-[#4FD1C5] transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contato</h4>
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl flex items-center justify-center text-[#25D366] flex-shrink-0 group-hover:bg-[#25D366]/30 transition-colors">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">WhatsApp</div>
                    <div className="text-white font-semibold text-sm group-hover:text-[#4FD1C5] transition-colors">(31) 97522-1824</div>
                  </div>
                </a>

                <a
                  href={`https://instagram.com/${INSTAGRAM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 flex-shrink-0 group-hover:bg-pink-500/20 transition-colors">
                    <InstagramIcon />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">Instagram</div>
                    <div className="text-white font-semibold text-sm group-hover:text-pink-400 transition-colors">@{INSTAGRAM}</div>
                  </div>
                </a>
              </div>

              {/* Big CTA */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 bg-gradient-to-r from-[#19A3B0] to-[#25D366] text-white font-bold text-sm px-5 py-3 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg shadow-cyan-900/30"
              >
                <WhatsAppIcon />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} Infor Manutenções · Todos os direitos reservados
            </p>
            <p className="text-white/20 text-xs">
              Ouro Branco · MG · Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}
