const WHATSAPP_NUMBER = '5531975221824'

const services = [
  {
    num: '01',
    accent: '#007BFF',
    icon: <FormatIcon />,
    title: 'Formatação e Otimização',
    description: 'Sistema limpo, atualizado e pronto para usar desde o primeiro dia.',
    items: [
      { label: 'Formatação sem backup', price: 'R$ 100' },
      { label: 'Formatação com backup', price: 'R$ 130' },
    ],
  },
  {
    num: '02',
    accent: '#19A3B0',
    icon: <WrenchIcon />,
    title: 'Manutenção Preventiva',
    description: 'Limpeza interna e troca de pasta térmica para mais vida útil e desempenho.',
    items: [
      { label: 'Preventiva completa', price: 'R$ 90' },
      { label: 'Troca de peças', price: 'R$ 80' },
    ],
  },
  {
    num: '03',
    accent: '#007BFF',
    icon: <ChipIcon />,
    title: 'Reparos Avançados',
    description: 'Diagnóstico profissional em placa-mãe, dobradiças e componentes internos.',
    items: [
      { label: 'Consultar via WhatsApp', price: 'Sob consulta' },
    ],
  },
  {
    num: '04',
    accent: '#19A3B0',
    icon: <SoftwareIcon />,
    title: 'Instalações e Configurações',
    description: 'Drivers, programas e configurações corretas, sem erros e sem dor de cabeça.',
    items: [
      { label: 'Pacote de programas', price: 'R$ 70' },
      { label: 'Software específico', price: 'R$ 50' },
      { label: 'Suporte remoto', price: 'R$ 50' },
    ],
  },
]

export default function Servicos() {
  return (
    <section id="servicos" className="relative py-24 bg-white overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#007BFF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#19A3B0]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-[#007BFF] to-[#19A3B0]" />
              <span className="text-[#19A3B0] font-semibold text-sm uppercase tracking-widest">O que fazemos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Nossos{' '}
              <span className="gradient-text">Serviços</span>
            </h2>
          </div>
          <p className="text-gray-500 text-base max-w-xs md:text-right leading-relaxed">
            Soluções completas para notebook e computador com qualidade, rapidez e preço justo.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.num}
              className="group relative bg-white rounded-3xl p-7 border border-gray-100 shadow-sm card-hover overflow-hidden"
            >
              {/* Accent top border */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-all duration-300 group-hover:h-1.5"
                style={{ background: `linear-gradient(90deg, ${service.accent}, ${service.accent}99)` }}
              />

              {/* Background number */}
              <div
                className="absolute -right-4 -top-4 text-[7rem] font-black leading-none select-none pointer-events-none transition-all duration-300 group-hover:scale-110"
                style={{ color: `${service.accent}08` }}
              >
                {service.num}
              </div>

              <div className="relative">
                {/* Icon + number */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${service.accent}15` }}
                  >
                    {service.icon}
                  </div>
                  <span
                    className="text-xs font-black tracking-widest px-3 py-1 rounded-full"
                    style={{ background: `${service.accent}10`, color: service.accent }}
                  >
                    {service.num}
                  </span>
                </div>

                <h3
                  className="text-xl font-black mb-2 transition-colors duration-200"
                  style={{ color: service.accent }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.description}</p>

                {/* Price list */}
                <div className="space-y-2 border-t border-gray-50 pt-4">
                  {service.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.accent }} />
                        <span className="text-gray-700 text-sm">{item.label}</span>
                      </div>
                      <span className="font-black text-sm" style={{ color: service.accent }}>
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e gostaria de saber mais sobre os serviços.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-r from-[#007BFF] to-[#19A3B0] text-white font-bold text-base px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <WhatsAppIcon />
            Solicitar Orçamento Grátis
          </a>
          <p className="text-gray-400 text-sm">Respondemos em menos de 1 hora</p>
        </div>
      </div>
    </section>
  )
}

function FormatIcon() {
  return (
    <svg className="w-6 h-6" style={{ color: '#007BFF' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg className="w-6 h-6" style={{ color: '#19A3B0' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  )
}

function ChipIcon() {
  return (
    <svg className="w-6 h-6" style={{ color: '#007BFF' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  )
}

function SoftwareIcon() {
  return (
    <svg className="w-6 h-6" style={{ color: '#19A3B0' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
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
