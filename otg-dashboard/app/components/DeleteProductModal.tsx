"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteProductModal({ isOpen, onClose, onConfirm }: DeleteProductModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete product</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 shadow-sm"
                    >
                        Yes, Do it!
                    </button>
                </div>
            </div>
        </div>
    );
}
