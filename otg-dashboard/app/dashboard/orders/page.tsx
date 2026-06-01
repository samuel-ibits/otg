"use client";

import { useState, useEffect, useCallback } from "react";
import { OrdersTable } from "@/app/components/OrdersTable";
import { Tabs } from "@/app/components/Tabs";
import { EmptyState } from "@/app/components/EmptyState";
import { orderService } from "@/app/lib/services/orderService";
import { Order } from "@/app/lib/types";

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const status = activeTab === 'all' ? undefined : activeTab;
            // Map 'new' to 'pending' if needed, or keep 'pending' as the tab value.
            // Let's use the API status values for tabs to be safe.
            let statusParam = status;
            if (activeTab === 'new') statusParam = 'new';

            const response = await orderService.getBranchOrders({
                orderStatus: statusParam,
                limit: 50 // Fetch more to be safe for now
            });

            if (response.success) {
                setOrders(response.data.orders);
            } else {
                setError(response.message || "Failed to fetch orders");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        try {
            const response = await orderService.deleteOrder(id);
            if (response.success) {
                // Remove from local state immediately for speed, or refetch
                setOrders(prev => prev.filter(o => o.id !== id));
            } else {
                alert(response.message || "Failed to delete order");
            }
        } catch (err) {
            console.error("Failed to delete order", err);
            alert("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500">Manage and monitor your orders</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-1">
                <Tabs
                    tabs={[
                        { label: "All Orders", value: "all" },
                        { label: "New (Pending)", value: "new" },
                        { label: "Ongoing", value: "ongoing" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" },
                    ]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="px-4"
                />
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center rounded-xl bg-white text-gray-500">
                    Loading orders...
                </div>
            ) : error ? (
                <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl bg-white text-red-500">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchOrders()}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : orders.length > 0 ? (
                <OrdersTable orders={orders} onDelete={handleDelete} />
            ) : (
                <div className="bg-white rounded-xl border border-gray-100">
                    <EmptyState
                        title="No orders found"
                        description="There are no orders in this category."
                    />
                </div>
            )}
        </div>
    );
}
