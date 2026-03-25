import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiUrl } from '../../config.js'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r = await fetch(apiUrl('login.php'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const text = await r.text()
      let d
      try {
        d = text ? JSON.parse(text) : {}
      } catch {
        setError(
          `O servidor respondeu com erro HTTP ${r.status} (resposta não é JSON). Verifique a pasta api no PHP e os logs de erro da hospedagem.`,
        )
        return
      }
      if (d.ok) {
        navigate('/admin/painel', { replace: true })
      } else {
        setError(d.error || 'Falha no login')
      }
    } catch {
      setError('Sem conexão de rede ou o servidor não respondeu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-14">
      {/* Background */}
      <div className="absolute inset-0 hero-bg" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#19A3B0]/25 blur-[100px]" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-[#007BFF]/20 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-1 shadow-[0_32px_80px_-20px_rgba(0,30,60,0.65)] backdrop-blur-xl">
          <div className="overflow-hidden rounded-[1.85rem] bg-white shadow-2xl">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#007BFF] via-[#0d6fd4] to-[#19A3B0] px-8 pb-10 pt-10 text-center">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 left-1/4 h-24 w-48 rounded-full bg-black/10 blur-xl" />

              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 shadow-inner ring-2 ring-white/25">
                <img src="/logo.png" alt="" className="h-12 w-auto brightness-0 invert" />
              </div>
              <h1 className="relative text-2xl font-black tracking-tight text-white drop-shadow-sm sm:text-[1.65rem]">
                Painel Infor
              </h1>
              <p className="relative mt-2 text-sm font-medium text-white/85">Acesso restrito</p>
              <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                <ShieldIcon className="h-3.5 w-3.5 text-white/90" />
                Área administrativa
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-9 pt-8">
              <div>
                <label htmlFor="admin-user" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <UserIcon className="h-3.5 w-3.5 text-[#007BFF]" />
                  Usuário
                </label>
                <input
                  id="admin-user"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-[#007BFF]/50 focus:bg-white focus:ring-4 focus:ring-[#007BFF]/12"
                  placeholder="Seu usuário"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-pass" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <LockIconSmall className="h-3.5 w-3.5 text-[#19A3B0]" />
                  Senha
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-900 shadow-inner outline-none transition focus:border-[#19A3B0]/50 focus:bg-white focus:ring-4 focus:ring-[#19A3B0]/12"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  <span className="mt-0.5 shrink-0 text-red-500">
                    <AlertIcon className="h-5 w-5" />
                  </span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#007BFF] to-[#19A3B0] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform duration-500 group-hover:translate-x-[100%] group-hover:skew-x-12" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Spinner />
                      Entrando…
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon className="h-4 w-4 opacity-90" />
                      Entrar no painel
                    </>
                  )}
                </span>
              </button>

              <p className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
                <LockIconSmall className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                Sua sessão é protegida por cookies seguros (HTTPS).
              </p>
            </form>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm">
            ←
          </span>
          Voltar ao site
        </Link>
      </div>
    </div>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function AlertIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}

function LockIconSmall({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
