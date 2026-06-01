"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { ProfileView } from "@/app/components/settings/ProfileView";
import { PasswordView, InfrastructureView, AmenitiesView, StaffView } from "@/app/components/settings/Placeholders";

const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "wifi", label: "Wi-Fi Infrastructure" },
    { id: "amenities", label: "Amenities" },
    { id: "staff", label: "Staff" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500">Control everything about your account here.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
                {/* Navigation */}
                <div className="border-b border-gray-100 px-6 overflow-x-auto">
                    <div className="flex space-x-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {activeTab === "profile" && <ProfileView />}
                    {activeTab === "password" && <PasswordView />}
                    {activeTab === "wifi" && <InfrastructureView />}
                    {activeTab === "amenities" && <AmenitiesView />}
                    {activeTab === "staff" && <StaffView />}
                </div>
            </div>
        </div>
    );
}
