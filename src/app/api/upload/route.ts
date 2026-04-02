import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/webm',
]

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase environment variables are not configured.' },
      { status: 500 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Unable to initialize Supabase client.' },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!category || !['innovation', 'traction', 'archives'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 415 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    const filename = `${timestamp}-${randomId}-${file.name}`
    const path = `documents/${category}/${filename}`

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer()
    const { error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(path)

    const publicUrl = data?.publicUrl || ''

    // Create entry record in database
    const { data: entry, error: dbError } = await supabaseAdmin
      .from('entries')
      .insert({
        title: title || file.name,
        description: description || '',
        category,
        media_url: publicUrl,
        status: 'Pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up the upload if DB fails
      await supabaseAdmin.storage.from('documents').remove([path])
      return NextResponse.json(
        { error: 'Failed to create entry record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      entry,
      url: publicUrl,
    }, { status: 201 })

  } catch (error) {
    console.error('Upload handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
