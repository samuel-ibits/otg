"use client";

import { X, MapPin, Mail, Briefcase, Award } from "lucide-react";
import { useState } from "react";
import { Tabs } from "./Tabs";
import { cn } from "@/app/lib/utils";

interface CustomerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any; // Type this properly if sharing types
}

export function CustomerDrawer({ isOpen, onClose, customer }: CustomerDrawerProps) {
    const [activeTab, setActiveTab] = useState("wifi");

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative z-10 w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                            {/* Fallback avatar */}
                            <div className="h-full w-full flex items-center justify-center text-lg font-bold text-gray-500">
                                {customer.avatar || customer.name?.[0]}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{customer.name}</h2>
                            <p className="text-sm text-gray-500">Customer hasn&apos;t placed any orders yet.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Bio Section */}
                <div className="p-6 border-b border-gray-100">
                    <p className="text-sm text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Data Analyst</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Award className="h-3.5 w-3.5" />
                            <span>Jan 2025</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                            1.2k Following
                            <span className="text-gray-300">|</span>
                            4.3k Followers
                            <span className="text-gray-300">|</span>
                            22 Reviews
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100 sticky top-[89px] bg-white z-20">
                    <Tabs
                        tabs={[
                            { label: "Wi-Fi Usage", value: "wifi" },
                            { label: "Orders", value: "orders" },
                            { label: "Review", value: "review" },
                            { label: "Skills & Hobbies", value: "skills" },
                        ]}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "wifi" && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Device</div>
                                    <div className="font-medium text-gray-900">CafeOne_IV_41</div>
                                    <div className="text-xs text-gray-500">Daily - Unlimited</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full inline-block mb-1">Active</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                                    <div className="font-bold text-gray-900">1.5h</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-xs text-gray-500 mb-1">Data used</div>
                                    <div className="font-bold text-gray-900">2.1 GB</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500 mb-2">Time connected</div>
                                <div className="font-medium text-gray-900">03:00 PM</div>
                            </div>

                            <div className="bg-indigo-600 text-white rounded-xl p-6 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="text-4xl font-bold">11</div>
                                    <div className="text-sm opacity-80">Times visited</div>
                                </div>
                                {/* Decorative background shape */}
                                <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">f</div>
                                    <span className="text-sm text-gray-600">www.facebook.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">in</div>
                                    <span className="text-sm text-gray-600">www.instagram.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">G</div>
                                    <span className="text-sm text-gray-600">www.google.com</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "orders" && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-900">Order #OTG-3452</span>
                                    <span className="text-xs text-gray-500">28 Jan, 09:20</span>
                                </div>
                                <div className="text-sm text-gray-600">Wi-Fi (Daily) • Coffee</div>
                                <div className="mt-2 font-medium text-gray-900">₦4,500</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-900">Order #OTG-3450</span>
                                    <span className="text-xs text-gray-500">27 Jan, 14:30</span>
                                </div>
                                <div className="text-sm text-gray-600">Food • Drinks</div>
                                <div className="mt-2 font-medium text-gray-900">₦8,200</div>
                            </div>
                        </div>
                    )}
                    {activeTab === "review" && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">Hassan El-Gabit</h3>
                                    <span className="text-xs text-gray-500">2w ago</span>
                                </div>
                                <div className="flex text-yellow-400 text-xs mb-2">★★★★★</div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    The food is one of the best I&apos;ve tasted so far. An amazing fresh menu for all dietary needs... <span className="text-blue-600 cursor-pointer">see less</span>
                                </p>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "skills" && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                                    <button className="text-xs text-blue-600">Edit</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['UI/UX (Basic)', 'Design', 'Time management'].map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-900">Interests</h3>
                                    <button className="text-xs text-blue-600">Edit</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Singing', 'Reading(4)', 'Swimming', 'Photography'].map(item => (
                                        <span key={item} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-900">Places to visit</h3>
                                    <button className="text-xs text-blue-600">Edit</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Restaurant', 'Music Lounge', 'Co-working space'].map(item => (
                                        <span key={item} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
