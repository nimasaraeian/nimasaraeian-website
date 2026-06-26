'use client'

import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib'
import LoginPage from './components/LoginPage'
import WorkspaceApp from './components/WorkspaceApp'
import LoadingScreen from './components/LoadingScreen'

export default function WorkspacePage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <LoadingScreen />
  if (!session) return <LoginPage />
  return <WorkspaceApp session={session} />
}
