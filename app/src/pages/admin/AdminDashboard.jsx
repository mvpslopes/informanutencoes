import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiUrl } from '../../config.js'
import { apiGet, apiPostJson, apiPostForm } from '../../lib/api.js'
import { GA_MEASUREMENT_ID } from '../../analytics.js'

const TABS = [
  { id: 'produtos', label: 'Produtos', icon: BoxIcon },
  { id: 'comentarios', label: 'Comentários', icon: ChatIcon },
  { id: 'analytics', label: 'Analytics', icon: ChartIcon },
  { id: 'usuarios', label: 'Usuários', icon: UsersIcon, rootOnly: true },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('produtos')
  const [products, setProducts] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [commentFilter, setCommentFilter] = useState('pending')
  const [gaRange, setGaRange] = useState('7d')
  const [gaReport, setGaReport] = useState(null)
  const [gaLoading, setGaLoading] = useState(false)
  const [gaError, setGaError] = useState(null)

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'admin',
    full_name: '',
  })

  const [productForm, setProductForm] = useState({
    category: '',
    name: '',
    description: '',
    price_display: '',
    price_decimal: '',
    image_path: '',
    tag: '',
    tag_color: '',
    img_position: 'center center',
    sort_order: 0,
    is_active: 1,
  })

  useEffect(() => {
    fetch(apiUrl('me.php'), { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok || !d.user) {
          navigate('/admin', { replace: true })
          return
        }
        setUser(d.user)
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const logout = useCallback(async () => {
    await fetch(apiUrl('logout.php'), { credentials: 'include', method: 'POST' })
    navigate('/admin', { replace: true })
  }, [navigate])

  async function loadProducts() {
    const d = await apiGet('admin_products.php')
    if (d.ok) setProducts(d.products || [])
  }

  async function loadComments() {
    const d = await apiGet(`admin_comments.php?status=${commentFilter}`)
    if (d.ok) setComments(d.comments || [])
  }

  async function loadUsers() {
    const d = await apiGet('admin_users.php')
    if (d.ok) setUsers(d.users || [])
  }

  useEffect(() => {
    if (!user) return
    if (tab === 'produtos') loadProducts()
    if (tab === 'usuarios' && user.role === 'root') loadUsers()
  }, [tab, user])

  useEffect(() => {
    if (!user || tab !== 'comentarios') return
    loadComments()
  }, [tab, user, commentFilter])

  const loadGaReport = useCallback(async () => {
    setGaLoading(true)
    setGaError(null)
    try {
      const d = await apiGet(`admin_ga_report.php?range=${gaRange}`)
      if (!d.ok && d.configured === false) {
        setGaReport(null)
        setGaError({ type: 'setup', message: d.error || 'GA4 não configurado no servidor.' })
      } else if (!d.ok) {
        setGaReport(null)
        setGaError({ type: 'error', message: d.error || 'Erro ao consultar o GA4.' })
      } else {
        setGaReport(d)
      }
    } catch {
      setGaReport(null)
      setGaError({ type: 'error', message: 'Não foi possível carregar o relatório.' })
    } finally {
      setGaLoading(false)
    }
  }, [gaRange])

  useEffect(() => {
    if (!user || tab !== 'analytics') return
    loadGaReport()
  }, [tab, user, loadGaReport])

  async function moderate(id, action) {
    const d = await apiPostJson('admin_comments.php', { id, action })
    if (d.ok) loadComments()
    else alert(d.error || 'Erro')
  }

  async function deleteComment(id) {
    if (!confirm('Excluir este comentário permanentemente? Ele deixa de existir no banco e some do site.')) return
    const r = await fetch(apiUrl(`admin_comments.php?id=${id}`), {
      method: 'DELETE',
      credentials: 'include',
    })
    const d = await r.json()
    if (d.ok) loadComments()
    else alert(d.error || 'Erro')
  }

  async function deleteProduct(id) {
    if (!confirm('Excluir este produto?')) return
    const r = await fetch(apiUrl(`admin_products.php?id=${id}`), {
      method: 'DELETE',
      credentials: 'include',
    })
    const d = await r.json()
    if (d.ok) loadProducts()
    else alert(d.error || 'Erro')
  }

  async function handleProductImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const d = await apiPostForm('admin_product_image.php', fd)
      if (d.ok && d.path) {
        setProductForm((f) => ({ ...f, image_path: d.path }))
      } else {
        alert(d.error || 'Falha no upload')
      }
    } catch {
      alert('Erro ao enviar imagem.')
    } finally {
      setUploadingImg(false)
      e.target.value = ''
    }
  }

  async function saveProduct(e) {
    e.preventDefault()
    const body = {
      ...productForm,
      price_decimal: parseFloat(productForm.price_decimal) || 0,
      sort_order: parseInt(productForm.sort_order, 10) || 0,
      is_active: productForm.is_active ? 1 : 0,
    }
    const d = await apiPostJson('admin_products.php', body)
    if (d.ok) {
      setProductForm({
        category: '',
        name: '',
        description: '',
        price_display: '',
        price_decimal: '',
        image_path: '',
        tag: '',
        tag_color: '',
        img_position: 'center center',
        sort_order: 0,
        is_active: 1,
      })
      loadProducts()
    } else alert(d.error || 'Erro')
  }

  async function createUser(e) {
    e.preventDefault()
    const d = await apiPostJson('admin_users.php', newUser)
    if (d.ok) {
      setNewUser({ username: '', password: '', role: 'admin', full_name: '' })
      loadUsers()
    } else alert(d.error || 'Erro')
  }

  function selectTab(t) {
    setTab(t)
    setSidebarOpen(false)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-300 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(56,189,248,0.12),transparent)]" />
        <div className="relative flex flex-col items-center gap-5">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 to-violet-500/30 blur-md" />
            <div className="relative h-12 w-12 rounded-full border-2 border-transparent border-t-cyan-400 border-r-violet-400/80 animate-spin" />
          </div>
          <p className="text-sm font-medium tracking-wide text-slate-500">Carregando painel…</p>
        </div>
      </div>
    )
  }

  const visibleTabs = TABS.filter((t) => !t.rootOnly || user.role === 'root')

  return (
    <div className="admin-dash-root min-h-screen flex text-slate-200 [color-scheme:dark] relative overflow-hidden">
      {/* Ambiente visual */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-15%,rgba(34,211,238,0.14),transparent_55%)]" />
        <div className="absolute top-[15%] -right-32 h-[420px] w-[420px] rounded-full bg-violet-600/[0.11] blur-[100px]" />
        <div className="absolute -bottom-20 left-[10%] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.09] blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#020617]/70 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="relative z-10 flex min-h-screen w-full">
        {/* Sidebar */}
        <aside
          className={`admin-sidebar fixed z-50 inset-y-0 left-0 w-[292px] flex flex-col border-r border-white/[0.06] bg-slate-950/55 backdrop-blur-2xl shadow-[8px_0_40px_-12px_rgba(0,0,0,0.65)] transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400/90 via-blue-500/80 to-violet-500/70 opacity-90" aria-hidden />

          <div className="p-7 border-b border-white/[0.06]">
            <div className="mx-auto flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 blur-xl opacity-80" />
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 shadow-inner">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="relative h-11 w-auto max-w-[150px] object-contain brightness-0 invert opacity-95"
                  />
                </div>
              </div>
              <div>
                <p className="admin-gradient-badge text-[10px] font-bold uppercase tracking-[0.35em] text-center">
                  Painel interno
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {visibleTabs.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTab(t.id)}
                  className={`group w-full flex items-center gap-3.5 rounded-2xl px-3.5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-violet-600/10 text-white shadow-[0_0_28px_-8px_rgba(34,211,238,0.45)] ring-1 ring-cyan-400/25'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                      active
                        ? 'bg-gradient-to-br from-cyan-500/40 to-violet-600/30 text-white shadow-lg'
                        : 'bg-slate-800/80 text-slate-500 group-hover:text-cyan-300/90'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-left tracking-tight">{t.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/[0.06] space-y-3 bg-gradient-to-t from-slate-950/80 to-transparent">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-800/90 to-slate-900/90 px-4 py-3.5 shadow-inner">
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Sessão ativa</p>
              <p className="font-bold text-white truncate mt-1 tracking-tight">{user.username}</p>
              <p className="text-xs mt-1 inline-flex items-center rounded-md bg-cyan-500/15 px-2 py-0.5 font-semibold capitalize text-cyan-300 ring-1 ring-cyan-400/20">
                {user.role}
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-slate-200 hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all"
            >
              <ExternalIcon className="w-4 h-4 text-cyan-400/80" />
              Ver site público
            </Link>
            <button
              type="button"
              onClick={logout}
              className="w-full py-3 rounded-2xl border border-red-500/25 bg-red-950/30 text-red-300/95 text-sm font-bold hover:bg-red-950/55 hover:border-red-400/35 transition-all"
            >
              Sair
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex items-center gap-4 px-5 py-5 border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-xl">
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-xl border border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:border-cyan-500/25 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 mb-1">Infor · Console</p>
              <h1 className="text-xl md:text-2xl font-black tracking-tight admin-gradient-title leading-tight">
                {tab === 'produtos' && 'Produtos no site'}
                {tab === 'comentarios' && 'Moderação de avaliações'}
                {tab === 'analytics' && 'Google Analytics'}
                {tab === 'usuarios' && 'Usuários do painel'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {tab === 'analytics'
                  ? 'Tag GA4 no site e acesso aos relatórios no Google.'
                  : 'Controle catálogo, avaliações e acessos em um só lugar.'}
              </p>
            </div>
          </header>

        <main className={`flex-1 p-4 md:p-8 w-full mx-auto ${tab === 'analytics' ? 'max-w-6xl' : 'max-w-5xl'}`}>
          {tab === 'produtos' && (
            <div className="space-y-8">
              <div className="admin-panel p-6 md:p-8 backdrop-blur-sm">
                <h2 className="text-lg font-black text-white mb-1 flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-violet-600/20 text-cyan-200 border border-cyan-400/25 shadow-[0_0_20px_-6px_rgba(34,211,238,0.45)]">
                    <PlusIcon className="w-4 h-4" />
                  </span>
                  Novo produto
                </h2>
                <p className="text-sm text-slate-400 mb-6">Cadastre peças com foto, preço e tags para a seção Upgrades.</p>

                <form onSubmit={saveProduct} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Categoria">
                      <input
                        required
                        placeholder="Ex.: SSDs"
                        value={productForm.category}
                        onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Nome">
                      <input
                        required
                        placeholder="Nome do produto"
                        value={productForm.name}
                        onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Preço exibido">
                      <input
                        placeholder="Ex.: R$ 199"
                        value={productForm.price_display}
                        onChange={(e) => setProductForm((f) => ({ ...f, price_display: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Valor (número)">
                      <input
                        required
                        type="number"
                        step="0.01"
                        placeholder="199.00"
                        value={productForm.price_decimal}
                        onChange={(e) => setProductForm((f) => ({ ...f, price_decimal: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                  </div>

                  <div className="rounded-xl border border-dashed border-cyan-500/25 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-5 shadow-inner ring-1 ring-white/[0.04]">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Imagem do produto</p>
                    <div className="flex flex-col md:flex-row gap-4 md:items-start">
                      <div className="flex-1 flex flex-col min-w-0">
                        <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600/25 via-blue-600/20 to-violet-600/20 border border-cyan-400/30 text-cyan-100 font-semibold text-sm cursor-pointer hover:from-cyan-500/35 hover:to-violet-500/25 transition-all shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)]">
                          <ImageIcon className="w-5 h-5" />
                          {uploadingImg ? 'Enviando…' : 'Enviar foto (JPG, PNG ou WebP)'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={uploadingImg}
                            onChange={handleProductImageFile}
                          />
                        </label>
                        <p className="text-[11px] text-slate-500 mt-2">Máx. 2 MB. A imagem será salva em /api/uploads/products/</p>
                      </div>
                      {productForm.image_path && (
                        <div className="shrink-0 w-full md:w-40 h-28 rounded-xl overflow-hidden border border-slate-600 bg-slate-900/50">
                          <img
                            src={productForm.image_path}
                            alt="Prévia"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <Field label="Ou cole a URL / caminho da imagem" className="mt-4">
                      <input
                        required
                        placeholder="/ssd-m2.png ou https://..."
                        value={productForm.image_path}
                        onChange={(e) => setProductForm((f) => ({ ...f, image_path: e.target.value }))}
                        className="admin-input mt-1"
                      />
                    </Field>
                  </div>

                  <Field label="Descrição">
                    <textarea
                      placeholder="Descrição curta para o card"
                      value={productForm.description}
                      onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                      className="admin-input min-h-[88px]"
                      rows={3}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Tag (opcional)">
                      <input
                        placeholder="Ex.: M.2"
                        value={productForm.tag}
                        onChange={(e) => setProductForm((f) => ({ ...f, tag: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Cor da tag (#hex)">
                      <input
                        placeholder="#19A3B0"
                        value={productForm.tag_color}
                        onChange={(e) => setProductForm((f) => ({ ...f, tag_color: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Posição da imagem (object-position)">
                      <input
                        placeholder="center center"
                        value={productForm.img_position}
                        onChange={(e) => setProductForm((f) => ({ ...f, img_position: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Ordem">
                      <input
                        type="number"
                        value={productForm.sort_order}
                        onChange={(e) => setProductForm((f) => ({ ...f, sort_order: e.target.value }))}
                        className="admin-input"
                      />
                    </Field>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!productForm.is_active}
                      onChange={(e) => setProductForm((f) => ({ ...f, is_active: e.target.checked ? 1 : 0 }))}
                      className="rounded border-cyan-500/40 bg-slate-900 text-cyan-400 focus:ring-cyan-500/40"
                    />
                    Produto ativo no site
                  </label>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white font-bold shadow-[0_12px_40px_-12px_rgba(34,211,238,0.45)] ring-1 ring-white/10 hover:brightness-110 transition-all"
                  >
                    Cadastrar produto
                  </button>
                </form>
              </div>

              <div className="admin-panel overflow-hidden">
                <div className="px-4 py-3.5 border-b border-white/[0.06] bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90">
                  <h3 className="font-bold text-slate-100 text-sm tracking-tight">Lista de produtos</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-slate-400 text-xs uppercase tracking-wider bg-slate-950/40">
                      <tr>
                        <th className="p-3">Foto</th>
                        <th className="p-3">ID</th>
                        <th className="p-3">Nome</th>
                        <th className="p-3">Preço</th>
                        <th className="p-3">Ativo</th>
                        <th className="p-3 w-24" />
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-t border-white/[0.05] hover:bg-gradient-to-r hover:from-cyan-500/[0.04] hover:to-transparent transition-colors">
                          <td className="p-3">
                            <div className="h-12 w-14 rounded-lg overflow-hidden bg-slate-900/80 border border-slate-600/60">
                              {p.image_path ? (
                                <img
                                  src={p.image_path}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <span className="text-[10px] text-slate-500">—</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-slate-500">{p.id}</td>
                          <td className="p-3 font-medium text-slate-100">{p.name}</td>
                          <td className="p-3 font-semibold bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">{p.price_display}</td>
                          <td className="p-3 text-slate-300">{p.is_active ? 'Sim' : 'Não'}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => deleteProduct(p.id)}
                              className="text-red-400 font-semibold hover:text-red-300 text-xs"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'comentarios' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'pending', label: 'Pendentes' },
                  { id: 'approved', label: 'No site' },
                  { id: 'rejected', label: 'Rejeitados' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCommentFilter(opt.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      commentFilter === opt.id
                        ? 'bg-gradient-to-r from-cyan-600/30 to-violet-600/25 text-white ring-1 ring-cyan-400/30 shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)]'
                        : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {comments.length === 0 && (
                <p className="text-slate-500 text-center py-14 px-6 border border-dashed border-cyan-500/20 rounded-2xl bg-gradient-to-b from-slate-900/50 to-slate-950/80 ring-1 ring-white/[0.04]">
                  {commentFilter === 'pending' && 'Nenhum comentário pendente.'}
                  {commentFilter === 'approved' && 'Nenhum comentário publicado no site.'}
                  {commentFilter === 'rejected' && 'Nenhum comentário rejeitado.'}
                </p>
              )}
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="admin-panel p-5 md:p-6 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap gap-4 mb-4">
                    {c.author_photo_path ? (
                      <img
                        src={c.author_photo_path}
                        alt=""
                        className="h-14 w-14 rounded-full object-cover border-2 border-slate-600 shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0 border border-cyan-500/20">
                        {c.author_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 gap-y-1">
                        <strong className="text-white">{c.author_name}</strong>
                        <span className="text-amber-400 text-sm">{'★'.repeat(Number(c.rating) || 0)}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        {c.created_at ? new Date(c.created_at).toLocaleString('pt-BR') : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-5">{c.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {commentFilter === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => moderate(c.id, 'approve')}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-[0_8px_28px_-10px_rgba(16,185,129,0.55)] ring-1 ring-white/10 hover:brightness-110 transition-all"
                        >
                          Aprovar
                        </button>
                        <button
                          type="button"
                          onClick={() => moderate(c.id, 'reject')}
                          className="px-5 py-2.5 rounded-xl bg-slate-800/90 border border-white/10 hover:border-rose-500/30 hover:bg-slate-700/90 text-slate-200 text-sm font-bold transition-colors"
                        >
                          Rejeitar
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteComment(c.id)}
                      className="px-5 py-2.5 rounded-xl border border-red-500/35 bg-red-950/35 text-red-200 text-sm font-bold hover:bg-red-950/60 hover:border-red-400/40 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'today', label: 'Hoje' },
                    { id: '7d', label: '7 dias' },
                    { id: '30d', label: '30 dias' },
                    { id: '90d', label: '90 dias' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGaRange(opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        gaRange === opt.id
                          ? 'bg-gradient-to-r from-cyan-600/35 to-violet-600/30 text-white ring-1 ring-cyan-400/30'
                          : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => loadGaReport()}
                  disabled={gaLoading}
                  className="text-xs font-bold text-cyan-400/90 hover:text-cyan-300 disabled:opacity-50"
                >
                  {gaLoading ? 'Atualizando…' : 'Atualizar'}
                </button>
              </div>

              {gaLoading && !gaReport && (
                <p className="text-slate-500 text-sm py-8 text-center">Carregando dados do GA4…</p>
              )}

              {gaError?.type === 'setup' && (
                <div className="admin-panel p-6 md:p-8 space-y-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <ChartIcon className="h-6 w-6 text-cyan-400" />
                    Configurar relatório no servidor
                  </h2>
                  <p className="text-sm text-slate-400">{gaError.message}</p>
                  <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                    <li>No Google Cloud, ative a API “Google Analytics Data API”.</li>
                    <li>Crie uma conta de serviço, baixe o JSON e coloque em <code className="text-cyan-300">api/ga-service-account.json</code> (não commite no Git).</li>
                    <li>No GA4: Admin → Acesso à propriedade → adicione o e-mail da conta de serviço como <strong>Leitor</strong>.</li>
                    <li>
                      Em <code className="text-cyan-300">config.php</code> defina o ID numérico da propriedade (Admin → Detalhes da propriedade) em{' '}
                      <code className="text-cyan-300">ga4.property_id</code> e o caminho do JSON em <code className="text-cyan-300">ga4.credentials_json</code>.
                    </li>
                  </ol>
                  <dl className="grid sm:grid-cols-2 gap-3 text-sm pt-2">
                    <div className="rounded-xl border border-white/[0.08] bg-slate-950/40 px-4 py-3">
                      <dt className="text-[10px] font-bold uppercase text-slate-500">ID da métrica (site)</dt>
                      <dd className="font-mono text-xs text-slate-200 mt-1">{GA_MEASUREMENT_ID}</dd>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-slate-950/40 px-4 py-3">
                      <dt className="text-[10px] font-bold uppercase text-slate-500">Fluxo</dt>
                      <dd className="text-slate-200 mt-1">Informanutencoes · informanutencoes.com.br</dd>
                    </div>
                  </dl>
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 text-sm font-bold hover:underline"
                  >
                    <ExternalIcon className="w-4 h-4" />
                    Abrir Google Analytics (web)
                  </a>
                </div>
              )}

              {gaError?.type === 'error' && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{gaError.message}</div>
              )}

              {gaReport?.ok && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <GaStat label="Online agora" value={gaReport.summary.realtimeActiveUsers} accent />
                    <GaStat label="Visitantes únicos" value={gaReport.summary.activeUsers} />
                    <GaStat label="Visitas totais" value={gaReport.summary.sessions} />
                    <GaStat label="Visualizações" value={gaReport.summary.screenPageViews} />
                    <GaStat label="Novos usuários" value={gaReport.summary.newUsers} />
                    <GaStat label="Média sessões / visitante" value={gaReport.summary.avgSessionsPerUser} decimals />
                    <GaStat label="Taxa de rejeição" value={gaReport.summary.bounceRate != null ? `${gaReport.summary.bounceRate}%` : '—'} raw />
                    <GaStat
                      label="Duração média da sessão"
                      value={formatGaDuration(gaReport.summary.averageSessionDuration)}
                      raw
                    />
                    <GaStat label="Interações (eventos)" value={gaReport.summary.eventCount} />
                    <GaStat
                      label="Taxa de conversão (sessão)"
                      value={
                        gaReport.summary.sessionConversionRate != null ? `${gaReport.summary.sessionConversionRate}%` : '—'
                      }
                      raw
                    />
                  </div>

                  <div className="admin-panel p-5 md:p-6">
                    <h3 className="text-sm font-black text-white mb-4">Informanutencoes · {gaReport.flowUrl || 'https://informanutencoes.com.br'}</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Propriedade GA4 #{gaReport.propertyId} · {gaReport.measurementId || GA_MEASUREMENT_ID}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="https://analytics.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] border border-white/10"
                      >
                        <ExternalIcon className="w-3.5 h-3.5" />
                        Abrir no Google Analytics
                      </a>
                    </div>
                  </div>

                  <div className="admin-panel p-5 md:p-6">
                    <h3 className="text-sm font-black text-white mb-4">Visitantes ao longo do tempo</h3>
                    <GaBarChart
                      rows={gaReport.byDay || []}
                      valueKey="activeUsers"
                      labelKey="label"
                      color="from-cyan-500/80 to-cyan-600/40"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="admin-panel p-5 md:p-6">
                      <h3 className="text-sm font-black text-white mb-4">Horários de pico (sessões por hora)</h3>
                      <GaBarChart
                        rows={(gaReport.peakHours || []).map((h) => ({
                          label: h.label,
                          v: h.sessions,
                        }))}
                        valueKey="v"
                        labelKey="label"
                        color="from-violet-500/80 to-violet-700/40"
                      />
                    </div>
                    <div className="admin-panel p-5 md:p-6">
                      <h3 className="text-sm font-black text-white mb-4">Atividade por dia da semana</h3>
                      <GaBarChart
                        rows={(gaReport.weekday || []).map((w) => ({
                          label: w.label,
                          v: w.sessions,
                        }))}
                        valueKey="v"
                        labelKey="label"
                        color="from-emerald-500/80 to-emerald-700/40"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <GaTable title="Dispositivos" rows={gaReport.devices} valueKey="sessions" />
                    <GaTable title="Origem do tráfego" rows={gaReport.channels} valueKey="sessions" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <GaTable title="Acessos por país" rows={gaReport.countries} valueKey="sessions" />
                    <GaTable title="Acessos por cidade" rows={gaReport.cities} valueKey="sessions" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <GaTable title="Navegadores" rows={gaReport.browsers} valueKey="sessions" />
                    <GaTable title="Sistemas operacionais" rows={gaReport.operatingSystems} valueKey="sessions" />
                  </div>

                  <div className="admin-panel p-5 md:p-6">
                    <h3 className="text-sm font-black text-white mb-4">Eventos (interações)</h3>
                    <GaTable title="" rows={gaReport.topEvents} valueKey="count" labelHeader="Evento" />
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'usuarios' && user.role === 'root' && (
            <div className="space-y-8">
              <div className="admin-panel p-6 md:p-8 backdrop-blur-sm max-w-lg">
                <h2 className="text-lg font-black admin-gradient-title mb-6">Novo usuário</h2>
                <form onSubmit={createUser} className="space-y-4">
                  <Field label="Usuário">
                    <input
                      required
                      value={newUser.username}
                      onChange={(e) => setNewUser((u) => ({ ...u, username: e.target.value }))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Senha (mín. 8 caracteres)">
                    <input
                      required
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Perfil">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser((u) => ({ ...u, role: e.target.value }))}
                      className="admin-input"
                    >
                      <option value="admin">Administrador</option>
                      <option value="root">Root</option>
                    </select>
                  </Field>
                  <Field label="Nome completo (opcional)">
                    <input
                      value={newUser.full_name}
                      onChange={(e) => setNewUser((u) => ({ ...u, full_name: e.target.value }))}
                      className="admin-input"
                    />
                  </Field>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white font-bold hover:brightness-110 transition-all shadow-[0_12px_40px_-12px_rgba(34,211,238,0.4)] ring-1 ring-white/10"
                  >
                    Criar usuário
                  </button>
                </form>
              </div>

              <div className="admin-panel overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/[0.06] bg-slate-950/40">
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Usuário</th>
                      <th className="p-3 text-left">Perfil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-white/[0.05] hover:bg-gradient-to-r hover:from-violet-500/[0.05] hover:to-transparent transition-colors">
                        <td className="p-3 text-slate-500">{u.id}</td>
                        <td className="p-3 text-slate-100 font-medium">{u.username}</td>
                        <td className="p-3 capitalize font-medium bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>

      <style>{`
        .admin-dash-root {
          background: linear-gradient(168deg, #020617 0%, #0a0f1e 35%, #0f172a 100%);
        }
        .admin-gradient-title {
          background: linear-gradient(115deg, #f0f9ff 0%, #38bdf8 42%, #a78bfa 88%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .admin-gradient-badge {
          background: linear-gradient(90deg, rgba(34,211,238,0.9), rgba(96,165,250,0.85), rgba(167,139,250,0.9));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .admin-panel {
          position: relative;
          border-radius: 1.25rem;
          background: linear-gradient(155deg, rgba(30, 41, 59, 0.72) 0%, rgba(15, 23, 42, 0.92) 55%, rgba(15, 23, 42, 0.96) 100%);
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow:
            0 0 0 1px rgba(56, 189, 248, 0.04),
            0 28px 56px -16px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
        }
        .admin-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 2rem;
          right: 2rem;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.55), rgba(59, 130, 246, 0.45), rgba(167, 139, 250, 0.4), transparent);
          opacity: 0.95;
          pointer-events: none;
        }
        .admin-panel > * {
          position: relative;
          z-index: 1;
        }
        .admin-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(71 85 105);
          background: rgb(15 23 42 / 0.75);
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .admin-input::placeholder { color: #94a3b8; }
        .admin-input:focus {
          border-color: rgba(34, 211, 238, 0.55);
          box-shadow:
            0 0 0 3px rgba(34, 211, 238, 0.12),
            0 0 24px -8px rgba(167, 139, 250, 0.25);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function formatGaDuration(sec) {
  if (sec == null || Number.isNaN(Number(sec))) return '—'
  const s = Math.round(Number(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return m > 0 ? `${m}min ${r}s` : `${r}s`
}

function GaStat({ label, value, accent, decimals, raw }) {
  let display = value
  if (value === undefined || value === null) {
    display = '—'
  } else if (!raw) {
    if (decimals && typeof value === 'number') {
      display = value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
    } else if (typeof value === 'number') {
      display = value.toLocaleString('pt-BR')
    }
  }
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        accent
          ? 'border-cyan-500/35 bg-gradient-to-br from-cyan-950/50 to-slate-950/80 shadow-[0_0_24px_-12px_rgba(34,211,238,0.35)]'
          : 'border-white/[0.08] bg-slate-950/40'
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-xl font-black mt-1 tabular-nums ${accent ? 'text-cyan-200' : 'text-white'}`}>{display}</p>
    </div>
  )
}

function GaBarChart({ rows, valueKey, labelKey, color }) {
  if (!rows?.length) {
    return <p className="text-xs text-slate-500">Sem dados no período.</p>
  }
  const nums = rows.map((r) => Number(r[valueKey]) || 0)
  const max = Math.max(...nums, 1)
  const barMaxPx = 112
  return (
    <div className="flex items-end gap-1 sm:gap-1.5 min-h-[140px] overflow-x-auto pb-1">
      {rows.map((r, i) => {
        const v = Number(r[valueKey]) || 0
        const h = max > 0 ? Math.round((v / max) * barMaxPx) : 0
        return (
          <div key={i} className="flex flex-col items-center min-w-[28px] flex-1 max-w-[48px]">
            <span className="text-[10px] text-slate-400 mb-0.5 tabular-nums">{v}</span>
            <div className="w-full flex flex-col justify-end h-[120px]">
              <div
                className={`w-full mx-auto max-w-[40px] rounded-t bg-gradient-to-t ${color}`}
                style={{ height: `${Math.max(h, 3)}px` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 mt-1 text-center leading-tight truncate w-full">{r[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}

function GaTable({ title, rows, valueKey, labelHeader = 'Item' }) {
  if (!rows?.length) {
    return (
      <div className="admin-panel p-5 md:p-6">
        {title ? <h3 className="text-sm font-black text-white mb-4">{title}</h3> : null}
        <p className="text-xs text-slate-500">Sem dados no período.</p>
      </div>
    )
  }
  const max = Math.max(...rows.map((r) => Number(r[valueKey]) || 0), 1)
  return (
    <div className="admin-panel p-5 md:p-6">
      {title ? <h3 className="text-sm font-black text-white mb-4">{title}</h3> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
              <th className="pb-2 pr-2">{labelHeader}</th>
              <th className="pb-2 text-right w-20">Qtd.</th>
              <th className="pb-2 pl-2 hidden sm:table-cell w-1/2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const n = Number(r[valueKey]) || 0
              const pct = max > 0 ? Math.round((n / max) * 100) : 0
              return (
                <tr key={i} className="border-t border-white/[0.04]">
                  <td className="py-2 pr-2 text-slate-200 max-w-[200px] truncate">{r.label}</td>
                  <td className="py-2 text-right text-slate-300 tabular-nums font-semibold">{n.toLocaleString('pt-BR')}</td>
                  <td className="py-2 pl-2 hidden sm:table-cell align-middle">
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-600/70 to-violet-600/50"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function BoxIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function ExternalIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function ImageIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
