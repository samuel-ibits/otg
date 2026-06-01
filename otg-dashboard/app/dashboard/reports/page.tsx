"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { FinancialView } from "@/app/components/reports/FinancialView";
import { WiFiView } from "@/app/components/reports/WiFiView";
import { CustomerView } from "@/app/components/reports/CustomerView";

// Mock Data
const tabs = [
    { id: "financial", label: "Financial Report" },
    { id: "wifi", label: "Wi-Fi Usage Insights" },
    { id: "customer", label: "Customer Insights" }
];

const timeFilters = ["12 months", "30 days", "7 days", "24 hours"];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState("financial");
    const [activeTimeFilter, setActiveTimeFilter] = useState("12 months");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-sm text-gray-500">Manage and monitor branches activity</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <SlidersHorizontal className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            <div>
                {/* Main Navigation Tabs */}
                <div className="flex gap-8 border-b border-gray-100 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "pb-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Time Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {timeFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveTimeFilter(filter)}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                activeTimeFilter === filter ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div>
                    {activeTab === "financial" && <FinancialView />}
                    {activeTab === "wifi" && <WiFiView />}
                    {activeTab === "customer" && <CustomerView />}
                </div>
            </div>
        </div>
    );
}
