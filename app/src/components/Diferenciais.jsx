const diferenciais = [
  {
    num: '01',
    icon: <TrophyIcon />,
    title: 'Quase 20 Anos de Mercado',
    description: 'Experiência consolidada atendendo milhares de clientes com qualidade e confiança.',
    color: '#007BFF',
  },
  {
    num: '02',
    icon: <TruckIcon />,
    title: 'Busca e Entrega em 24h',
    description: 'Buscamos seu equipamento e devolvemos em até 24 horas na região de Ouro Branco.',
    color: '#19A3B0',
  },
  {
    num: '03',
    icon: <HandshakeIcon />,
    title: 'Orçamento Grátis, Sem Enrolação',
    description: 'Diagnóstico transparente e rápido. Você aprova o valor antes de qualquer serviço.',
    color: '#007BFF',
  },
  {
    num: '04',
    icon: <ShieldIcon />,
    title: 'Serviço com Garantia',
    description: 'Todo serviço realizado com responsabilidade, zelo e compromisso com o resultado.',
    color: '#19A3B0',
  },
]

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="relative py-24 bg-white overflow-hidden">

      {/* Decorative diagonal stripe */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #007BFF 0px, #007BFF 2px, transparent 2px, transparent 40px)',
        }}
      />

      {/* Big bg text */}
      <div className="absolute top-10 left-0 right-0 text-center text-[12rem] font-black text-gray-50 leading-none select-none pointer-events-none overflow-hidden whitespace-nowrap">
        INFOR
      </div>

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#007BFF]" />
            <span className="text-[#007BFF] font-semibold text-sm uppercase tracking-widest">Nossos Diferenciais</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#007BFF]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            Por que{' '}
            <span className="gradient-text">Nos Escolher?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Confiança, agilidade e transparência em cada atendimento.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {diferenciais.map((item) => (
            <div
              key={item.num}
              className="group relative bg-white border border-gray-100 rounded-3xl p-7 shadow-sm card-hover text-center overflow-hidden"
            >
              {/* Background number */}
              <div
                className="absolute -right-2 -top-3 text-[5rem] font-black leading-none select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60"
                style={{ color: `${item.color}08` }}
              >
                {item.num}
              </div>

              {/* Colored bottom border on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl transition-all duration-300 group-hover:h-1"
                style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                    boxShadow: `0 0 0 0 ${item.color}30`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${item.color}30` }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 0 ${item.color}30` }}
                >
                  {item.icon}
                </div>

                {/* Number badge */}
                <div
                  className="inline-block text-xs font-black px-2.5 py-1 rounded-full mb-3 tracking-widest uppercase"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.num}
                </div>

                <h3 className="font-black text-gray-900 text-base mb-2 leading-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-16 rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #001e3c 0%, #003366 60%, #0077a8 100%)' }}
        >
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative text-center md:text-left">
              <p className="text-[#4FD1C5] font-semibold text-sm uppercase tracking-widest mb-2">Pronto para começar?</p>
              <h3 className="text-white font-black text-2xl md:text-3xl">Fale agora e resolva hoje!</h3>
            </div>
            <a
              href={`https://wa.me/5531975221824?text=${encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e gostaria de solicitar um orçamento.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-shrink-0 bg-gradient-to-r from-[#19A3B0] to-[#25D366] text-white font-black text-base px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <WhatsAppIcon />
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrophyIcon() {
  return (
    <svg className="w-8 h-8 text-[#007BFF]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  )
}
function TruckIcon() {
  return (
    <svg className="w-8 h-8 text-[#19A3B0]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )
}
function HandshakeIcon() {
  return (
    <svg className="w-8 h-8 text-[#007BFF]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg className="w-8 h-8 text-[#19A3B0]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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
