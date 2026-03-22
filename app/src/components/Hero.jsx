const WHATSAPP_NUMBER = '5531975221824'
const WHATSAPP_MSG = encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e gostaria de solicitar um orçamento gratuito.')

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen hero-bg overflow-hidden flex items-center">

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#19A3B0]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#007BFF]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-[#19A3B0]/30 to-transparent pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-28 grid md:grid-cols-2 gap-12 items-center w-full">

        {/* Left — texto */}
        <div className="order-2 md:order-1 fade-in-up">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#4FD1C5] font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-[#4FD1C5] rounded-full animate-pulse-slow" />
            Ouro Branco e Região · MG
          </div>

          <h1 className="text-4xl md:text-[3.2rem] font-black text-white leading-[1.1] mb-6 tracking-tight">
            Sua Assistência<br />
            Técnica{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(90deg, #4FD1C5, #19A3B0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Especializada
            </span>
          </h1>

          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
            Mais de <span className="text-white font-bold">20 anos de experiência</span> cuidando do seu notebook ou computador.{' '}
            <span className="text-[#4FD1C5] font-semibold">Buscamos e entregamos</span> seu equipamento em até{' '}
            <span className="text-white font-bold">24h</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-r from-[#19A3B0] to-[#25D366] text-white font-bold text-base px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#19A3B0]/40 hover:shadow-[#19A3B0]/60 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
              Solicitar Orçamento Grátis
            </a>
            <a
              href="#servicos"
              className="border border-white/30 text-white/90 font-semibold text-base px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              Ver Serviços
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '20+', label: 'Anos de Mercado', color: '#4FD1C5' },
              { value: '24h', label: 'Busca e Entrega', color: '#007BFF' },
              { value: 'R$0', label: 'Orçamento', color: '#4FD1C5' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-white/50 text-xs font-medium leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — foto */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">

            {/* Rotating ring */}
            <div className="absolute -inset-6 rounded-full border border-[#19A3B0]/20 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute -inset-12 rounded-full border border-[#007BFF]/10 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />

            {/* Glow halo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#19A3B0]/40 to-[#007BFF]/40 rounded-3xl blur-2xl scale-110" />

            {/* Photo card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 max-w-sm w-full animate-float">
              <img
                src="/hero.png"
                alt="Thiago - Técnico Especializado"
                className="w-full h-auto object-cover"
              />
              {/* Overlay name tag */}
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,20,50,0.95) 0%, transparent 100%)' }}
              >
                <p className="text-white font-black text-lg">Thiago</p>
                <p className="text-[#4FD1C5] text-sm font-medium">Técnico Especializado · 20+ anos</p>
              </div>
            </div>

            {/* Floating badge - experience */}
            <div className="absolute -top-4 -left-4 bg-[#007BFF] text-white rounded-2xl px-4 py-2 shadow-xl animate-float-delay">
              <div className="text-lg font-black leading-none">20+</div>
              <div className="text-[10px] font-medium opacity-80">Anos</div>
            </div>

            {/* Floating badge - delivery */}
            <div className="absolute -bottom-4 -right-4 bg-white text-[#007BFF] rounded-2xl px-4 py-2 shadow-xl animate-float">
              <div className="text-lg font-black leading-none text-[#19A3B0]">24h</div>
              <div className="text-[10px] font-medium text-gray-500">Entrega</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L60 50C120 40 240 20 360 18C480 16 600 32 720 36C840 40 960 32 1080 26C1200 20 1320 16 1380 14L1440 12V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
