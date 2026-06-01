"use client";

import { useState } from "react";
import { Tabs } from "@/app/components/Tabs";
import { EmptyState } from "@/app/components/EmptyState";
import { Search, SlidersHorizontal, MoreVertical, Plus, Download } from "lucide-react";
import { ActionMenu } from "@/app/components/ActionMenu";

// Mock Data
const vouchers = [
    { id: 1, discount: "10%", validityDays: "Mon - Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 2, discount: "10%", validityDays: "Tues, Wed & Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 3, discount: "10%", validityDays: "Tues, Wed & Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 4, discount: "10%", validityDays: "Tues, Wed & Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 5, discount: "10%", validityDays: "Tues, Wed & Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 6, discount: "10%", validityDays: "Mon - Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 7, discount: "10%", validityDays: "Mon - Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 8, discount: "10%", validityDays: "Mon - Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
    { id: 9, discount: "10%", validityDays: "Mon - Fri", createdOn: "28 Jan 2025, 09:20", validTill: "28 Jan 2025, 09:20", status: "Active" },
];

export default function VouchersPage() {
    const [activeTab, setActiveTab] = useState("active");

    const filteredVouchers = activeTab === "active" ? vouchers : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vouchers</h1>
                    <p className="text-sm text-gray-500">Manage and monitor your Vouchers</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Voucher
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-8 border-b border-gray-100">
                <button
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Vouchers (10)
                </button>
                <button
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'inactive' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('inactive')}
                >
                    Inactive Vouchers (5)
                </button>
            </div>

            {filteredVouchers.length > 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Active Vouchers</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </button>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="h-8 max-w-[200px] rounded-md border border-gray-200 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Discount</th>
                                    <th className="px-6 py-3 font-medium">Validity days</th>
                                    <th className="px-6 py-3 font-medium">Created On</th>
                                    <th className="px-6 py-3 font-medium">Valid till</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVouchers.map((voucher) => (
                                    <tr key={voucher.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{voucher.discount}</td>
                                        <td className="px-6 py-4 text-gray-900">{voucher.validityDays}</td>
                                        <td className="px-6 py-4">{voucher.createdOn}</td>
                                        <td className="px-6 py-4">{voucher.validTill}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium w-fit">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                                                {voucher.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionMenu
                                                onEdit={() => console.log("Edit voucher", voucher.id)}
                                                onDelete={() => console.log("Delete voucher", voucher.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                        <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Previous
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-900">1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>...</span>
                            <span>9</span>
                            <span>10</span>
                        </div>
                        <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100">
                    <EmptyState
                        title="You haven't created any voucher yet"
                        description=""
                    />
                </div>
            )}
        </div>
    );
}
