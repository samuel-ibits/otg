"use client";

import { User, Lock, UserPlus, FileText, Tag, Image as ImageIcon, Video, RefreshCw } from "lucide-react";
import { cn } from "@/app/lib/utils";

import type { BranchActivityLog } from "@/app/lib/types";

interface ActivityLogProps {
    logs?: BranchActivityLog[];
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'password_reset': return <User className="h-4 w-4 text-blue-600" />;
        case 'new_staff': return <UserPlus className="h-4 w-4 text-blue-600" />;
        case 'price_change': return <Tag className="h-4 w-4 text-blue-600" />;
        case 'new_product': return <FileText className="h-4 w-4 text-blue-600" />;
        case 'images_updated': return <ImageIcon className="h-4 w-4 text-blue-600" />;
        case 'description_updated': return <Video className="h-4 w-4 text-blue-600" />; // Or pen
        case 'login': return <User className="h-4 w-4 text-blue-600" />;
        default: return <RefreshCw className="h-4 w-4 text-blue-600" />;
    }
};

export function ActivityLog({ logs = [] }: ActivityLogProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Activity log</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-8 pr-4 py-2 border rounded-md text-sm w-64"
                    />
                    {/* Search Icon placeholder */}
                </div>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {logs.length === 0 ? (
                    <div className="relative flex items-center justify-center p-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <p className="text-gray-500 font-medium">No activity yet</p>
                            <p className="text-sm text-gray-400">Activity logs will appear here when changes are made.</p>
                        </div>
                    </div>
                ) : (
                    logs.map((item) => (
                        <div key={item.id} className="relative flex items-start group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-100 bg-blue-50 shrink-0 z-10">
                                {getActivityIcon(item.type)}
                            </div>
                            <div className="ml-6 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        )}
                                        {item.meta && (
                                            <p className="text-xs text-gray-500 mt-0.5">{item.meta}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{item.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
