"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";

interface TabsProps {
    tabs: { label: string; value: string }[];
    activeTab: string;
    onTabChange: (value: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
    return (
        <div className={cn("border-b border-gray-100", className)}>
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === tab.value
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                        aria-current={activeTab === tab.value ? "page" : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
