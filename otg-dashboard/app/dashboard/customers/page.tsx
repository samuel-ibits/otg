"use client";

import { useState } from "react";
import { CustomerDrawer } from "@/app/components/CustomerDrawer";
import { Search, SlidersHorizontal, MoreVertical } from "lucide-react";
import { ActionMenu } from "@/app/components/ActionMenu";

// Mock Data
const customers = [
    { id: 1, name: "Sophia Williams", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Bronze", location: "Lagos", date: "28 Jan, 2025" },
    { id: 2, name: "Emeka Nwosu", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Silver", location: "Lagos", date: "28 Jan, 2025" },
    { id: 3, name: "Chinedu Okafor", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Gold", location: "Lagos", date: "28 Jan, 2025" },
    { id: 4, name: "Amina Bello", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Bronze", location: "Lagos", date: "28 Jan, 2025" },
    { id: 5, name: "Tunde Adeyemi", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Bronze", location: "Lagos", date: "28 Jan, 2025" },
    { id: 6, name: "Fatima Abdullahi", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Bronze", location: "Lagos", date: "28 Jan, 2025" },
    { id: 7, name: "Ifeoma Uche", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Silver", location: "Lagos", date: "28 Jan, 2025" },
    { id: 8, name: "Obinna Eze", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Silver", location: "Lagos", date: "28 Jan, 2025" },
    { id: 9, name: "Zainab Mohammed", email: "sophiawilliams@email.com", role: "Data Analyst", loyalty: "Gold", location: "Lagos", date: "28 Jan, 2025" },
];

export default function CustomersPage() {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleRowClick = (customer: any) => {
        setSelectedCustomer(customer);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedCustomer(null), 300); // Clear after animation
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500">Manage and monitor customers activity</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Customers</h3>
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
                                <th className="px-6 py-3 font-medium">Customers</th>
                                <th className="px-6 py-3 font-medium">Email address</th>
                                <th className="px-6 py-3 font-medium">Occupation</th>
                                <th className="px-6 py-3 font-medium">Loyalty level</th>
                                <th className="px-6 py-3 font-medium">Location</th>
                                <th className="px-6 py-3 font-medium">Date joined</th>
                                <th className="px-6 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => handleRowClick(customer)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                                                {/* Mock Avatar */}
                                                <div className="h-full w-full flex items-center justify-center font-bold text-gray-500 text-xs">
                                                    {customer.name[0]}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{customer.name}</span>
                                                <span className="text-xs text-gray-500">@handle</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{customer.email}</td>
                                    <td className="px-6 py-4 text-gray-900">{customer.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium border
                                    ${customer.loyalty === 'Gold' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                                                customer.loyalty === 'Silver' ? 'border-gray-200 bg-gray-50 text-gray-700' :
                                                    'border-orange-200 bg-orange-50 text-orange-700'
                                            }`}>
                                            {/* Icon placeholder if needed */}
                                            {customer.loyalty === 'Gold' && '🥇'}
                                            {customer.loyalty === 'Silver' && '🥈'}
                                            {customer.loyalty === 'Bronze' && '🥉'}
                                            {customer.loyalty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">{customer.location}</td>
                                    <td className="px-6 py-4 text-gray-900">{customer.date}</td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <ActionMenu
                                            onEdit={() => console.log("Edit customer", customer.id)}
                                            onDelete={() => console.log("Delete customer", customer.id)}
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
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                    </div>
                    <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>

            <CustomerDrawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                customer={selectedCustomer}
            />
        </div>
    );
}
