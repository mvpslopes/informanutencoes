import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../config.js'
import { formatDateTimePtBr } from '../lib/dateLocale.js'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAGE = 8

export default function CommentsPage() {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const load = useCallback(async (offset) => {
    const r = await fetch(
      `${apiUrl('public_comments.php')}?limit=${PAGE}&offset=${offset}`
    )
    const d = await r.json()
    if (!d.ok) throw new Error(d.error || 'Erro')
    return d
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const d = await load(0)
        if (!cancelled) {
          setComments(d.comments || [])
          setTotal(d.total ?? 0)
        }
      } catch {
        if (!cancelled) setComments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [load])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const d = await load(comments.length)
      setComments((prev) => [...prev, ...(d.comments || [])])
    } finally {
      setLoadingMore(false)
    }
  }

  const hasMore = comments.length < total

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#007BFF] font-semibold text-sm mb-8 hover:underline"
        >
          ← Voltar ao início
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-[#007BFF] mb-2">Avaliações dos clientes</h1>
        <p className="text-gray-500 mb-10">Comentários aprovados, do mais recente ao mais antigo.</p>

        {loading && <p className="text-gray-400">Carregando…</p>}

        {!loading && comments.length === 0 && (
          <p className="text-gray-500">Ainda não há comentários publicados.</p>
        )}

        <div className="space-y-6">
          {comments.map((c) => (
            <article
              key={c.id}
              className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex gap-4"
            >
              <Avatar src={c.author_photo} name={c.author_name} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{c.author_name}</span>
                  <Stars n={c.rating} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
                {c.created_at && (
                  <p className="text-gray-400 text-xs mt-2">{formatDateTimePtBr(c.created_at)}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        {hasMore && !loading && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="mt-10 w-full py-3 rounded-xl border-2 border-[#19A3B0] text-[#19A3B0] font-bold hover:bg-[#19A3B0] hover:text-white transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Carregando…' : 'Carregar mais'}
          </button>
        )}
      </section>
      <Footer />
    </div>
  )
}

function Avatar({ src, name }) {
  const letter = name?.charAt(0)?.toUpperCase() || '?'
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white shadow"
      />
    )
  }
  return (
    <div className="w-14 h-14 rounded-full bg-[#007BFF] text-white font-black flex items-center justify-center flex-shrink-0 text-lg">
      {letter}
    </div>
  )
}

function Stars({ n }) {
  return (
    <span className="text-amber-400 text-sm" aria-label={`${n} de 5 estrelas`}>
      {'★'.repeat(n)}
      <span className="text-gray-200">{'★'.repeat(5 - n)}</span>
    </span>
  )
}
