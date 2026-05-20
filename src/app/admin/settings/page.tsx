"use client"

import Link from "next/link"
import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "D'Truth Documentation Platform",
    maxFileSize: 50, // MB
    enabledCategories: ["innovation", "traction", "archives"],
    documentRetentionDays: 90,
    maintenanceMode: false,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    // In a real implementation, this would save to a Supabase table
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: "success", text: "Settings saved successfully" })
      setTimeout(() => setMessage(null), 3000)
    }, 500)
  }

  const handleReset = () => {
    setSettings({
      platformName: "D'Truth Documentation Platform",
      maxFileSize: 50,
      enabledCategories: ["innovation", "traction", "archives"],
      documentRetentionDays: 90,
      maintenanceMode: false,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Admin Panel</p>
            <h1 className="text-3xl font-bold text-slate-900">Platform Settings</h1>
            <p className="text-xs text-slate-500 mt-1">Configure platform-wide settings</p>
          </div>
          <Link href="/admin/dashboard" className="rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded border ${message.type === "success" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Settings */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Basic Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Used in emails and notifications</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Maximum size for document uploads</p>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Document Categories</h2>
            <div className="space-y-3">
              {["innovation", "traction", "archives"].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enabledCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({
                          ...settings,
                          enabledCategories: [...settings.enabledCategories, category],
                        })
                      } else {
                        setSettings({
                          ...settings,
                          enabledCategories: settings.enabledCategories.filter((c) => c !== category),
                        })
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Data Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Document Retention Period (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.documentRetentionDays}
                  onChange={(e) => setSettings({ ...settings, documentRetentionDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Archived documents will be automatically purged after this period</p>
              </div>
            </div>
          </section>

          {/* Maintenance Mode */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Maintenance</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              <span className="ml-3 text-sm font-medium text-slate-700">Enable Maintenance Mode</span>
            </label>
            <p className="text-xs text-slate-500 mt-2">
              When enabled, only administrators can access the platform
            </p>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-md text-slate-900 font-medium hover:bg-slate-50"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
