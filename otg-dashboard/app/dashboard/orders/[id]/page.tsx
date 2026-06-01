"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { orderService } from "@/app/lib/services/orderService";
import { Order } from "@/app/lib/types";
import { ChevronLeft } from "lucide-react";
// import { toast } from "sonner"; // Removed as not available

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        try {
            const response = await orderService.getOrderDetails(id);
            if (response.success) {
                setOrder(response.data);
            } else {
                setError(response.message || "Failed to fetch order details");
            }
        } catch (err: any) {
            setError(err.message || "Error fetching order");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id, fetchOrder]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return;
        try {
            await orderService.updateOrderStatus(order.id, newStatus);
            fetchOrder(); // Refresh
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!order) return <div className="p-8 text-center text-gray-500">Order not found</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Orders
            </button>

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order {order.orderId}</h1>
                    <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Status Actions */}
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Items */}
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="font-semibold text-gray-900">Order Items</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-gray-100" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {item.product?.name || `Product #${item.productId}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} x {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.totalAmount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Total</span>
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">Customer</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                {order.customer.picture && (
                                    <img src={order.customer.picture} alt="" className="h-full w-full object-cover" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {order.customer.user.firstName} {order.customer.user.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{order.customer.userName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">Order Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className="font-medium capitalize text-gray-900">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment</span>
                                <span className="font-medium capitalize text-gray-900">{order.paymentStatus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Auto Renew</span>
                                <span className="font-medium capitalize text-gray-900">{order.autoRenew ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
