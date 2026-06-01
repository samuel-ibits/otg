import { api, buildQueryString } from '../api';
import { Order, CreateOrderDTO, UpdateOrderDTO } from '../types';

export const orderService = {
    /**
     * Get orders for a specific branch
     */
    getBranchOrders: async (params: { from?: string; to?: string; orderStatus?: string; status?: string; page?: number; limit?: number }) => {
        const queryString = buildQueryString(params);
        return api.get<{
            success: boolean;
            message: string;
            data: {
                orders: Order[];
                total: number;
                nextCursor: string | null;
                hasNextPage: boolean;
            };
        }>(`/orders${queryString}`);
    },

    /**
     * Get order details by ID
     */
    getOrderDetails: async (id: string) => {
        return api.get<{
            success: boolean;
            message: string;
            data: Order;
        }>(`/orders/${id}`);
    },

    /**
     * Update order status
     */
    updateOrderStatus: async (id: string, status: string) => {
        const queryString = buildQueryString({ status });
        return api.put<{
            success: boolean;
            message: string;
            data: Order;
        }>(`/orders/${id}/orderStatus${queryString}`);
    },

    /**
     * Create a new order
     */
    createOrder: async (data: CreateOrderDTO) => {
        return api.post<{
            success: boolean;
            message: string;
            data: Order;
        }>('/orders', data, { useAdmin: false }); // Note: Using regular base URL as per requirement
    },

    /**
     * Delete an order
     */
    deleteOrder: async (id: string) => {
        return api.delete<{
            success: boolean;
            message: string;
        }>(`/orders/${id}`);
    }
};
