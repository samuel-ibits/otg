"use client";

import { useState, useEffect } from "react";
import { Plus, MoreVertical, Search, SlidersHorizontal, Download } from "lucide-react";
import { AddBranchModal } from "@/app/components/AddBranchModal";
import { BranchActionModal } from "@/app/components/BranchActionModals";
import { useRouter } from "next/navigation";
import { branchService } from "@/app/lib/services/branchService";
import type { Branch } from "@/app/lib/types";
import * as XLSX from 'xlsx';

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);

    // Action Modals State
    const [modalType, setModalType] = useState<"deactivate" | "delete" | null>(null);
    const [actionBranch, setActionBranch] = useState<Branch | null>(null);

    const router = useRouter();

    // Fetch branches from API
    const fetchBranches = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getAll({
                search: searchTerm || undefined,
                limit: 50
            });

            if (response.success && response.data) {
                setBranches((response.data as any).branches || []);
            } else {
                setError(response.error || "Failed to load branches");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Fetch branches on mount and when search term changes
    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchBranches();
        }, 300); // Debounce search

        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleActionClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setActiveActionId(activeActionId === id ? null : id);
    };

    const openActionModal = (e: React.MouseEvent, type: "deactivate" | "delete", branch: Branch) => {
        e.stopPropagation();
        setModalType(type);
        setActionBranch(branch);
        setActiveActionId(null);
    };

    const handleDelete = async () => {
        if (!actionBranch) return;

        try {
            const response = await branchService.delete(actionBranch.id);

            if (response.success) {
                setModalType(null);
                setActionBranch(null);
                fetchBranches(); // Refresh list
            } else {
                alert(response.error || "Failed to delete branch");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete branch");
        }
    };

    const handleDeactivate = async () => {
        if (!actionBranch) return;

        try {
            const response = await branchService.update(actionBranch.id, {
                status: "inactive"
            });

            if (response.success) {
                setModalType(null);
                setActionBranch(null);
                fetchBranches(); // Refresh list
            } else {
                alert(response.error || "Failed to deactivate branch");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to deactivate branch");
        }
    };

    const handleConfirmAction = () => {
        if (modalType === "delete") {
            handleDelete();
        } else if (modalType === "deactivate") {
            handleDeactivate();
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getAdminName = (branch: Branch) => {
        const admin = branch.staff?.find(s => s.role === 'admin');
        return admin?.fullName || "N/A";
    };

    const exportToExcel = () => {
        if (branches.length === 0) {
            alert("No data to export");
            return;
        }

        // Prepare data for export
        const exportData = branches.map((branch, index) => ({
            'S/N': index + 1,
            'Branch Name': branch.name,
            'Admin': getAdminName(branch),
            'Location': `${branch.city}, ${branch.state}`,
            'Full Address': branch.fullAddress,
            'Street Address': branch.streetAddress,
            'Country': branch.country,
            'Description': branch.description || 'N/A',
            'Status': branch.status === 'active' ? 'Active' : 'Inactive',
            'Date Created': formatDate(branch.created_at),
            'Staff Count': branch.staff?.length || 0,
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        const colWidths = [
            { wch: 5 },  // S/N
            { wch: 25 }, // Branch Name
            { wch: 20 }, // Admin
            { wch: 20 }, // Location
            { wch: 40 }, // Full Address
            { wch: 25 }, // Street Address
            { wch: 15 }, // Country
            { wch: 30 }, // Description
            { wch: 10 }, // Status
            { wch: 15 }, // Date Created
            { wch: 12 }, // Staff Count
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Branches');

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const filename = `branches_export_${date}.xlsx`;

        // Export file
        XLSX.writeFile(wb, filename);
    };

    return (
        <div className="space-y-6" onClick={() => setActiveActionId(null)}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
                    <p className="text-sm text-gray-500">Manage and monitor branches activity</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Branch
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">
                        Branches {!loading && `(${branches.length})`}
                    </h3>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-900" />
                            <input
                                type="text"
                                placeholder="Search branches..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 max-w-[200px] rounded-md border border-gray-200 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                                <p className="text-sm text-gray-500">Loading branches...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-sm text-red-600 mb-2">{error}</p>
                                <button
                                    onClick={fetchBranches}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    ) : branches.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">
                                    {searchTerm ? "No branches found matching your search" : "No branches yet"}
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Add your first branch
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">S/N</th>
                                    <th className="px-6 py-3 font-medium">Branch name</th>
                                    <th className="px-6 py-3 font-medium">Admin</th>
                                    <th className="px-6 py-3 font-medium">Location</th>
                                    <th className="px-6 py-3 font-medium">Date Created</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {branches.map((branch, index) => (
                                    <tr
                                        key={branch.id}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => router.push(`/dashboard/branches/${branch.id}`)}
                                    >
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{branch.name}</td>
                                        <td className="px-6 py-4">{getAdminName(branch)}</td>
                                        <td className="px-6 py-4">{branch.city}, {branch.state}</td>
                                        <td className="px-6 py-4">{formatDate(branch.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1.5 ${branch.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${branch.status === 'active' ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                                                <span className="text-xs font-medium capitalize">{branch.status || 'active'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => handleActionClick(e, branch.id)}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                            {activeActionId === branch.id && (
                                                <div className="absolute right-0 top-10 w-48 rounded-md border border-gray-100 bg-white shadow-lg z-20 overflow-hidden">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/branches/${branch.id}`); }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        View Branch
                                                    </button>
                                                    <button
                                                        onClick={(e) => openActionModal(e, "deactivate", branch)}
                                                        className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                                    >
                                                        Deactivate
                                                    </button>
                                                    <button
                                                        onClick={(e) => openActionModal(e, "delete", branch)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AddBranchModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchBranches}
            />

            {/* Reusable Action Modal */}
            <BranchActionModal
                isOpen={!!modalType}
                onClose={() => setModalType(null)}
                onConfirm={handleConfirmAction}
                type={modalType || "deactivate"}
                title={modalType === "delete" ? "Delete Branch" : "Deactivate Branch"}
                description={modalType === "delete"
                    ? `You're about to delete ${actionBranch?.name}. This is a permanent action and can't be undone.`
                    : `Are you sure you want to deactivate ${actionBranch?.name}? Users won't be able to access it.`
                }
                confirmText={modalType === "delete" ? "Delete Branch" : "Deactivate Branch"}
            />
        </div>
    );
}
