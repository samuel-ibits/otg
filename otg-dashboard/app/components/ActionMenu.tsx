"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

interface ActionMenuProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function ActionMenu({ onView, onEdit, onDelete }: ActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Actions"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-gray-100 bg-white shadow-lg z-50 py-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    {onView && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onView?.();
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            View Details
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onEdit?.();
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onDelete?.();
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
