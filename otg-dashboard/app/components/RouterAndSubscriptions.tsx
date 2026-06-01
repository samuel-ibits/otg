"use client";

import { Plus, Search, Wifi, Copy, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";
import { ActionMenu } from "./ActionMenu";
import { useState } from "react";

const routers = [
    { id: 1, name: "Cozy_Cafe_Wi-Fi 1", password: "123456AbjMQ", connections: 10, status: true },
    { id: 2, name: "Cozy_Cafe_Wi-Fi 2", password: "123456AbjMQ", connections: 10, status: true },
    { id: 3, name: "Cozy_Cafe_Wi-Fi 3", password: "123456AbjMQ", connections: 10, status: true },
    { id: 4, name: "Cozy_Cafe_Wi-Fi 4", password: "123456AbjMQ", connections: 10, status: true },
    { id: 5, name: "Cozy_Cafe_Wi-Fi 5", password: "123456AbjMQ", connections: 10, status: true },
    { id: 6, name: "Cozy_Cafe_Wi-Fi 6", password: "123456AbjMQ", connections: 10, status: true },
];

const subscriptions = [
    { id: 1, type: "Daily - Unlimited", speed: "30 Mbps", duration: "1 day", amount: "₦13,000", dateAdded: "28 Jan, 09:20" },
    { id: 2, type: "Weekly - Unlimited", speed: "30 Mbps", duration: "7 days", amount: "₦14,500", dateAdded: "28 Jan, 09:20" },
    { id: 3, type: "Monthly - Unlimited", speed: "30 Mbps", duration: "30 days", amount: "₦15,200", dateAdded: "28 Jan, 09:20" },
];

export function RouterAndSubscriptions() {
    return (
        <div className="space-y-8">
            {/* Routers Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Routers</h2>
                    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
                        <Plus className="h-4 w-4" />
                        Add Router
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {routers.map((router) => (
                        <div key={router.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <Wifi className="h-5 w-5" />
                                </div>
                                <Switch checked={router.status} />
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-4">{router.name}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Password:</span>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-medium tracking-wider text-xs">•••••••••••</span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Copy className="h-3 w-3" />
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Eye className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Connections:</span>
                                    <span className="font-medium text-gray-900">{router.connections}</span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscriptions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Subscriptions packages</h2>
                    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
                        <Plus className="h-4 w-4" />
                        Add Subscription
                    </button>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="font-medium text-gray-900">Subscription packages</h3>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="h-8 max-w-[200px] rounded-md border border-gray-200 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 transition-all"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">S/N</th>
                                    <th className="px-6 py-3 font-medium">Subscription type</th>
                                    <th className="px-6 py-3 font-medium">Speed</th>
                                    <th className="px-6 py-3 font-medium">Duration</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Date Added</th>
                                    <th className="px-6 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subscriptions.map((sub, index) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{sub.type}</td>
                                        <td className="px-6 py-4">{sub.speed}</td>
                                        <td className="px-6 py-4">{sub.duration}</td>
                                        <td className="px-6 py-4">{sub.amount}</td>
                                        <td className="px-6 py-4">{sub.dateAdded}</td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionMenu
                                                onEdit={() => console.log("Edit sub", sub.id)}
                                                onDelete={() => console.log("Delete sub", sub.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
