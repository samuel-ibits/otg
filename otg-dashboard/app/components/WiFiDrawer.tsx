"use client";

import { X } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";
import { useState } from "react";
import { cn } from "@/app/lib/utils";

interface WiFiDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    plan: any;
}

export function WiFiDrawer({ isOpen, onClose, plan }: WiFiDrawerProps) {
    const [activeTab, setActiveTab] = useState("details");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative z-10 w-full max-w-lg bg-white shadow-xl transition-transform duration-300 ease-in-out h-full overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Wi-Fi Management</h2>
                        <p className="text-sm text-gray-500">Manage and configure your Wi-Fi plans</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-100 px-6">
                    <div className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={cn(
                                "py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === "details" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Plan details
                        </button>
                        <button
                            onClick={() => setActiveTab("branding")}
                            className={cn(
                                "py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === "branding" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Branding
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {activeTab === "details" && (
                        <>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900">Status</h4>
                                    <p className="text-xs text-gray-500">Enable or disable this plan</p>
                                </div>
                                <Switch checked={true} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1">Plan name</div>
                                    <div className="font-semibold text-gray-900">Daily - Unlimited</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1">Price</div>
                                    <div className="font-semibold text-gray-900">₦ 2,000</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1">Upload speed</div>
                                    <div className="font-semibold text-gray-900">50 Mbps</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-xs text-gray-500 mb-1">Download speed</div>
                                    <div className="font-semibold text-gray-900">50 Mbps</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Time limit</div>
                                <div className="font-semibold text-gray-900">Unlimited</div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Data limit</div>
                                <div className="font-semibold text-gray-900">Unlimited</div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Device limit</div>
                                <div className="font-semibold text-gray-900">2 Devices</div>
                            </div>
                        </>
                    )}
                    {activeTab === "branding" && (
                        <div className="text-center text-gray-500 py-12">
                            Branding settings...
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white z-20">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
