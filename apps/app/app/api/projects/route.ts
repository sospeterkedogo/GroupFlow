import { NextRequest, NextResponse } from 'next/server'
// This path alias is failing in your environment.
// Make sure this path is correct.
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. READ THE NEW FIELDS FROM THE BODY
    const { title, course, due_date } = await req.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Project title required' }, { status: 400 })
    }

    // 2. INSERT THE NEW PROJECT
    // 'progress' is NOT sent. It's handled by the DB DEFAULT.
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: title,
        created_by_user_id: user.id, // Your trigger will use this
        course: course,
        due_date: due_date,
      })
      // 3. SELECT ALL THE DATA BACK
      // This is crucial, so the client state is accurate.
      .select('id, name, course, progress, due_date')
      .single()

    if (projectError) {
      console.error('Database error creating project:', projectError.message)
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    return NextResponse.json(project)

  } catch (err) {
    console.error('❌ Failed to create project:', err)
    const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = createSupabaseRouteHandlerClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // 4. THE *REAL* GET LOGIC
    // Stop using that broken `created_by_user_id` check.
    // We are now fetching projects *that you are a collaborator on*.
    
    // First, get the IDs of projects the user is in.
    const { data: collaboratorData, error: collabError } = await supabase
      .from('project_collaborators')
      .select('project_id')
      .eq('user_id', user.id)

    if (collabError) {
      console.error('Database error fetching collaborators:', collabError.message)
      return NextResponse.json({ error: collabError.message }, { status: 500 })
    }

    if (!collaboratorData || collaboratorData.length === 0) {
      // No projects. Return an empty array.
      return NextResponse.json([])
    }

    // [ 'project-uuid-1', 'project-uuid-2', ... ]
    const projectIds = collaboratorData.map(c => c.project_id)

    // Now, fetch all projects whose IDs are in that list
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      // 5. SELECT ALL THE NEW COLUMNS
      .select('id, name, course, progress, due_date')
      .in('id', projectIds)

    if (projectsError) {
      console.error('Database error fetching projects:', projectsError.message)
      return NextResponse.json({ error: projectsError.message }, { status: 500 })
    }

    return NextResponse.json(projects)

  } catch (err) {
    console.error('❌ Failed to fetch projects:', err)
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}