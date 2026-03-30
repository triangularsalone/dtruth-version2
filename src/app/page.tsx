
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push("/login")
        } else {
          setIsUserLoading(false)
        }
      } catch (error) {
        console.error("Error checking user:", error)
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/IMG-20260327-WA0027.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-slate-950/55"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200 mb-6">
              LEAP official documentation
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Preserving the Journey of <span className="text-indigo-300">LEAP</span> Since 2010
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              D&apos;Truth is the official platform for LEAP&apos;s stories, media, milestones, and impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/archive" className="btn-primary text-lg px-8 py-4">
                Explore Archive
              </a>
              <a href="/vision" className="btn-secondary text-lg px-8 py-4">
                Learn Our Vision
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            A single place for LEAP&apos;s story
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            The archive holds every published document, photo, video, and report. Home now stays focused while the archive page keeps the media and data in one place.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Archive</h3>
              <p className="text-gray-600">
                All published LEAP media and documents are stored in one dedicated place.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dedicated Vision</h3>
              <p className="text-gray-600">
                Our mission, movements, and reach are now presented on a separate vision page with an explanatory video.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Clear Impact</h3>
              <p className="text-gray-600">
                LEAP progress is shown through innovation highlights and measurable traction.
              </p>
            </div>
          </div>
        </div>
      </section>

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


      {/* CTA */}
      <section className="py-20 sm:py-32 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Be part of LEAP's ongoing journey of innovation and community impact.
          </p>
          <div className="flex justify-center">
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