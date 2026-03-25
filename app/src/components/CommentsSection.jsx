import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../config.js'
import { formatDateTimePtBr } from '../lib/dateLocale.js'

export default function CommentsSection() {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ author_name: '', rating: 5, body: '' })
  const [photo, setPhoto] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch(`${apiUrl('public_comments.php')}?limit=4&offset=0`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setComments(d.comments || [])
          setTotal(d.total ?? 0)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg(null)
    setSubmitting(true)
    const fd = new FormData()
    fd.append('author_name', form.author_name.trim())
    fd.append('rating', String(form.rating))
    fd.append('body', form.body.trim())
    if (photo) fd.append('photo', photo)

    try {
      const r = await fetch(apiUrl('comment_submit.php'), {
        method: 'POST',
        body: fd,
      })
      const d = await r.json()
      if (d.ok) {
        setMsg({ type: 'ok', text: d.message || 'Enviado com sucesso!' })
        setForm({ author_name: '', rating: 5, body: '' })
        setPhoto(null)
      } else {
        setMsg({ type: 'err', text: d.error || 'Erro ao enviar' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Não foi possível enviar. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="avaliacoes" className="py-20 bg-gradient-to-b from-white to-[#f0fbfc]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#19A3B0]" />
            <span className="text-[#19A3B0] font-semibold text-sm uppercase tracking-widest">Depoimentos</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#19A3B0]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#007BFF] mb-3">O que dizem nossos clientes</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Avaliações reais. Novos comentários passam por moderação antes de aparecerem aqui.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Lista — 4 últimos */}
          <div>
            {loading && <p className="text-gray-400 text-sm">Carregando avaliações…</p>}
            {!loading && comments.length === 0 && (
              <p className="text-gray-500 text-sm">Seja o primeiro a deixar sua avaliação ao lado.</p>
            )}
            <div className="space-y-4">
              {comments.map((c) => (
                <article
                  key={c.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3"
                >
                  {c.author_photo ? (
                    <img
                      src={c.author_photo}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#007BFF]/10 text-[#007BFF] font-bold flex items-center justify-center flex-shrink-0">
                      {c.author_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{c.author_name}</span>
                      <span className="text-amber-400 text-xs">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</span>
                    </div>
                    {c.created_at && (
                      <p className="text-gray-400 text-[11px] mt-0.5">{formatDateTimePtBr(c.created_at)}</p>
                    )}
                    <p className="text-gray-600 text-sm mt-1 line-clamp-4">{c.body}</p>
                  </div>
                </article>
              ))}
            </div>
            {total > 4 && (
              <Link
                to="/comentarios"
                className="inline-block mt-6 text-[#19A3B0] font-bold text-sm hover:underline"
              >
                Ver mais avaliações →
              </Link>
            )}
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-black text-[#007BFF] text-lg mb-4">Deixe sua avaliação</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Seu nome</label>
                <input
                  required
                  maxLength={120}
                  value={form.author_name}
                  onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#19A3B0] focus:border-transparent"
                  placeholder="Como quer ser chamado"
                />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 mb-2">Sua nota</span>
                <StarRatingInput
                  value={form.rating}
                  onChange={(rating) => setForm((f) => ({ ...f, rating }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Comentário</label>
                <textarea
                  required
                  maxLength={5000}
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#19A3B0] focus:border-transparent resize-y"
                  placeholder="Conte como foi seu atendimento…"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Foto de perfil (opcional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="text-sm w-full"
                />
                <p className="text-gray-400 text-xs mt-1">JPG, PNG ou WebP · máx. 2 MB</p>
              </div>
              {msg && (
                <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#19A3B0] to-[#007BFF] text-white font-bold py-3 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Enviando…' : 'Enviar para moderação'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(null)
  const display = hover ?? value

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="radiogroup"
        aria-label="Nota de 1 a 5 estrelas"
        className="flex items-center gap-0.5 sm:gap-1"
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
              className={[
                'p-1 rounded-lg leading-none transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19A3B0] focus-visible:ring-offset-2',
                'hover:scale-110 active:scale-95',
                filled ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200',
              ].join(' ')}
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n)}
            >
              <span className="text-[2rem] sm:text-[2.25rem] leading-none block" aria-hidden>
                ★
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-400">
        {value === 1 ? '1 estrela' : `${value} estrelas`} · clique na estrela para escolher
      </p>
    </div>
  )
}
