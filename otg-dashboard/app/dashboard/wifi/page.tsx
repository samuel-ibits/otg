"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { Tabs } from "@/app/components/Tabs";
import { ActiveSessionsTable } from "@/app/components/ActiveSessionsTable";
import { CompletedSessionsTable } from "@/app/components/CompletedSessionsTable";
import { RouterAndSubscriptions } from "@/app/components/RouterAndSubscriptions";

export default function WiFiPage() {
    const [activeTab, setActiveTab] = useState("active-sessions");

    const tabs = [
        { label: "Active Sessions", value: "active-sessions" },
        { label: "Completed Sessions", value: "completed-sessions" },
        { label: "Routers & Subscriptions packages", value: "router-subscriptions" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wi-Fi</h1>
                    <p className="text-sm text-gray-500">Manage and monitor your Wi-Fi Infrastructure</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    {activeTab !== 'router-subscriptions' && (
                        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                            <Plus className="h-4 w-4" />
                            Create Plan
                        </button>
                    )}
                </div>
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {activeTab === "active-sessions" && <ActiveSessionsTable />}
                {activeTab === "completed-sessions" && <CompletedSessionsTable />}
                {activeTab === "router-subscriptions" && <RouterAndSubscriptions />}
            </div>
        </div>
    );
}
