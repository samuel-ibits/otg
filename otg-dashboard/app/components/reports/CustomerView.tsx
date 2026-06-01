"use client";

import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";

export function CustomerView() {
    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Total Customers</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +15% year
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Customer Retention rate</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">78%</h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +5% last year
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Avg. Spend Per Customer</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">₦5,200</h3>
                        <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -10% last year
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Growth Chart */}
                <div className="col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Customer growth</h3>
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
                        <p>Growth chart visualization disabled</p>
                    </div>
                </div>

                {/* Type Split */}
                <div className="col-span-1 bg-white rounded-xl p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Returning vs New customers</h3>
                        <select className="text-sm border-none bg-gray-50 rounded-md px-3 py-1 text-gray-600 outline-none">
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <PieChart className="h-10 w-10 mb-2 text-gray-300" />
                        <p>Chart disabled</p>
                    </div>
                    <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                <span className="text-gray-600">Returning customers</span>
                            </div>
                            <span className="font-medium text-gray-900">68%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-100" />
                                <span className="text-gray-600">New customers</span>
                            </div>
                            <span className="font-medium text-gray-900">32%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
