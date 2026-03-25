const WHATSAPP_NUMBER = '5531975221824'

const services = [
  {
    num: '01',
    accent: '#007BFF',
    accentSoft: 'rgba(0, 123, 255, 0.12)',
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
    accentSoft: 'rgba(25, 163, 176, 0.14)',
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
    accentSoft: 'rgba(0, 123, 255, 0.12)',
    icon: <ChipIcon />,
    title: 'Reparos Avançados',
    description: 'Diagnóstico profissional em placa-mãe, dobradiças e componentes internos.',
    items: [{ label: 'Consultar via WhatsApp', price: 'Sob consulta' }],
  },
  {
    num: '04',
    accent: '#19A3B0',
    accentSoft: 'rgba(25, 163, 176, 0.14)',
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
    <section id="servicos" className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-[#f8fafc]">

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[8%] right-[-5%] h-[420px] w-[420px] rounded-full bg-[#007BFF]/[0.06] blur-[100px]" />
        <div className="absolute bottom-[5%] left-[-8%] h-[380px] w-[380px] rounded-full bg-[#19A3B0]/[0.07] blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="inline-flex h-9 items-center rounded-full border border-[#19A3B0]/25 bg-white/80 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#19A3B0] shadow-sm backdrop-blur-sm">
                O que fazemos
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 leading-[1.08] tracking-tight">
              Nossos{' '}
              <span className="gradient-text">Serviços</span>
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
              Soluções completas para notebook e computador com qualidade, rapidez e preço justo — com transparência em cada etapa.
            </p>
          </div>
          <div className="lg:max-w-xs lg:text-right">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-md">
              <p className="text-sm font-semibold text-slate-800">Atendimento em Ouro Branco e região</p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Orçamento sem compromisso pelo WhatsApp. Prazos combinados na hora.
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service) => (
            <article key={service.num} className="group relative">
              {/* Gradient frame */}
              <div
                className="absolute -inset-[1px] rounded-[2rem] opacity-80 blur-[1px] transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}45, transparent 55%, ${service.accent}25)`,
                }}
              />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-slate-300/80 group-hover:shadow-[0_28px_60px_-18px_rgba(0,123,255,0.18)]">
                {/* Top gradient strip */}
                <div
                  className="h-1.5 w-full shrink-0"
                  style={{
                    background: `linear-gradient(90deg, ${service.accent}, ${service.accent}99 40%, ${service.accent}66)`,
                  }}
                />

                {/* Inner glow */}
                <div
                  className="pointer-events-none absolute -right-16 top-24 h-48 w-48 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
                  style={{ background: service.accentSoft }}
                />

                <div className="relative flex flex-1 flex-col p-8 pt-7 sm:p-9">
                  {/* Watermark number */}
                  <span
                    className="pointer-events-none absolute right-4 top-6 select-none text-[5.5rem] font-black leading-none tracking-tighter text-slate-100 transition-transform duration-500 group-hover:scale-105 sm:text-[6.5rem] sm:right-5 sm:top-4"
                    aria-hidden
                  >
                    {service.num}
                  </span>

                  <div className="relative mb-6 flex items-start justify-between gap-4">
                    <div className="relative">
                      <div
                        className="absolute -inset-1 rounded-3xl opacity-60 blur-md transition group-hover:opacity-90"
                        style={{ background: service.accentSoft }}
                      />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-white to-slate-50 shadow-lg ring-2 ring-slate-100 transition duration-500 group-hover:shadow-xl group-hover:ring-slate-200/80">
                        <div
                          className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br shadow-inner"
                          style={{
                            background: `linear-gradient(145deg, ${service.accent}18, ${service.accent}08)`,
                          }}
                        >
                          {service.icon}
                        </div>
                      </div>
                    </div>
                    <span
                      className="mt-1 inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-widest"
                      style={{
                        borderColor: `${service.accent}35`,
                        color: service.accent,
                        background: `${service.accent}0d`,
                      }}
                    >
                      Serviço {service.num}
                    </span>
                  </div>

                  <h3
                    className="relative text-xl font-black tracking-tight sm:text-[1.35rem]"
                    style={{ color: service.accent }}
                  >
                    {service.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
                    {service.description}
                  </p>

                  {/* Price list */}
                  <div className="relative mt-8 flex flex-1 flex-col gap-2.5 border-t border-slate-100 pt-7">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Valores
                    </p>
                    {service.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-4 py-3 transition duration-300 hover:border-slate-200 hover:shadow-md"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${service.accent}, ${service.accent}cc)` }}
                          >
                            ✓
                          </span>
                          <span className="truncate text-sm font-medium text-slate-700">{item.label}</span>
                        </div>
                        <span
                          className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-sm font-black tabular-nums shadow-sm ring-1 ring-slate-100"
                          style={{ color: service.accent }}
                        >
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e gostaria de saber mais sobre os serviços.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#19A3B0] px-10 py-4 text-base font-bold text-white shadow-xl shadow-blue-300/40 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-400/35"
          >
            <span className="absolute inset-0 translate-x-[-100%] skew-x-12 bg-white/15 transition-transform duration-500 group-hover:translate-x-[100%]" />
            <WhatsAppIcon />
            Solicitar Orçamento Grátis
          </a>
          <p className="text-center text-sm text-slate-500 sm:text-left">
            Respondemos em <span className="font-semibold text-slate-700">menos de 1 hora</span>
          </p>
        </div>
      </div>
    </section>
  )
}

function FormatIcon() {
  return (
    <svg className="h-7 w-7" style={{ color: '#007BFF' }} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg className="h-7 w-7" style={{ color: '#19A3B0' }} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  )
}

function ChipIcon() {
  return (
    <svg className="h-7 w-7" style={{ color: '#007BFF' }} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  )
}

function SoftwareIcon() {
  return (
    <svg className="h-7 w-7" style={{ color: '#19A3B0' }} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
