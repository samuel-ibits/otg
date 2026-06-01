/**
 * Router API Service
 * 
 * Example service demonstrating how to use the API utilities
 * for router-related operations.
 */

import { api, buildQueryString, APIResponse } from '../api';
import type {
  Router,
  CreateRouterDTO,
  UpdateRouterDTO,
  PaginationParams,
  PaginatedResponse,
} from '../types';

const ROUTER_ENDPOINTS = {
  base: '/routers',
  byId: (id: string | number) => `/routers/${id}`,
  toggle: (id: string | number) => `/routers/${id}/toggle`,
  connections: (id: string | number) => `/routers/${id}/connections`,
};

export const routerService = {
  /**
   * Get all routers with optional pagination
   */
  async getAll(
    params?: PaginationParams
  ): Promise<APIResponse<PaginatedResponse<Router>>> {
    const queryString = params ? buildQueryString(params) : '';
    return api.get(`${ROUTER_ENDPOINTS.base}${queryString}`);
  },

  /**
   * Get a single router by ID
   */
  async getById(id: string | number): Promise<APIResponse<Router>> {
    return api.get(ROUTER_ENDPOINTS.byId(id));
  },

  /**
   * Create a new router
   */
  async create(data: CreateRouterDTO): Promise<APIResponse<Router>> {
    return api.post(ROUTER_ENDPOINTS.base, data);
  },

  /**
   * Update an existing router
   */
  async update(
    id: string | number,
    data: UpdateRouterDTO
  ): Promise<APIResponse<Router>> {
    return api.put(ROUTER_ENDPOINTS.byId(id), data);
  },

  /**
   * Delete a router
   */
  async delete(id: string | number): Promise<APIResponse<void>> {
    return api.delete(ROUTER_ENDPOINTS.byId(id));
  },

  /**
   * Toggle router status (on/off)
   */
  async toggleStatus(
    id: string | number,
    status: boolean
  ): Promise<APIResponse<Router>> {
    return api.patch(ROUTER_ENDPOINTS.toggle(id), { status });
  },

  /**
   * Get router connection details
   */
  async getConnections(id: string | number): Promise<APIResponse<any>> {
    return api.get(ROUTER_ENDPOINTS.connections(id));
  },
};

/**
 * React Hook Example for using the router service
 *
 * Usage in a component:
 *
 * import { useRouters } from '@/app/lib/services/routerService';
 *
 * function RouterList() {
 *   const { routers, loading, error, refetch } = useRouters();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {routers.map(router => (
 *         <div key={router.id}>{router.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */

// Uncomment to use with React hooks
/*
import { useState, useEffect } from 'react';

export function useRouters(params?: PaginationParams) {
  const [routers, setRouters] = useState<Router[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRouters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await routerService.getAll(params);
      
      if (response.success && response.data) {
        setRouters(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch routers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouters();
  }, [JSON.stringify(params)]);

  return { routers, loading, error, refetch: fetchRouters };
}
*/
