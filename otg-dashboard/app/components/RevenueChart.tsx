"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', wifi: 2400, other: 1398 },
    { name: 'Feb', wifi: 1398, other: 2210 },
    { name: 'Mar', wifi: 9800, other: 2290 },
    { name: 'Apr', wifi: 3908, other: 2000 },
    { name: 'May', wifi: 4800, other: 2181 },
    { name: 'Jun', wifi: 3800, other: 2500 },
    { name: 'Jul', wifi: 4300, other: 2100 },
    { name: 'Aug', wifi: 9800, other: 2300 },
    { name: 'Sep', wifi: 3908, other: 2500 },
    { name: 'Oct', wifi: 4800, other: 2100 },
    { name: 'Nov', wifi: 3800, other: 2300 },
    { name: 'Dec', wifi: 4300, other: 2100 },
];

export function RevenueChart() {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm h-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900">Revenue growth</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">₦634,345</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                            2.4%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">Avg. per month</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        <span className="text-gray-600">Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-200"></span>
                        <span className="text-gray-600">Other Amenities</span>
                    </div>
                </div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="wifi"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="other"
                            stroke="#bfdbfe"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
