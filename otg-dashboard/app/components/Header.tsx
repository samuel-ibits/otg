"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
            <div>
                <h1 className="text-lg font-semibold text-gray-900">General Overview</h1>
                <p className="text-xs text-gray-500">Welcome back, Cafe One - Lekki</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="h-9 w-64 rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                    />
                </div>
                <button className="relative rounded-full bg-white p-2 text-gray-500 hover:bg-gray-100 border border-gray-200">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
            </div>
        </header>
    );
}
