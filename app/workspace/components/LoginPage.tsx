'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('ایمیل یا رمز عبور اشتباه است')
    setLoading(false)
  }

  return (
    <div className="flex h-full min-h-0">
      {/* Brand panel */}
      <div
        className="hidden lg:flex lg:w-[48%] flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0c1222 0%, #1a2d4d 50%, #0f1a30 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(201,162,39,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(42,74,122,0.3) 0%, transparent 50%)',
          }}
        />
        <div className="relative ws-animate-in">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold mb-8"
            style={{ background: 'linear-gradient(135deg, #c9a227, #e8d48a)', color: '#0c1222' }}
          >
            N
          </div>
          <p className="text-[var(--ws-gold-light)] text-sm mb-3 tracking-wide">نیما سرائیان</p>
          <h1 className="text-white text-4xl font-semibold leading-tight mb-6">
            فضای کار
            <br />
            <span className="text-[var(--ws-gold)]">راهبردی</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-md">
            پلتفرم اختصاصی مدیریت پروژه‌های مشاوره، پرسش‌نامه راهبردی و مستندات تیمی
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col bg-[var(--ws-surface)] overflow-y-auto">
        <div className="flex justify-between items-center p-6 lg:p-8">
          <Link
            href="/"
            className="text-[var(--ws-text-muted)] text-sm hover:text-[var(--ws-text)] transition-colors"
          >
            ← بازگشت به سایت
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md ws-animate-in">
            <div className="lg:hidden mb-8 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #c9a227, #e8d48a)', color: '#0c1222' }}
              >
                N
              </div>
              <h1 className="text-[var(--ws-text)] text-2xl font-semibold">فضای کار راهبردی</h1>
            </div>

            <div className="ws-card p-8">
              <h2 className="text-[var(--ws-text)] text-xl font-semibold mb-1">خوش آمدید</h2>
              <p className="text-[var(--ws-text-muted)] text-sm mb-8">ورود به فضای کار راهبردی</p>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--ws-text)] mb-2">ایمیل</label>
                  <input
                    type="email"
                    className="ws-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--ws-text)] mb-2">رمز عبور</label>
                  <input
                    type="password"
                    className="ws-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    dir="ltr"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center bg-red-50 rounded-lg py-2 px-3">{error}</p>
                )}

                <button type="submit" disabled={loading} className="ws-btn-primary w-full py-3.5">
                  {loading ? 'در حال ورود...' : 'ورود به فضای کار'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
