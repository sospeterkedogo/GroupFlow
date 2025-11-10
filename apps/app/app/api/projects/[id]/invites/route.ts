import { createClient } from '@/lib/supabase/server-route-handler'
import { NextResponse } from 'next/server'

const VALID_PROJECT_ROLES = ['owner', 'admin', 'member', 'viewer']

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { projectId } = params
    const { email, role } = await req.json()

    // --- VALIDATION ---
    if (!email || !role) {
      return new NextResponse('Email and role are required', { status: 400 })
    }

    if (!VALID_PROJECT_ROLES.includes(role)) {
      return new NextResponse(`Invalid role: ${role}`, { status: 400 })
    }

    // --- AUTHORIZATION ---
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('project_collaborators')
      .select('role')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single()

    if (collaboratorError && collaboratorError.code !== 'PGRST116') {
      console.error('Error fetching collaborator:', collaboratorError)
      return new NextResponse('Internal error', { status: 500 })
    }

    if (!collaborator || !['owner', 'admin'].includes(collaborator.role)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // --- EXISTING COLLABORATOR CHECK ---
    const { data: existingCollaborator } = await supabase
      .from('project_collaborators')
      .select('id')
      .eq('project_id', projectId)
      .eq('email', email)
      .maybeSingle()

    if (existingCollaborator) {
      return new NextResponse('User is already a member of this project', {
        status: 409,
      })
    }

    // --- EXISTING INVITE CHECK ---
    const { data: existingInvite } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email)
      .eq('resource_type', 'project')
      .eq('resource_id', projectId)
      .eq('status', 'pending')
      .maybeSingle()

    if (existingInvite) {
      return new NextResponse('An invite has already been sent to this email', {
        status: 409,
      })
    }

    const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', projectId)
    .single();


    // --- CREATE INVITE ---
    const token = crypto.randomUUID()

    const { data: newInvite, error: inviteError } = await supabase
      .from('invitations')
      .insert([
        {
          email,
          resource_type: 'project',
          resource_id: projectId,
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
      return new NextResponse('Error creating invite', { status: 500 })
    }

    // send invite email (background task supabase edge function)
    const sendEmailPromise = fetch(
  `${process.env.SUPABASE_URL}/functions/v1/send-email-invite`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email,
      token,
      projectName: project?.name ?? 'Your Project',
    }),
  }
    ).catch((err) => console.error('Background email error:', err));

    void sendEmailPromise; // clarity that it’s intentional



    return NextResponse.json(newInvite, { status: 201 })
  } catch (error) {
    console.error('[PROJECT_INVITE_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
