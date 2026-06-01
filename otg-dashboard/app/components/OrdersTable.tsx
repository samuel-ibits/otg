"use client";

import { ActionMenu } from "./ActionMenu";
import { Search, Filter } from "lucide-react";
import { Order } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

interface OrdersTableProps {
    orders: Order[];
    onDelete?: (id: string) => void;
}

export function OrdersTable({ orders, onDelete }: OrdersTableProps) {
    const router = useRouter();
    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">Orders</h3>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-full w-64 rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">S/N</th>
                            <th className="px-6 py-3 font-medium">Order ID</th>
                            <th className="px-6 py-3 font-medium">Order type</th>
                            <th className="px-6 py-3 font-medium">Customers</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order, index) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.orderId}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {order.amenitiesCategory.map((cat, i) => (
                                            <span key={i} className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 capitalize">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                                            {order.customer.picture ? (
                                                <img
                                                    src={order.customer.picture}
                                                    alt={order.customer.user.firstName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-orange-100 text-xs font-medium text-orange-600">
                                                    {order.customer.user.firstName[0]}{order.customer.user.lastName[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {order.customer.user.firstName} {order.customer.user.lastName}
                                            </span>
                                            <span className="text-xs text-gray-500">{order.customer.userName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.totalAmount)}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "rounded px-2 py-1 text-xs font-medium capitalize",
                                        order.status === 'completed' ? "bg-green-100 text-green-700" :
                                            order.status === 'ongoing' ? "bg-blue-100 text-blue-700" :
                                                order.status === 'cancelled' ? "bg-red-100 text-red-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <ActionMenu
                                        onView={() => router.push(`/dashboard/orders/${order.id}`)}
                                        onDelete={() => onDelete?.(order.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
