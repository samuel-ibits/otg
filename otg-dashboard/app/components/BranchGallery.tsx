"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

import type { BranchMedia } from "@/app/lib/types";

interface BranchGalleryProps {
    images?: BranchMedia[];
}

export function BranchGallery({ images = [] }: BranchGalleryProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [localImages, setLocalImages] = useState(images); // If we wanted local state for editing

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Pictures</h3>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <Edit2 className="h-4 w-4" />
                    Edit pictures
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.length === 0 ? (
                    <div className="col-span-full aspect-video md:aspect-[2/1] relative rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">No images added</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Add photos of your branch to showcase it to customers.</p>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add pictures
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Main large image */}
                        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                            {images[0] && (
                                <img src={images[0].url} alt="Branch Main" className="object-cover w-full h-full" />
                            )}
                        </div>
                        <div className="grid grid-rows-2 gap-4">
                            {images.slice(1, 3).map((img) => (
                                <div key={img.id} className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                                    <img src={img.url} alt={img.name} className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Edit pictures/videos</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-3">
                            {images.map((img) => (
                                <div key={img.id} className="flex items-center gap-3 p-2 bg-white border rounded-lg group">
                                    <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden shrink-0">
                                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">{img.name}</span>
                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                                <Plus className="h-6 w-6 mb-2" />
                                <span className="text-sm font-medium">Upload image</span>
                            </button>
                        </div>

                        <div className="p-4 border-t gap-3 flex justify-end">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
