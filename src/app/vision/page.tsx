"use client"

import Navbar from "@/components/Navbar"

export default function Vision() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-600 mb-4">Vision & Movement</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">LEAP MOVEMENT FOR ALL Vision</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">A dedicated page for the idea, the journey, and the places LEAP MOVEMENT FOR ALL has reached.</p>
        </div>

        <section className="mb-20">
          <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl relative">
            <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-slate-200 text-lg sm:text-xl font-semibold">
              Video will be added here manually
            </div>
            <div className="absolute inset-0 opacity-10 bg-[url('/IMG-20260327-WA0027.jpg')] bg-cover bg-center"></div>
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">What the Vision Means</h2>
            <p className="text-gray-600 leading-relaxed">LEAP MOVEMENT FOR ALL is more than a project; it is a movement to document, empower, and connect communities through transformative work.</p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600"></span>
                <span>Showcase the journey of LEAP MOVEMENT FOR ALL through verified media and reports.</span>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600"></span>
                <span>Highlight the movements and milestones that drove change.</span>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600"></span>
                <span>Document the places reached, partnerships built, and communities impacted.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-200 bg-indigo-50 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Movements We Have Made</h3>
              <p className="text-gray-600 leading-relaxed">LEAP MOVEMENT FOR ALL has steadily advanced through innovation, collaboration, and strategic community work. Each milestone is part of the broader movement toward positive social impact.</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Places Reached</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Local institutions and grassroots communities</li>
                <li>Regional partners and project sites</li>
                <li>Public campaigns and digital outreach</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-slate-900 p-10 text-white">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <p className="text-slate-200 leading-relaxed">This page is designed so you can add the main idea video and keep the movement story separate from the home page. It becomes the destination for anyone who wants to learn the full vision behind LEAP MOVEMENT FOR ALL.</p>
        </section>
      </main>
    </div>
  )
}
