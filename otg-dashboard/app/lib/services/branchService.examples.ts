/**
 * Branch API Integration Examples
 * 
 * This file demonstrates how to use the branch service
 * with the OTG Dashboard API.
 */

import { branchService } from '@/app/lib/services/branchService';
import type { CreateBranchDTO } from '@/app/lib/types';

// ============================================
// Example 1: Create a New Branch
// ============================================

export async function createVictoriaIslandBranch() {
    const branchData: CreateBranchDTO = {
        name: "Victoria Island Branch",
        fullAddress: "23 Awolowo Road, Victoria Island, Lagos",
        description: "Premium branch for corporate clients",
        streetAddress: "23 Awolowo Road",
        state: "Lagos",
        country: "Nigeria",
        city: "Victoria Island",
        working_hours: {
            monday: { open: "09:00", close: "18:00" },
            tuesday: { open: "09:00", close: "18:00" },
            wednesday: { open: "09:00", close: "18:00" },
            thursday: { open: "09:00", close: "18:00" },
            friday: { open: "09:00", close: "18:00" },
            saturday: { open: "10:00", close: "15:00" },
            sunday: { open: null, close: null }
        },
        amenities: [
            "0d7ba257-2443-43fe-86f4-509c013bf04e",
            "538a9261-994f-46d6-87da-dbe9e5518794",
            "63486a4e-2e80-4358-a2f0-b608a099467c"
        ],
        staff: [
            {
                fullName: "Alice Johnson",
                email: "alice.johnson@example.com",
                role: "admin"
            },
            {
                fullName: "Michael Brown",
                email: "michael.brown@example.com",
                role: "receptionist"
            },
            {
                fullName: "Grace Lee",
                email: "grace.lee@example.com",
                role: "cashier"
            }
        ]
    };

    try {
        const response = await branchService.create(branchData);

        if (response.success && response.data) {
            console.log('Branch created successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to create branch:', response.error);
            throw new Error(response.error || 'Failed to create branch');
        }
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
    }
}

// ============================================
// Example 2: Get All Branches with Search
// ============================================

export async function searchBranches(searchTerm: string = 'Kachie') {
    try {
        const response = await branchService.getAll({
            search: searchTerm,
            limit: 10,
            cursor: '2025-11-30T21:34:18.000Z_6'
        });

        if (response.success && response.data) {
            console.log('Branches found:', response.data.data);
            return response.data.data;
        } else {
            console.error('Failed to fetch branches:', response.error);
            return [];
        }
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
}

// ============================================
// Example 3: Get Branch by ID
// ============================================

export async function getBranchDetails(branchId: string) {
    try {
        const response = await branchService.getById(branchId);

        if (response.success && response.data) {
            console.log('Branch details:', response.data);
            return response.data;
        } else {
            console.error('Failed to fetch branch:', response.error);
            throw new Error(response.error || 'Branch not found');
        }
    } catch (error) {
        console.error('Error fetching branch:', error);
        throw error;
    }
}

// ============================================
// Example 4: Delete Branch
// ============================================

export async function deleteBranch(branchId: string) {
    try {
        const response = await branchService.delete(branchId);

        if (response.success) {
            console.log('Branch deleted successfully');
            return true;
        } else {
            console.error('Failed to delete branch:', response.error);
            throw new Error(response.error || 'Failed to delete branch');
        }
    } catch (error) {
        console.error('Error deleting branch:', error);
        throw error;
    }
}

// ============================================
// Example 5: Update Branch
// ============================================

export async function updateBranch(branchId: string) {
    try {
        const response = await branchService.update(branchId, {
            description: "Updated description for premium branch",
            status: "active"
        });

        if (response.success && response.data) {
            console.log('Branch updated successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to update branch:', response.error);
            throw new Error(response.error || 'Failed to update branch');
        }
    } catch (error) {
        console.error('Error updating branch:', error);
        throw error;
    }
}

// ============================================
// Example 6: React Component Usage
// ============================================

/*
'use client';

import { useState, useEffect } from 'react';
import { branchService } from '@/app/lib/services/branchService';
import type { Branch } from '@/app/lib/types';

export function BranchList() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchService.getAll({
        search: searchTerm,
        limit: 10
      });

      if (response.success && response.data) {
        setBranches(response.data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      await branchService.delete(id);
      fetchBranches(); // Refresh list
    } catch (err) {
      alert('Failed to delete branch');
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [searchTerm]);

  if (loading) return <div>Loading branches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search branches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        {branches.map((branch) => (
          <div key={branch.id}>
            <h3>{branch.name}</h3>
            <p>{branch.fullAddress}</p>
            <p>{branch.description}</p>
            <button onClick={() => handleDelete(branch.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
