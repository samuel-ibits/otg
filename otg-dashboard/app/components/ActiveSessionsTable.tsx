"use client";

import { Search, SlidersHorizontal, MoreVertical } from "lucide-react";
import { ActionMenu } from "./ActionMenu";
import { useState } from "react";
import { SessionDetailsDrawer } from "./SessionDetailsDrawer";

// Mock Data for Active Sessions
const activeSessions = [
    { id: 1, user: "Sophia Williams", device: "iPhone 13 Pro", ip: "192.168.1.10", dataUsed: "1.2 GB", duration: "2h 15m", status: "Active" },
    { id: 2, user: "Emeka Nwosu", device: "Samsung S21", ip: "192.168.1.12", dataUsed: "500 MB", duration: "45m", status: "Active" },
    { id: 3, user: "Chinedu Okafor", device: "MacBook Air", ip: "192.168.1.15", dataUsed: "2.5 GB", duration: "4h 10m", status: "Active" },
    { id: 4, user: "Amina Bello", device: "iPad Pro", ip: "192.168.1.18", dataUsed: "800 MB", duration: "1h 30m", status: "Active" },
    { id: 5, user: "Tunde Adeyemi", device: "Windows Laptop", ip: "192.168.1.20", dataUsed: "3.1 GB", duration: "5h 20m", status: "Active" },
];

export function ActiveSessionsTable() {
    const [selectedSession, setSelectedSession] = useState<any>(null);

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Active Sessions</h3>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="h-8 max-w-[200px] rounded-md border border-gray-200 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Device</th>
                                <th className="px-6 py-3 font-medium">IP Address</th>
                                <th className="px-6 py-3 font-medium">Data Used</th>
                                <th className="px-6 py-3 font-medium">Duration</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeSessions.map((session) => (
                                <tr
                                    key={session.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedSession(session)}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">{session.user}</td>
                                    <td className="px-6 py-4">{session.device}</td>
                                    <td className="px-6 py-4">{session.ip}</td>
                                    <td className="px-6 py-4">{session.dataUsed}</td>
                                    <td className="px-6 py-4">{session.duration}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium w-fit">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                                            {session.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            onEdit={() => setSelectedSession(session)}
                                            onDelete={() => console.log("Disconnect", session.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Previous
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium text-gray-900">1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>...</span>
                        <span>5</span>
                    </div>
                    <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>

            <SessionDetailsDrawer
                isOpen={!!selectedSession}
                onClose={() => setSelectedSession(null)}
                session={selectedSession}
                variant="active"
            />
        </>
    );
}
