"use client";

import { Search, SlidersHorizontal, MoreVertical } from "lucide-react";
import { ActionMenu } from "./ActionMenu";
import { useState } from "react";
import { SessionDetailsDrawer } from "./SessionDetailsDrawer";

// Mock Data for Completed Sessions
const completedSessions = [
    { id: 1, user: "Fatima Abdullahi", device: "iPhone 12", ip: "192.168.1.25", dataUsed: "800 MB", duration: "1h 10m", status: "Completed", date: "28 Jan, 09:20" },
    { id: 2, user: "Ifeoma Uche", device: "Android Phone", ip: "192.168.1.30", dataUsed: "1.5 GB", duration: "2h 00m", status: "Completed", date: "28 Jan, 11:45" },
    { id: 3, user: "Obinna Eze", device: "Windows PC", ip: "192.168.1.35", dataUsed: "3.0 GB", duration: "4h 30m", status: "Completed", date: "27 Jan, 14:15" },
    { id: 4, user: "Zainab Mohammed", device: "MacBook Pro", ip: "192.168.1.40", dataUsed: "4.2 GB", duration: "6h 00m", status: "Completed", date: "27 Jan, 10:00" },
];

export function CompletedSessionsTable() {
    const [selectedSession, setSelectedSession] = useState<any>(null);

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Completed Sessions</h3>
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
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {completedSessions.map((session) => (
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
                                    <td className="px-6 py-4">{session.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium w-fit">
                                            <div className="h-1.5 w-1.5 rounded-full bg-gray-500"></div>
                                            {session.status}
                                        </div>
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
                variant="completed"
            />
        </>
    );
}
