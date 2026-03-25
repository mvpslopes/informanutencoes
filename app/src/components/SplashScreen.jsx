import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter') // enter | hold | exit

  const EXIT_MS = 2200
  const FADE_MS = 700

  useEffect(() => {
    const startExit = setTimeout(() => setPhase('exit'), EXIT_MS)
    const removeSplash = setTimeout(() => onFinish(), EXIT_MS + FADE_MS)
    return () => {
      clearTimeout(startExit)
      clearTimeout(removeSplash)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #001e3c 0%, #003366 50%, #005a8e 100%)' }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#19A3B0]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#007BFF]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div
        className={`relative flex flex-col items-center gap-8 transition-all duration-700 ${
          phase === 'enter' ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}
        style={{ transitionDelay: phase === 'enter' ? '100ms' : '0ms' }}
        ref={(el) => {
          if (el && phase === 'enter') {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                el.classList.remove('opacity-0', 'scale-90', 'translate-y-4')
              })
            })
          }
        }}
      >
        {/* Logo */}
        <div className="relative">
          {/* Glow ring */}
          <div className="absolute -inset-6 rounded-full bg-[#19A3B0]/20 blur-xl animate-pulse" />
          <img
            src="/logo.png"
            alt="Infor Manutenções"
            className="relative h-44 w-auto brightness-0 invert drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <div className="text-center">
          <p className="text-white/50 text-sm uppercase tracking-[0.3em] font-medium">
            Assistência Técnica Especializada
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#19A3B0] to-[#4FD1C5]"
            style={{
              animation: 'splash-bar 2s ease-in-out forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splash-bar {
          0%   { width: 0%; opacity: 1; }
          80%  { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
