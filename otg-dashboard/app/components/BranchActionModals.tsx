"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText: string;
    type: "deactivate" | "delete";
}

export function BranchActionModal({ isOpen, onClose, onConfirm, title, description, confirmText, type }: ActionModalProps) {
    if (!isOpen) return null;

    const isDelete = type === "delete";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${isDelete ? "bg-red-100" : "bg-yellow-100"}`}>
                    {isDelete ? (
                        <Trash2 className="h-6 w-6 text-red-600" />
                    ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6 font-normal">
                    {description}
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
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${isDelete ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
