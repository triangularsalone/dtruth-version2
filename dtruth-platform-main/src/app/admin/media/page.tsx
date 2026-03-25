"use client";

import { useState } from "react";

interface MediaItem {
  id: string;
  name: string;
  type: string;
}

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: "1", name: "Project Overview.pdf", type: "Document" },
    { id: "2", name: "Promo Video.mp4", type: "Video" },
    { id: "3", name: "LEAP Image.png", type: "Photo" },
  ]);

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-2xl font-bold mb-4">Media Library</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mediaItems.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50/40">
                <td className="px-4 py-3 text-sm text-slate-700">{item.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{item.type}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <button className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50 mr-2">Edit</button>
                  <button className="rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}