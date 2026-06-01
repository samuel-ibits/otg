/**
 * Branch API Service
 * 
 * Handles all branch-related API operations including CRUD operations,
 * search, and filtering.
 */

import { api, buildQueryString, APIResponse, getAuthHeader } from '../api';
import type {
  Branch,
  CreateBranchDTO,
  UpdateBranchDTO,
  BranchQueryParams,
  PaginatedResponse,
  BranchActivityLog,
  BranchMedia,
  BranchReview,
  BranchReviewsData,
  BranchWifiPlan,
  Product,
  BranchDashboardStats,
  ChartData,
  BranchStaff,
} from '../types';

const BRANCH_ENDPOINTS = {
  base: 'branches',
  create: 'branches/create',
  byId: (id: string) => `branches/${id}`,
  orders: (id: string) => `branches/${id}/orders`,
  wifi: (id: string) => `branches/${id}/wifi-infrastructure`,
  products: 'products',
  activityLogs: 'branches/activity-logs',
  media: 'branches/media',
  reviews: 'branches/reviews',
  staff: (id: string) => `branches/${id}/staff`,
};

export const branchService = {
  /**
   * Get all branches with optional search and filtering
   * 
   * @param params - Query parameters (search, cursor, limit)
   * @returns Promise with paginated branches
   */
  async getAll(
    params?: BranchQueryParams
  ): Promise<APIResponse<PaginatedResponse<Branch>>> {
    const queryString = params ? buildQueryString(params) : '';
    return api.get(`${BRANCH_ENDPOINTS.base}${queryString}`, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Get a single branch by ID
   * 
   * @param id - Branch ID
   * @returns Promise with branch data
   */
  async getById(id: string): Promise<APIResponse<{ branchInfo: Branch; stats: BranchDashboardStats; chartData: ChartData[] }>> {
    return api.get(BRANCH_ENDPOINTS.byId(id), {
      headers: getAuthHeader(),
    });
  },

  /**
   * Create a new branch
   * 
   * @param data - Branch creation data
   * @returns Promise with created branch
   */
  async create(data: CreateBranchDTO): Promise<APIResponse<Branch>> {
    return api.post(BRANCH_ENDPOINTS.create, data, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Update an existing branch
   * 
   * @param id - Branch ID
   * @param data - Branch update data
   * @returns Promise with updated branch
   */
  async update(
    id: string,
    data: UpdateBranchDTO
  ): Promise<APIResponse<Branch>> {
    return api.put(BRANCH_ENDPOINTS.byId(id), data, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Delete a branch
   * 
   * @param id - Branch ID
   * @returns Promise with deletion confirmation
   */
  async delete(id: string): Promise<APIResponse<void>> {
    return api.delete(BRANCH_ENDPOINTS.byId(id), {
      headers: getAuthHeader(),
    });
  },

  /**
   * Search branches
   * 
   * @param searchTerm - Search term
   * @param limit - Number of results
   * @returns Promise with search results
   */
  async search(
    searchTerm: string,
    limit: number = 10
  ): Promise<APIResponse<PaginatedResponse<Branch>>> {
    return this.getAll({ search: searchTerm, limit });
  },

  /**
   * Get branch orders
   */
  async getOrders(
    branchId: string,
    params?: any
  ): Promise<APIResponse<any>> { // Using any for now to match strict UI needs or complex backend response
    const queryString = params ? buildQueryString(params) : '';
    return api.get(`${BRANCH_ENDPOINTS.orders(branchId)}${queryString}`, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Get branch Wi-Fi infrastructure
   */
  async getWifiInfrastructure(branchId: string): Promise<APIResponse<{ wifiPlans: BranchWifiPlan[] }>> {
    return api.get(BRANCH_ENDPOINTS.wifi(branchId), {
      headers: getAuthHeader(),
    });
  },

  /**
   * Get products (filtered for branch context if needed, though endpoint is generic /products)
   */
  async getProducts(params?: any): Promise<APIResponse<PaginatedResponse<Product>>> {
    const queryString = params ? buildQueryString(params) : '';
    return api.get(`${BRANCH_ENDPOINTS.products}${queryString}`, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Get branch activity logs
   */
  async getActivityLogs(branchId: string): Promise<APIResponse<{ logs: BranchActivityLog[] }>> {
    return api.get(`${BRANCH_ENDPOINTS.activityLogs}?branchId=${branchId}`, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Get branch media
   */
  async getMedia(branchId: string): Promise<APIResponse<{ media: BranchMedia[] }>> {
    return api.get(`${BRANCH_ENDPOINTS.media}?branchId=${branchId}`, {
      headers: getAuthHeader(),
    });
  },

  /**
   * Get branch reviews
   */
  async getReviews(branchId: string): Promise<APIResponse<BranchReviewsData>> {
    return api.get(`${BRANCH_ENDPOINTS.reviews}?branchId=${branchId}`, {
      headers: getAuthHeader(),
    });
  },

  // get staff
  async getStaff(branchId: string): Promise<APIResponse<{ staff: BranchStaff[] }>> {
    return api.get(BRANCH_ENDPOINTS.staff(branchId), {
      headers: getAuthHeader(),
    });
  }
};
/**
 * React Hook for managing branches
 *
 * Usage:
 * ```typescript
 * const { branches, loading, error, refetch, createBranch, deleteBranch } = useBranches();
 * ```
 */

// Uncomment to use with React hooks
/*
import { useState, useEffect, useCallback } from 'react';

export function useBranches(params?: BranchQueryParams) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchService.getAll(params);
      
      if (response.success && response.data) {
        setBranches(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch branches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  const createBranch = async (data: CreateBranchDTO) => {
    try {
      const response = await branchService.create(data);
      if (response.success) {
        await fetchBranches(); // Refresh list
        return response.data;
      }
      throw new Error(response.error || 'Failed to create branch');
    } catch (err) {
      throw err;
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      const response = await branchService.delete(id);
      if (response.success) {
        await fetchBranches(); // Refresh list
      } else {
        throw new Error(response.error || 'Failed to delete branch');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { 
    branches, 
    loading, 
    error, 
    refetch: fetchBranches,
    createBranch,
    deleteBranch,
  };
}
*/
