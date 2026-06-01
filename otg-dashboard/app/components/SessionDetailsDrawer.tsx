"use client";

import { X, Wifi, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/app/lib/utils";

interface SessionDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    session: any; // Using any for now to be flexible with different mock data structures
    variant: 'active' | 'completed';
}

const data = [
    { time: '09:00', upload: 200, download: 400 },
    { time: '10:00', upload: 150, download: 300 },
    { time: '11:00', upload: 400, download: 600 },
    { time: '12:00', upload: 300, download: 500 },
    { time: '13:00', upload: 600, download: 800 },
    { time: '14:00', upload: 200, download: 400 },
    { time: '15:00', upload: 100, download: 200 },
];

export function SessionDetailsDrawer({ isOpen, onClose, session, variant }: SessionDetailsDrawerProps) {
    if (!isOpen || !session) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between bg-white">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{session.user}</h2>
                        <div className="text-sm text-gray-500 mt-1">
                            <span>Oct 29, 2024</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-gray-900">₦3,000</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Session Information */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Session Information</h3>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-900">
                                        <Wifi className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">CafeOne_Wi-Fi</div>
                                        <div className="text-xs text-blue-600 font-medium">Daily - Unlimited</div>
                                    </div>
                                </div>
                                <div className="font-medium text-gray-900">₦3,000</div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="text-gray-500">Duration</div>
                                <div className="text-right font-medium text-gray-900">{session.duration || "1 day"}</div>

                                <div className="text-gray-500">Date</div>
                                <div className="text-right font-medium text-gray-900">12/11/2025 - 12/11/2025</div>

                                <div className="text-gray-500">Time connected</div>
                                <div className="text-right font-medium text-gray-900">09:00AM</div>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Analytics</h3>

                            <div className="rounded-xl border border-gray-100 p-4 space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Bandwidth usage</div>
                                    <div className="text-2xl font-bold text-gray-900">8.23GB</div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Downloads</span>
                                        <span className="flex items-center text-blue-600 text-xs font-medium">
                                            <ArrowDown className="h-3 w-3 mr-0.5" /> 7.10GB
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Uploads</span>
                                        <span className="flex items-center text-blue-600 text-xs font-medium">
                                            <ArrowUp className="h-3 w-3 mr-0.5" /> 1.13GB
                                        </span>
                                    </div>
                                </div>

                                <div className="h-[150px] w-full pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data}>
                                            <defs>
                                                <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="download" stroke="#2563eb" fillOpacity={1} fill="url(#colorDownload)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="upload" stroke="#93c5fd" fillOpacity={1} fill="url(#colorUpload)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Sites Visited */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sites Visited</h3>

                            <div className="rounded-xl border border-gray-100 p-4">
                                <div className="mb-4">
                                    <div className="text-2xl font-bold text-gray-900">11</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        <span className="text-gray-600">www.facebook.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                                        <span className="text-gray-600">www.instagram.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-gray-600">www.google.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    {variant === 'active' ? (
                        <button
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                            onClick={onClose}
                        >
                            End Session
                        </button>
                    ) : (
                        <button
                            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
