"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import ArchiveCard from "@/components/ArchiveCard"
import HeroText from "@/components/HeroText"
import LeadershipSection from "@/components/LeadershipSection"
import CallToActionSection from "@/components/CallToActionSection"
import { supabase } from "@/lib/supabase"

type Entry = {
  id: string
  title: string
  description?: string
  category?: string
  media_url?: string
  created_at?: string
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("entries")
          .select("id, title, description, category, media_url, created_at")
          .eq("status", "Published")
          .order("created_at", { ascending: false })
          .limit(4)

        if (error) throw error
        setEntries(data || [])
      } catch (error) {
        console.error("Unable to load archive preview:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [])

  const getFileType = (url?: string) => {
    if (!url) return undefined
    return url.split(".").pop()?.toLowerCase()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-slate-950 pb-24">
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                Official Archive
              </p>
              <HeroText />
              <p className="max-w-2xl text-lg text-slate-200 leading-relaxed">
                Explore LEAP’s documents, photos, videos, and reports through a modern archive preview designed to highlight your latest impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/innovation-for-salvation"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors duration-200"
                >
                  Explore Innovation
                </a>
                <a
                  href="/archive"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white hover:bg-white/15 transition-colors duration-200"
                >
                  View Full Archive
                </a>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/90">Latest entries</p>
                  <h2 className="text-2xl font-semibold text-white mt-2">Preview the newest archive posts</h2>
                </div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase text-cyan-100">
                  Latest 4
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-8">
                Only the newest documents, images, and videos appear here so visitors can get a clean taste of the archive.
              </p>
              <div className="space-y-4">
                {loading ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-10 text-center text-slate-300">
                    Loading preview...
                  </div>
                ) : entries.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-10 text-center text-slate-300">
                    No archive entries are available yet.
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="h-14 w-14 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                            <span className="text-xl font-semibold">{entry.title?.slice(0, 1)}</span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white truncate">{entry.title}</h3>
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {entry.description || "A fresh archive item waiting to be explored."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 mb-3">
              Official Archive
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Explore LEAP’s documents, photos, videos and reports.</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
              Only the latest 4 items are shown here so visitors can quickly see what the archive contains.
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Loading archive preview...
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {entries.map((entry) => (
                <ArchiveCard
                  key={entry.id}
                  id={entry.id}
                  title={entry.title}
                  description={entry.description}
                  date={entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                  category={entry.category}
                  fileType={getFileType(entry.media_url)}
                  mediaUrl={entry.media_url}
                  onView={() => window.open(entry.media_url || "/archive", "_blank")}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <a
              href="/archive"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 transition-colors duration-200"
            >
              View Full Archive →
            </a>
          </div>
        </div>
      </section>

      <LeadershipSection />
      <CallToActionSection />
    </div>
  )
}
