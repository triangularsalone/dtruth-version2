"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import Navbar from "@/components/Navbar"

type Entry = {
  id: string
  title: string
  description?: string
  category?: string
  media_url?: string
  external_link?: string
  created_at?: string
}

export default function Traction() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error("Supabase client is not configured")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("entries")
        .select("id, title, description, category, media_url, external_link, created_at")
        .eq("status", "Published")
        .eq("category", "traction")
        .order("created_at", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      console.error("Unable to load entries:", err)
    } finally {
      setLoading(false)
    }
  }

  const getMediaPreview = (entry: Entry) => {
    if (!entry.media_url) return null

    const url = entry.media_url.toLowerCase()
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
    const isVideo = /\.(mp4|webm|ogg)$/i.test(url)

    if (isImage) {
      return (
        <img
          src={entry.media_url}
          alt={entry.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )
    }

    if (isVideo) {
      return (
        <video
          src={entry.media_url}
          className="w-full h-48 object-cover rounded-lg"
          controls
        />
      )
    }

    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Traction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Measurable results and growing influence in our mission areas, showcasing the impact and progress of LEAP MOVEMENT FOR ALL initiatives.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No traction content published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-[1.5rem] shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  {getMediaPreview(entry)}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{entry.title}</h3>
                  {entry.description && (
                    <p className="text-gray-600 text-sm mb-4">{entry.description}</p>
                  )}
                  <div className="flex gap-2">
                    {entry.media_url && (
                      <a
                        href={entry.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        View Content →
                      </a>
                    )}
                    {entry.external_link && (
                      <a
                        href={entry.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                      >
                        External Link →
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}