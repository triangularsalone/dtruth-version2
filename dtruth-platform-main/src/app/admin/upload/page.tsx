"use client";

import { useState } from "react";

export default function UploadDocument() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: add upload logic
    alert(`Uploading ${title} with file ${file?.name}`);
  };

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-2xl font-bold mb-4">Upload Document</h1>
      <form onSubmit={handleUpload} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Document title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}