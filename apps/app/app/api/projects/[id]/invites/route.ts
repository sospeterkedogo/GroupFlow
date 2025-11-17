import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const VALID_PROJECT_ROLES = ['owner', 'admin', 'member', 'viewer']

export async function POST(
  req: Request,
  context: { params: { id: string } } // You aren't using this in your snippet, but keeping type signature
) {
  try {
    const supabase = createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { email, role, id } = await req.json()

    // --- VALIDATION ---
    if (!email || !role) {
      return new NextResponse('Email and role are required', { status: 400 })
    }

    if (!VALID_PROJECT_ROLES.includes(role)) {
      return new NextResponse(`Invalid role: ${role}`, { status: 400 })
    }

    // --- AUTHORIZATION (DELETED) ---
    // We removed the manual query to 'project_collaborators'. 
    // The RLS policy "Admins can create invites" now handles this check 
    // during the INSERT operation below.

    // --- LOGIC: EXISTING CHECKS ---
    // We keep these for better UI error messages (409 Conflict),
    // though you could enforce this via SQL Unique Constraints too.
    
    // 1. Is user already in the project?
    const { data: existingCollaborator } = await supabase
      .from('project_collaborators')
      .select('id')
      .eq('project_id', id)
      // 1. Select the ID, AND join profiles with !inner to force filtering
      .select('id, profiles!inner(email)') 
      .eq('project_id', id)
      // 2. Filter against the joined table column
      .eq('profiles.email', email)
      .maybeSingle()

    if (existingCollaborator) {
      return new NextResponse('User is already a member of this project', { status: 409 })
    }

    // 2. Is there already a pending invite?
    const { data: existingInvite } = await supabase
      .from('invitations')
      .select('id')
      .eq('email', email)
      .eq('resource_type', 'project')
      .eq('resource_id', id)
      .eq('status', 'pending')
      .maybeSingle()

    if (existingInvite) {
      return new NextResponse('An invite has already been sent to this email', { status: 409 })
    }

    // --- FETCH PROJECT NAME (For Email) ---
    // We fetch this using the CLIENT credentials. 
    // If the RLS works, this SELECT will verify the user has access to read the project.
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('name')
      .eq('id', id)
      .single();

    if (projError || !project) {
       // If RLS blocks reading the project, they definitely can't invite to it.
       return new NextResponse('Project not found or Forbidden', { status: 403 })
    }

    // --- CREATE INVITE ---
    const token = crypto.randomUUID()

    const { data: newInvite, error: inviteError } = await supabase
      .from('invitations')
      .insert([
        {
          email,
          resource_type: 'project',
          resource_id: id,
          role,
          status: 'pending',
          invited_by_user_id: userId,
          token,
        },
      ])
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invite:', inviteError.message)
      
      // CATCH RLS ERROR
      // Postgres error code 42501 means "Insufficient Privilege" (RLS Denied)
      if (inviteError.code === '42501') {
        return new NextResponse('You do not have permission to invite members to this project.', { status: 403 })
      }

      return new NextResponse('Error creating invite', { status: 500 })
    }

    // --- SEND EMAIL ---
    const sendEmailPromise = fetch(
      `https://hwjnoogfdyjjijuazzse.supabase.co/functions/v1/send-email-invite`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          email,
          token,
          projectName: project.name ?? 'Your Project',
        }),
      }
    ).catch((err) => console.error('Background email error:', err));

    void sendEmailPromise;

    return NextResponse.json(newInvite, { status: 201 })
  } catch (error) {
    console.error('[PROJECT_INVITE_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}