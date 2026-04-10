"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import ArchiveCard from "@/components/ArchiveCard"

type Entry = {
  id: string
  title: string
  description?: string
  content?: string
  category?: string
  status?: string
  media_url?: string
  created_at?: string
}

export default function Archive() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error("Supabase client is not configured")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("entries")
        .select("id, title, description, content, category, status, media_url, created_at")
        .eq("status", "Published")
        .order("created_at", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (err: any) {
      console.error("Unable to load entries:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = filter === "all" ? entries : entries.filter(e => e.category === filter)

  const categories = ["all", ...Array.from(new Set(entries.map(e => e.category).filter(Boolean)))] as string[]

  const getFileType = (url?: string) => {
    if (!url) return undefined
    const ext = url.split('.').pop()?.toLowerCase()
    return ext
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Official Archive</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the comprehensive collection of LEAP MOVEMENT FOR ALL's documents, photos, videos, and reports since 2010.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Archive Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading archive...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No published entries found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {filteredEntries.map((entry) => (
              <ArchiveCard
                key={entry.id}
                id={entry.id}
                title={entry.title}
                description={entry.description}
                date={entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                category={entry.category}
                fileType={getFileType(entry.media_url)}
                mediaUrl={entry.media_url}
                onView={() => window.open(entry.media_url || "#", "_blank")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}