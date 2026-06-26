import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
  try {
    const { email, projectId, inviterId } = await request.json()

    if (!email || !projectId) {
      return NextResponse.json({ error: 'ایمیل و شناسه پروژه الزامی است' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nimasaraeian.com'

    // Try to invite (creates user if not exists)
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/workspace`,
    })

    let userId: string | null = null

    if (error) {
      // User already exists — find them in profiles
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (profile) {
        userId = profile.id
      } else {
        return NextResponse.json({ error: 'کاربر یافت نشد: ' + error.message }, { status: 400 })
      }
    } else {
      userId = data.user.id
      // Create profile for newly invited user
      await supabaseAdmin.from('profiles').upsert({ id: userId, email }, { onConflict: 'id' })
    }

    // Add to project_members
    const { error: memberError } = await supabaseAdmin
      .from('project_members')
      .upsert(
        { project_id: projectId, user_id: userId, role: 'member', invited_by: inviterId },
        { onConflict: 'project_id,user_id' }
      )

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطای ناشناخته'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
