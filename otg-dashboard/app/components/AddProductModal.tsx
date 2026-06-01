"use client";

import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

import { productService } from "@/app/lib/services/productService";
import { amenityService } from "@/app/lib/services/amenityService";
import type { CreateProductDTO, Amenity } from "@/app/lib/types";
import { branchService } from "../lib/services/branchService";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    branchId?: string | number;
}

export function AddProductModal({ isOpen, onClose, onSuccess, branchId }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        branchAmenityId: "",
        description: "",
        price: "",
        category: "",
        stock: 0,
        meta: {} as Record<string, any>,
    });

    // Meta field state
    const [metaKey, setMetaKey] = useState("");
    const [metaValue, setMetaValue] = useState("");

    const [error, setError] = useState<string | null>(null);

    // Fetch amenities on mount
    useEffect(() => {
        const fetchAmenities = async () => {
            setLoadingAmenities(true);
            try {
                console.log(branchId);
                if (branchId) {
                    const response = await amenityService.getByBranch(branchId);
                    if (response.success && response.data) {
                        // Map BranchAmenity to Amenity format for dropdown
                        const mappedAmenities = response.data.map((ba: any) => ({
                            id: ba.id, // Use branch amenity ID
                            name: ba.amenityName,
                        }));
                        setAmenities(mappedAmenities);
                    }
                } else {
                    const response = await amenityService.getGlobal();
                    if (response.success && response.data) {
                        setAmenities(response.data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch amenities:', err);
            } finally {
                setLoadingAmenities(false);
            }
        };

        if (isOpen) {
            fetchAmenities();
        }
    }, [isOpen, branchId]);

    const handleAddMeta = () => {
        if (metaKey && metaValue) {
            setFormData(prev => ({
                ...prev,
                meta: { ...prev.meta, [metaKey]: metaValue }
            }));
            setMetaKey("");
            setMetaValue("");
        }
    };

    const handleRemoveMeta = (key: string) => {
        const newMeta = { ...formData.meta };
        delete newMeta[key];
        setFormData(prev => ({ ...prev, meta: newMeta }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload: CreateProductDTO = {
                name: formData.name,
                branchAmenityId: formData.branchAmenityId,
                description: formData.description,
                price: Number(formData.price), // Ensure number
                meta: formData.meta,
                category: formData.category, // Optional in type but we use it
            };

            const response = await productService.create(payload);

            if (response.success) {
                onSuccess?.();
                onClose();
            } else {
                setError(response.error || "Failed to create product");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Add a product</h2>
                        <p className="text-sm text-gray-500">Add a new product to your store</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Stepper Header Omitted for brevity/simplicity in this edit, focusing on single page form for now as per requirements unless multi-step is strictly needed. Preserving multi-step structure if desired but simplifying for context. */}
                    {/* Actually, let's keep it simple and just show the form */}

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter product name"
                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.branchAmenityId}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:text-gray-900 bg-white"
                                    onChange={(e) => setFormData({ ...formData, branchAmenityId: e.target.value })}
                                    disabled={loadingAmenities}
                                >
                                    <option value="">{loadingAmenities ? 'Loading amenities...' : 'Select amenity'}</option>
                                    {amenities.map((amenity) => (
                                        <option key={amenity.id} value={amenity.id} className="text-gray-900 bg-white">
                                            {amenity.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div> */}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter product description"
                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Meta Fields Builder */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Data</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={metaKey}
                                    onChange={(e) => setMetaKey(e.target.value)}
                                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={metaValue}
                                    onChange={(e) => setMetaValue(e.target.value)}
                                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                                />
                                <button type="button" onClick={handleAddMeta} className="px-3 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(formData.meta).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs">
                                        <span className="font-semibold">{k}:</span>
                                        <span>{v as string}</span>
                                        <button type="button" onClick={() => handleRemoveMeta(k)} className="ml-1 text-red-500"><X className="h-3 w-3" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm flex items-center gap-2"
                    >
                        {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
}
