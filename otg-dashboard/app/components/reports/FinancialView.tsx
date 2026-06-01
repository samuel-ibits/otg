"use client";

import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";

export function FinancialView() {
    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Total Revenue</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">₦135,345,00</h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            15% last year
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Avg. Revenue per customer</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">₦5,200</h3>
                        <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            15% last year
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Placeholders */}
            <div className="grid grid-cols-3 gap-6">
                {/* Revenue Growth */}
                <div className="col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Revenue Growth</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold text-gray-900">₦334,345</span>
                                <span className="text-sm text-green-600">+1.4%</span>
                            </div>
                        </div>
                        <select className="text-sm border-none bg-gray-50 rounded-md px-3 py-1 text-gray-600 outline-none">
                            <option>Monthly</option>
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <BarChart3 className="h-10 w-10 mb-2 text-gray-300" />
                        <p>Chart visualization disabled</p>
                    </div>
                </div>

                {/* Revenue Split */}
                <div className="col-span-1 bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Revenue split</h3>
                        <select className="text-sm border-none bg-gray-50 rounded-md px-3 py-1 text-gray-600 outline-none">
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <PieChart className="h-10 w-10 mb-2 text-gray-300" />
                        <p>Chart disabled</p>
                    </div>
                    <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-gray-600">Co-working space</span>
                            </div>
                            <span className="font-medium text-gray-900">₦85,400</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-300" />
                                <span className="text-gray-600">Coffee</span>
                            </div>
                            <span className="font-medium text-gray-900">₦65,400</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-200" />
                                <span className="text-gray-600">Food</span>
                            </div>
                            <span className="font-medium text-gray-900">₦15,400</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
