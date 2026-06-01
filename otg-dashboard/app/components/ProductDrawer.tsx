"use client";

import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { productService } from "@/app/lib/services/productService";
import { amenityService } from "@/app/lib/services/amenityService";
import type { Product, UpdateProductDTO, Amenity } from "@/app/lib/types";

interface ProductDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onDelete: () => void;
    onSuccess?: () => void;
}

export function ProductDrawer({ isOpen, onClose, product, onDelete, onSuccess }: ProductDrawerProps) {
    const [activeTab, setActiveTab] = useState("details");
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        branchAmenityId: "",
        description: "",
        price: "",
        category: "",
        meta: {} as Record<string, any>,
    });

    // Meta field state
    const [metaKey, setMetaKey] = useState("");
    const [metaValue, setMetaValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Load product data when drawer opens
    useEffect(() => {
        if (isOpen && product) {
            setFormData({
                name: product.name || "",
                branchAmenityId: product.branch_amenity?.id || product.branchAmenityId || "",
                description: product.description || "",
                price: String(product.price) || "",
                category: product.branch_amenity?.amenityName || product.category || "",
                meta: product.meta || {},
            });
            setError(null);
        }
    }, [isOpen, product]);

    // Fetch amenities
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                // If product has branchId, fetch branch-specific amenities
                // Otherwise fall back to global amenities
                const branchId = product?.branchId;

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
                    const response = await amenityService.getByBranch();
                    if (response.success && response.data) {
                        const mappedAmenities = response.data.map((ba: any) => ({
                            id: ba.id, // Use branch amenity ID
                            name: ba.amenityName,
                        }));
                        setAmenities(mappedAmenities);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch amenities:', err);
            }
        };

        if (isOpen && product) {
            fetchAmenities();
        }
    }, [isOpen, product]);

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

    const handleSave = async () => {
        if (!product) return;

        setLoading(true);
        setError(null);

        try {
            const payload: UpdateProductDTO = {
                name: formData.name,
                branchAmenityId: formData.branchAmenityId,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
            };

            const response = await productService.update(product.id, payload);

            if (response.success) {
                onSuccess?.();
                onClose();
            } else {
                setError(response.error || "Failed to update product");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-lg bg-white shadow-xl h-full flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
                        <p className="text-sm text-gray-500">Manage your product details</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="border-b border-gray-100 px-6">
                    <div className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={cn(
                                "py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === "details" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            General Details
                        </button>
                        <button
                            onClick={() => setActiveTab("images")}
                            className={cn(
                                "py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === "images" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Product Images
                        </button>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.branchAmenityId}
                                    onChange={(e) => setFormData({ ...formData, branchAmenityId: e.target.value })}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white "
                                >
                                    <option value="">Select amenity</option>
                                    {amenities.map((amenity) => (
                                        <option key={amenity.id} value={amenity.id} className="text-gray-700">
                                            {amenity.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {/* Meta Fields Display (Read-only for now, can be made editable) */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Data</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(formData.meta).map(([k, v]) => (
                                        <div key={k} className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs">
                                            <span className="font-semibold">{k}:</span>
                                            <span>{v as string}</span>
                                            <button type="button" onClick={() => handleRemoveMeta(k)} className="ml-1 text-red-500"><X className="h-3 w-3" /></button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-2">
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
                                        className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-gray-900"
                                    />
                                    <button type="button" onClick={handleAddMeta} className="px-3 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Add</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "images" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {product.media && product.media.length > 0 ? (
                                    product.media.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                                            <img src={img} alt={`Product ${i + 1}`} className="h-full w-full object-cover" />
                                        </div>
                                    ))
                                ) : (
                                    [1, 2].map((i) => (
                                        <div key={i} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                                            <div className="h-full w-full flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-gray-300" />
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center aspect-square hover:bg-gray-50 cursor-pointer transition-colors">
                                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add Image</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white sticky bottom-0">
                    <button
                        onClick={onDelete}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        Delete Product
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm flex items-center gap-2"
                        >
                            {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
