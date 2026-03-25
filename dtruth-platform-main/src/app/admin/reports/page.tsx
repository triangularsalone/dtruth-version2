"use client";

import { useState } from "react";

interface Report {
  id: string;
  name: string;
  generatedAt: string;
}

export default function Reports() {
  const [reports] = useState<Report[]>([
    { id: "1", name: "Monthly Uploads", generatedAt: "2026-03-01" },
    { id: "2", name: "User Activity", generatedAt: "2026-03-20" },
  ]);

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-indigo-50/40">
                <td className="px-4 py-3 text-sm text-slate-700">{r.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{r.generatedAt}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <button className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50">View</button>
                  <button className="rounded-md border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}