import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json([], { status: 401 })

  const { data: { user } } = await admin.auth.getUser(token)
  if (!user) return NextResponse.json([], { status: 401 })

  // Auto-add user as owner for any projects they own but aren't in project_members
  const { data: owned } = await admin
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)

  if (owned && owned.length > 0) {
    await admin.from('project_members').upsert(
      owned.map(p => ({ project_id: p.id, user_id: user.id, role: 'owner' })),
      { onConflict: 'project_id,user_id' }
    )
  }

  // Return all projects for this user
  const { data } = await admin
    .from('project_members')
    .select('role, projects(id, title, description, color, owner_id, created_at)')
    .eq('user_id', user.id)

  return NextResponse.json(data || [])
}
