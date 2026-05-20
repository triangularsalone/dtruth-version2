"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"innovation" | "traction" | "archives">("archives")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage({ type: "error", text: "Please select a file" })
      return
    }

    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a title" })
      return
    }

    try {
      setLoading(true)
      setProgress(0)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      setProgress(100)
      setMessage({ type: "success", text: "Document uploaded successfully!" })
      setFile(null)
      setTitle("")
      setDescription("")
      setCategory("archives")

      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to upload document",
      })
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Document Management</p>
            <h1 className="text-3xl font-bold text-slate-900">Upload Document</h1>
            <p className="text-xs text-slate-500 mt-1">Add a new document to the platform</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded border ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document File *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                  id="file-input"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.webm"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📄</div>
                  {file ? (
                    <>
                      <p className="text-green-600 font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-700 font-medium">
                        Drag and drop your file or click to browse
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Max size: 50MB. Formats: PDF, DOC, DOCX, XLS, XLSX, TXT, images, videos
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "innovation" | "traction" | "archives")
                }
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="innovation">Innovation for Salvation</option>
                <option value="traction">Traction</option>
                <option value="archives">Archives</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Changes in category affect visibility of the doc across the platform.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description (optional)"
                disabled={loading}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {/* Progress Bar */}
            {progress > 0 && progress < 100 && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{Math.round(progress)}% uploading...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <Link
                href="/admin/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-md text-slate-900 font-medium hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !file}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Upload Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Documents are stored securely in Supabase Storage</li>
            <li>• Initial status is "Pending" - you can publish after review</li>
            <li>• Use the category selector to determine where the document appears</li>
            <li>• Maximum file size is 50MB</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
