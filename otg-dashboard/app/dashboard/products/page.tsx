"use client";

import { useState, useEffect } from "react";
import { Plus, MoreVertical, Search, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { AddProductModal } from "@/app/components/AddProductModal";
import { ProductDrawer } from "@/app/components/ProductDrawer";
import { DeleteProductModal } from "@/app/components/DeleteProductModal";
import { ActionMenu } from "@/app/components/ActionMenu";
import { productService } from "@/app/lib/services/productService";
import type { Product } from "@/app/lib/types";
import { useAuth } from "@/app/contexts/AuthContext";

export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAll();
            if (response.success && response.data) {
                // API returns products under data.products
                if ('products' in response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if ('data' in response.data && Array.isArray((response.data as any).data)) {
                    setProducts((response.data as any).data);
                } else {
                    setProducts([]);
                }
            } else {
                setError(response.error || "Failed to load products");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleRowClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleDeleteRequest = () => {
        setIsDeleteModalOpen(true);
        // We keep selectedProduct set so we know what to delete
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            const response = await productService.delete(selectedProduct.id);
            if (response.success) {
                setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
                setSelectedProduct(null);
                setIsDeleteModalOpen(false);
            } else {
                alert("Failed to delete product: " + response.error);
            }
        } catch (error) {
            alert("Error deleting product");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-sm text-gray-500">Manage and monitor your products</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <SlidersHorizontal className="h-4 w-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Products & Amenities</h3>
                    <div className="flex gap-2">
                        {/* Search & Filter - functionality can be added later */}
                        <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="h-8 max-w-[200px] rounded-md border border-gray-200 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center text-gray-500">Loading products...</div>
                ) : error ? (
                    <div className="p-12 flex justify-center text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Product name</th>
                                    <th className="px-6 py-3 font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">Category</th>
                                    <th className="px-6 py-3 font-medium">Date Created</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No products found. Click &quot;Add Product&quot; to get started.
                                        </td>
                                    </tr>
                                ) : products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleRowClick(product)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {product.media && product.media.length > 0 ? (
                                                        <img src={product.media[0]} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₦{Number(product.price).toLocaleString()}</td>
                                        <td className="px-6 py-4">{product.branch_amenity?.amenityName || product.category || '-'}</td>
                                        <td className="px-6 py-4">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                                                <span className="text-xs font-medium">{product.status || 'active'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <ActionMenu
                                                onEdit={() => handleRowClick(product)}
                                                onDelete={() => {
                                                    setSelectedProduct(product);
                                                    handleDeleteRequest();
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Omitted for now, relying on all items or first page */}
                {!loading && !error && products.length > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                        <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Previous
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-900">1</span>
                        </div>
                        <button className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                )}
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchProducts();
                }}
                branchId={user?.branchId}
            />

            <ProductDrawer
                isOpen={!!selectedProduct && !isDeleteModalOpen}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                onDelete={handleDeleteRequest}
                onSuccess={fetchProducts}
            />

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
