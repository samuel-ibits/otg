import { api, buildQueryString, APIResponse } from '../api';
import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
    PaginationParams,
    PaginatedResponse,
} from '../types';

const PRODUCT_ENDPOINTS = {
    base: 'products',
    byId: (id: string | number) => `products/${id}`,
};

export const productService = {
    /**
     * Get all products with optional pagination
     */
    async getAll(
        params?: PaginationParams
    ): Promise<APIResponse<PaginatedResponse<Product>>> {
        const queryString = params ? buildQueryString(params) : '';
        return api.get(`${PRODUCT_ENDPOINTS.base}${queryString}`);
    },

    /**
     * Get a single product by ID
     */
    async getById(id: string | number): Promise<APIResponse<Product>> {
        return api.get(PRODUCT_ENDPOINTS.byId(id));
    },

    /**
     * Create a new product
     */
    async create(data: CreateProductDTO): Promise<APIResponse<Product>> {
        return api.post(PRODUCT_ENDPOINTS.base, data);
    },

    /**
     * Update an existing product
     */
    async update(
        id: string | number,
        data: UpdateProductDTO
    ): Promise<APIResponse<Product>> {
        return api.patch(PRODUCT_ENDPOINTS.byId(id), data);
    },

    /**
     * Delete a product
     */
    async delete(id: string | number): Promise<APIResponse<void>> {
        return api.delete(PRODUCT_ENDPOINTS.byId(id));
    },

    /**
     * Get products filtered by branch
     */
    async filterByBranch(
        branchId: string | number,
        params?: PaginationParams
    ): Promise<APIResponse<PaginatedResponse<Product>>> {
        return this.getAll({ ...params, branchId });
    },
};
