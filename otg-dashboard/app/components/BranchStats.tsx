"use client";

import { Users, Wifi, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BranchStatsProps {
    revenue: number;
    activeCustomers: number;
    wifiSessions: number;
    growth?: {
        revenue: number;
        customers: number;
        wifi: number;
    };
    chartData?: Array<{
        name: string;
        value?: number;
        type?: string;
        k?: number;
    }>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Default mock data if none provided
const DEFAULT_CHART_DATA = [
    { name: 'Jan', k: 550 },
    { name: 'Feb', k: 580 },
    { name: 'Mar', k: 650 },
    { name: 'Apr', k: 620 },
    { name: 'May', k: 640 },
    { name: 'Jun', k: 680 },
    { name: 'Jul', k: 740 },
    { name: 'Aug', k: 700 },
    { name: 'Sep', k: 780 },
    { name: 'Oct', k: 820 },
    { name: 'Nov', k: 900 },
    { name: 'Dec', k: 920 },
];

export function BranchStats({
    revenue,
    activeCustomers,
    wifiSessions,
    growth = { revenue: 0, customers: 2.4, wifi: 2.4 },
    chartData = DEFAULT_CHART_DATA
}: BranchStatsProps) {
    console.log(revenue);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* Total Revenue - Full width on mobile/tablet, half on large if needed, or structured to match design */}
                {/* Design check: 
                    Row 1: [Revenue] [Active Customers]
                    Row 2: [Active Wifi Sessions]
                    Wait, the design shows 3 cards. 
                    Let's assume a grid of 2 columns.
                */}

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                        <span className="text-gray-600 font-bold">₦</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(revenue)}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
                    <div className="flex justify-between items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Active Customers</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-gray-900">{formatNumber(activeCustomers)}</h3>
                            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                {growth.customers}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[140px]">
                    <div className="flex justify-between items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                            <Wifi className="h-5 w-5 text-gray-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Active Wi-Fi Sessions</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-gray-900">{formatNumber(wifiSessions)}</h3>
                            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                {growth.wifi}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Avg. per month</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold text-gray-900">₦634,345</h3>
                            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                2.4%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            <span className="text-gray-600">Wi-Fi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-200"></span>
                            <span className="text-gray-600">Other Amenities</span>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DEFAULT_CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWifi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickFormatter={(value) => `${value}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="k"
                                stroke="#2563EB"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorWifi)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
