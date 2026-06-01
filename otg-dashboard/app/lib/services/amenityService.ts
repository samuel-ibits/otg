import { api, APIResponse } from '../api';

export interface Amenity {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface BranchAmenity {
    id: string;
    amenityId: string;
    amenityName: string;
    status: string;
}

export const amenityService = {
    async getGlobal(): Promise<APIResponse<Amenity[]>> {
        return api.get('/amenities/global', { useAdmin: false });
    },

    async getByBranch(branchId?: string | number): Promise<APIResponse<BranchAmenity[]>> {
        return api.get(`/amenities/branch/${branchId}`, { useAdmin: false });
    },

    async updateBranchAmenities(branchId: string | number, amenityIds: string[]): Promise<APIResponse<any>> {
        return api.put(`/amenities/branch/${branchId}`, { amenityIds }, { useAdmin: false });
    },
};
