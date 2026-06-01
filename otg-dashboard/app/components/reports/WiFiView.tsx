"use client";

import { TrendingUp, TrendingDown, BarChart3, LineChart } from "lucide-react";

export function WiFiView() {
    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Total Sessions</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">3,240</h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +15%
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Active connections</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">12</h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +15%
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Avg. Session duration</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">4hrs:45min</h3>
                        <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -10%
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-900">Wi-Fi Usage</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">22</span>
                            <span className="text-sm text-green-600">+2.4%</span>
                        </div>
                    </div>
                    <select className="text-sm border-none bg-gray-50 rounded-md px-3 py-1 text-gray-600 outline-none">
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <BarChart3 className="h-10 w-10 mb-2 text-gray-300" />
                    <p>Usage chart visualization disabled</p>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Active connections</h3>
                        <select className="text-sm border-none bg-gray-50 rounded-md px-3 py-1 text-gray-600 outline-none">
                            <option>Daily</option>
                        </select>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">12</h2>
                    <div className="flex justify-between items-end">
                        <div className="text-center">
                            <div className="h-20 w-12 bg-gray-100 rounded-t-md mx-auto relative group">
                                <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-md transition-all h-[27%]"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Desktops</p>
                            <p className="font-bold text-sm">27%</p>
                        </div>
                        <div className="text-center">
                            <div className="h-20 w-12 bg-gray-100 rounded-t-md mx-auto relative group">
                                <div className="absolute bottom-0 w-full bg-yellow-400 rounded-t-md transition-all h-[12%]"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Tablet</p>
                            <p className="font-bold text-sm">12%</p>
                        </div>
                        <div className="text-center">
                            <div className="h-20 w-12 bg-gray-100 rounded-t-md mx-auto relative group">
                                <div className="absolute bottom-0 w-full bg-blue-400 rounded-t-md transition-all h-[61%]"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Mobile</p>
                            <p className="font-bold text-sm">61%</p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-medium">
                        <span className="text-red-500">-3.1%</span>
                        <span className="text-red-500">-0.4%</span>
                        <span className="text-green-500">+1.5%</span>
                    </div>
                </div>

                <div className="col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Peak hours of usage</h3>
                        <select className="text-sm border-none bg-gray-50 rounded-md px-3 py-1 text-gray-600 outline-none">
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <LineChart className="h-10 w-10 mb-2 text-gray-300" />
                        <p>Peak hours chart visualization disabled</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
