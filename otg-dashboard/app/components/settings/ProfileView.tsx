"use client";

import { Upload, FileText } from "lucide-react";

export function ProfileView() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Profile</h2>
                    <p className="text-sm text-gray-500">Update your photo and business details here.</p>
                </div>
                <div className="flex gap-3">
                    <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                        Save
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 max-w-4xl">
                {/* Section */}
                <div className="grid grid-cols-3 gap-8 items-start pt-2">
                    <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-700">Business Logo</label>
                        <p className="text-xs text-gray-500 mt-1">This will be displayed on your profile.</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            {/* Placeholder for image */}
                            <img src="https://ui-avatars.com/api/?name=Cafe+One&background=random" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 flex-1 flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-gray-50">
                            <Upload className="h-5 w-5 text-gray-400 mb-2" />
                            <span className="text-sm text-blue-600 font-medium">Change Image</span>
                            <span className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Business Name</label>
                    <div className="col-span-2">
                        <input type="text" defaultValue="Cafe One" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 active:bg-white" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Branch Location</label>
                    <div className="col-span-2">
                        <input type="text" defaultValue="Lekki, Lagos" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Branch Address</label>
                    <div className="col-span-2">
                        <input type="text" defaultValue="10, Admiralty Way, Lekki Phase 1" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Business Email Address</label>
                    <div className="col-span-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">✉️</span>
                            </div>
                            <input type="email" defaultValue="cafeone@example.com" className="w-full rounded-md border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Business Type</label>
                    <div className="col-span-2">
                        <input type="text" defaultValue="Cafe" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-start">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <p className="text-xs text-gray-500 mt-1">Write a short introduction about your business.</p>
                    </div>
                    <div className="col-span-2">
                        <textarea rows={4} defaultValue="Lorem Ipsum is simply dummy text..." className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        <p className="text-xs text-gray-500 mt-1 text-right">275 characters left</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-start">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Opening hours</label>
                    <div className="col-span-2 space-y-4">
                        <div className="grid grid-cols-3 gap-4 mb-2">
                            <span className="text-xs font-medium text-gray-500 uppercase">Day</span>
                            <span className="text-xs font-medium text-gray-500 uppercase">Opens</span>
                            <span className="text-xs font-medium text-gray-500 uppercase">Closes</span>
                        </div>
                        {days.map((day) => (
                            <div key={day} className="grid grid-cols-3 gap-4 items-center">
                                <span className="text-sm text-gray-700">{day}</span>
                                <input type="time" defaultValue="08:00" className="rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500" />
                                <input type="time" defaultValue="22:00" className="rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-8 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">Documents</label>
                    <div className="col-span-2 flex gap-4">
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">Document.pdf</p>
                                <p className="text-xs text-gray-500">2.4 MB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">Img.jpg</p>
                                <p className="text-xs text-gray-500">1.2 MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
