"use client";

import { Check, MoreVertical } from "lucide-react";
import { ActionMenu } from "./ActionMenu";

const subscriptions = [
    { id: 1, name: "Daily - Unlimited", price: "₦ 2,000", features: ["Unlimited Data", "24 Hours Validity", "50 Mbps Speed", "2 Devices"], active: true },
    { id: 2, name: "Weekly - Standard", price: "₦ 5,000", features: ["10 GB Data", "7 Days Validity", "20 Mbps Speed", "2 Devices"], active: true },
    { id: 3, name: "Monthly - Pro", price: "₦ 15,000", features: ["Unlimited Data", "30 Days Validity", "100 Mbps Speed", "5 Devices"], active: false },
    { id: 4, name: "Weekend Special", price: "₦ 3,500", features: ["Unlimited Data", "48 Hours Validity", "50 Mbps Speed", "3 Devices"], active: true },
];

export function VoucherSubscriptions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative">
                    <div className="absolute top-4 right-4">
                        <ActionMenu
                            onEdit={() => console.log("Edit plan", sub.id)}
                            onDelete={() => console.log("Delete plan", sub.id)}
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{sub.name}</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-4">{sub.price}</div>

                    <div className="space-y-3 mb-6">
                        {sub.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-3 w-3 text-blue-600" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${sub.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                            {sub.active ? "Active" : "Inactive"}
                        </span>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
