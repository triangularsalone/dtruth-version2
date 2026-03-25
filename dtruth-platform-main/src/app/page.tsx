
"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
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
    loadPublishedEntries()
  }, [])

  const loadPublishedEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("id, title, description, category, media_url, created_at")
        .eq("status", "Published")
        .order("created_at", { ascending: false })
        .limit(6) // Show latest 6 items

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

    // For documents, show a document icon
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Preserving the Journey of{" "}
              <span className="text-indigo-600">LEAP</span>{" "}
              Since 2010
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              D&apos;Truth is the official documentation platform showcasing the vision,
              innovation, milestones, and operational history of LEAP.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/archive"
                className="btn-primary text-lg px-8 py-4"
              >
                Explore Official Archive
              </a>
              <a
                href="#vision"
                className="btn-secondary text-lg px-8 py-4"
              >
                Learn Our Vision
              </a>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* VISION */}
      <section id="vision" className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              LEAP Vision
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Driving transformative change through innovation and community empowerment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                LEAP is committed to advancing transformative solutions that
                empower communities and institutions. Through strategic innovation,
                research, and operational initiatives, the organization has been
                building impactful systems that address real societal challenges.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our mission spans across multiple domains, from technological
                advancement to social impact, creating sustainable frameworks
                that benefit both current and future generations.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Principles</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                  <span className="text-gray-600">Innovation-driven solutions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                  <span className="text-gray-600">Community empowerment</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                  <span className="text-gray-600">Sustainable impact</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                  <span className="text-gray-600">Collaborative partnerships</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INNOVATION */}
      <section id="innovation" className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Innovation For Salvation
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pioneering solutions that create lasting positive change
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Technological Innovation</h3>
              <p className="text-gray-600">
                Leveraging cutting-edge technology to solve complex challenges and create efficient systems.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Building strong communities through inclusive programs and collaborative initiatives.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Solutions</h3>
              <p className="text-gray-600">
                Creating long-term, sustainable frameworks that continue to benefit society for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRACTION */}
      <section id="traction" className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Traction & Impact
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Measurable results and growing influence in our mission areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">15+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">25+</div>
              <div className="text-gray-600">Partner Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHIVE PREVIEW */}
      <section id="archive" className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our Archive
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of documents, photos, and videos showcasing LEAP's journey since 2010
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading archive...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No published content yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gray-200">
                    {getMediaPreview(entry)}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                        {entry.category || "Document"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {entry.title}
                    </h3>
                    {entry.description && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {entry.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <a
                        href={entry.media_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        View Full Content →
                      </a>
                      <a
                        href="/archive"
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        More in Archive
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/archive"
              className="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              View Full Archive
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Be part of LEAP's ongoing journey of innovation and community impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/admin/login"
              className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Admin Access
            </a>
            <a
              href="/archive"
              className="inline-block border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors duration-200"
            >
              Explore Archive
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}