import { useState } from 'react'
import { useCart } from '../context/CartContext'

const WHATSAPP_NUMBER = '5531975221824'

/** Imagens em alta resolução (Unsplash) — URLs públicas estáveis */
const img = (path, extra = '') =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=900&q=88${extra}`

const products = [
  // Memórias — pentes de RAM
  {
    id: 'ddr4-8',
    category: 'Memórias RAM',
    name: 'Memória DDR4 8GB',
    price: 'R$ 219',
    priceNum: 219,
    tag: 'Popular',
    tagColor: '#25D366',
    image: img('photo-1562976540-1502c2145186', '&h=600'),
    imgPosition: 'center 42%',
    desc: 'Ideal para uso cotidiano e multitarefa',
  },
  {
    id: 'ddr4-16',
    category: 'Memórias RAM',
    name: 'Memória DDR4 16GB',
    price: 'R$ 349',
    priceNum: 349,
    tag: null,
    tagColor: null,
    image: img('photo-1591488320449-011701bb6704', '&h=600'),
    imgPosition: 'center 52%',
    desc: 'Melhor desempenho para edição e jogos',
  },
  {
    id: 'ddr5-8',
    category: 'Memórias RAM',
    name: 'Memória DDR5 8GB',
    price: 'R$ 569',
    priceNum: 569,
    tag: 'Novo',
    tagColor: '#007BFF',
    image: img('photo-1562976540-1502c2145186', '&h=600&sat=-25'),
    imgPosition: 'center 38%',
    desc: 'Tecnologia de última geração DDR5',
  },
  {
    id: 'ddr5-32',
    category: 'Memórias RAM',
    name: 'Memória DDR5 32GB',
    price: 'R$ 997',
    priceNum: 997,
    tag: 'High End',
    tagColor: '#f59e0b',
    image: img('photo-1591488320449-011701bb6704', '&h=600&sat=-20'),
    imgPosition: 'center 48%',
    desc: 'Máximo desempenho para workstations',
  },
  // SSDs — NVMe / armazenamento sólido
  {
    id: 'ssd-128',
    category: 'SSDs',
    name: 'SSD M.2 ou mSATA 128GB',
    price: 'R$ 199',
    priceNum: 199,
    tag: null,
    tagColor: null,
    image: img('photo-1625842268584-8f32962363c0', '&h=600'),
    imgPosition: 'center 48%',
    desc: 'Até 3× mais rápido que HD convencional',
  },
  {
    id: 'ssd-240',
    category: 'SSDs',
    name: 'SSD M.2 ou mSATA 240GB',
    price: 'R$ 329',
    priceNum: 329,
    tag: 'Recomendado',
    tagColor: '#19A3B0',
    image: img('photo-1625842268584-8f32962363c0', '&h=600'),
    imgPosition: '70% 45%',
    desc: 'Melhor custo-benefício para o dia a dia',
  },
  // Componentes
  {
    id: 'jack',
    category: 'Componentes',
    name: 'Jack In / Conector SATA',
    price: 'R$ 30',
    priceNum: 30,
    tag: 'Valor único',
    tagColor: '#6366f1',
    image: img('photo-1544197150-b99a580bb7a8', '&h=600'),
    imgPosition: 'center 55%',
    desc: 'Conector de áudio ou SATA para notebook',
  },
  {
    id: 'camera',
    category: 'Componentes',
    name: 'Câmera Interna',
    price: 'R$ 30',
    priceNum: 30,
    tag: 'Valor único',
    tagColor: '#6366f1',
    image: img('photo-1516035069371-29a1b244cc32', '&h=600'),
    imgPosition: 'center 40%',
    desc: 'Câmera frontal para notebook',
  },
  {
    id: 'flat',
    category: 'Componentes',
    name: 'Jumper / Flat Cable',
    price: 'R$ 30',
    priceNum: 30,
    tag: 'Valor único',
    tagColor: '#6366f1',
    image: img('photo-1518770660439-4636190af475', '&h=600'),
    imgPosition: 'center 45%',
    desc: 'Cabo flat ou jumper para teclado/tela',
  },
]

const categories = ['Todos', 'Memórias RAM', 'SSDs', 'Componentes']

export default function Upgrades() {
  const [activeTab, setActiveTab] = useState('Todos')
  const { addItem } = useCart()
  const [added, setAdded] = useState({})

  const filtered = activeTab === 'Todos' ? products : products.filter((p) => p.category === activeTab)

  function handleAdd(product) {
    addItem(product)
    setAdded((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1500)
  }

  return (
    <section id="upgrades" className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #001e3c 0%, #002d55 50%, #003d6b 100%)' }}
    >
      {/* Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#19A3B0]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#007BFF]/20 rounded-full blur-[80px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#19A3B0]" />
            <span className="text-[#4FD1C5] font-semibold text-sm uppercase tracking-widest">Venda de Peças</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#19A3B0]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Turbine seu Notebook com{' '}
            <span style={{ background: 'linear-gradient(90deg,#4FD1C5,#19A3B0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              nossos Upgrades
            </span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-semibold text-sm px-5 py-2 rounded-full">
            <CheckIcon />
            Instalação profissional já inclusa no valor da peça
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-gradient-to-r from-[#19A3B0] to-[#007BFF] text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              justAdded={added[product.id]}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Infor Manutenções e tenho interesse em upgrade/peças para meu notebook.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-200"
          >
            <WhatsAppIcon />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, onAdd, justAdded }) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: product.imgPosition || 'center center' }}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x208/1e3a5f/4FD1C5?text=Produto'
          }}
        />
        {/* Vinheta suave para destacar o produto */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20"
          aria-hidden
        />
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        {/* Tag */}
        {product.tag && (
          <div className="absolute top-3 right-3">
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
              style={{ background: `${product.tagColor}30`, color: product.tagColor, border: `1px solid ${product.tagColor}50` }}
            >
              {product.tag}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-black text-base leading-tight mb-1">{product.name}</h3>
        <p className="text-white/40 text-xs mb-4 leading-relaxed">{product.desc}</p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[#4FD1C5] font-black text-xl">{product.price}</div>
            <div className="text-white/30 text-[10px] mt-0.5">instalação inclusa</div>
          </div>

          <button
            onClick={() => onAdd(product)}
            className={`flex items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
              justAdded
                ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 scale-95'
                : 'bg-gradient-to-r from-[#19A3B0] to-[#007BFF] text-white hover:scale-105 shadow-lg shadow-cyan-900/40'
            }`}
          >
            {justAdded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Adicionado
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
