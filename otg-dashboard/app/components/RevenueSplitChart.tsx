"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { name: 'Wi-Fi', value: 400, color: '#2563eb' },
    { name: 'Co-working space', value: 300, color: '#93c5fd' },
    { name: 'Coffee', value: 300, color: '#60a5fa' },
    { name: 'Food', value: 200, color: '#bfdbfe' },
    { name: 'Others', value: 100, color: '#dbeafe' },
];

export function RevenueSplitChart() {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm h-full">
            <h3 className="font-semibold text-gray-900 mb-6">Revenue split</h3>
            <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Optional center content if needed */}
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
