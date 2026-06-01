"use client";

import { X, Check, Plus, Trash2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { branchService } from "@/app/lib/services/branchService";
import { amenityService, Amenity } from "@/app/lib/services/amenityService";
import { BranchStaffRole } from "@/app/lib/types";
import type { CreateBranchDTO, WorkingHours } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";
import { useEffect } from "react";

interface AddBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const STEPS = ["Branch Information", "Working Hours", "Amenities", "Admin & Staff"];

// Helper for initial working hours
const initialWorkingHours = DAYS.reduce((acc, day) => {
    acc[day] = { open: "09:00", close: "18:00" };
    if (day === 'sunday') acc[day] = { open: "", close: "" }; // default closed Sunday
    return acc;
}, {} as Record<string, { open: string; close: string }>);

export function AddBranchModal({ isOpen, onClose, onSuccess }: AddBranchModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Amenities State
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        fullAddress: "",
        description: "",
        streetAddress: "",
        city: "",
        state: "",
        country: "Nigeria",
        amenities: [] as string[],
        staff: [{ fullName: "", email: "", role: "" as BranchStaffRole }],
    });

    const [workingHours, setWorkingHours] = useState(initialWorkingHours);

    useEffect(() => {
        if (isOpen) {
            fetchAmenities();
        }
    }, [isOpen]);

    const fetchAmenities = async () => {
        setLoadingAmenities(true);
        try {
            const response = await amenityService.getGlobal();
            if (response.success && response.data) {
                setAvailableAmenities(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch amenities", err);
        } finally {
            setLoadingAmenities(false);
        }
    };

    const toggleAmenity = (id: string) => {
        setFormData(prev => {
            const exists = prev.amenities.includes(id);
            return {
                ...prev,
                amenities: exists
                    ? prev.amenities.filter(a => a !== id)
                    : [...prev.amenities, id]
            };
        });
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleStaffChange = (index: number, field: keyof typeof formData.staff[0], value: string) => {
        setFormData(prev => {
            const newStaff = [...prev.staff];
            newStaff[index] = { ...newStaff[index], [field]: value };
            return { ...prev, staff: newStaff };
        });
    };

    const addStaff = () => {
        setFormData(prev => ({
            ...prev,
            staff: [...prev.staff, { fullName: "", email: "", role: "" as BranchStaffRole }] // Default to admin or empty?
        }));
    };

    const removeStaff = (index: number) => {
        if (formData.staff.length > 1) {
            setFormData(prev => ({
                ...prev,
                staff: prev.staff.filter((_, i) => i !== index)
            }));
        }
    };

    const handleWorkingHoursChange = (day: string, field: 'open' | 'close', value: string) => {
        setWorkingHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const validateStep = (step: number) => {
        setError(null);
        if (step === 0) {
            if (!formData.name || !formData.fullAddress || !formData.city || !formData.state || !formData.country) {
                setError("Please fill in all required fields.");
                return false;
            }
        }
        if (step === 3) {
            // Validate all staff entries
            for (const member of formData.staff) {
                if (member.fullName && (!member.email || !member.role)) {
                    setError("Please complete all details for staff members.");
                    return false;
                }
                // If required, ensure at least one staff? Or optional?
                // Assuming optional branch admin/staff creation, but if started, must complete.
                if (member.fullName && member.email && !member.role) {
                    setError("Please select a role for the staff member.");
                    return false;
                }
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handleBack = () => {
        setError(null);
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setLoading(true);
        setError(null);

        try {
            // Transform workingHours state to DTO format
            const hoursPayload: any = {};
            DAYS.forEach(day => {
                const h = workingHours[day];
                hoursPayload[day] = {
                    open: h.open || null,
                    close: h.close || null,
                };
            });

            // Filter out empty staff entries
            const validStaff = formData.staff.filter(s => s.fullName && s.email && s.role);

            const branchData: CreateBranchDTO = {
                name: formData.name,
                fullAddress: formData.fullAddress,
                description: formData.description,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                working_hours: hoursPayload,
                amenities: formData.amenities,
                staff: validStaff.map(s => ({
                    fullName: s.fullName,
                    email: s.email,
                    role: s.role // Now correctly typed
                }))
            };

            const response = await branchService.create(branchData);

            if (response.success) {
                onSuccess?.();
                onClose();
                // Reset form potentially?
            } else {
                setError(response.error || "Failed to create branch");
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

            <div className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-20">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create a branch</h2>
                        <div className="flex gap-6 mt-4">
                            {STEPS.map((step, index) => (
                                <button
                                    key={step}
                                    onClick={() => {
                                        // Optional: Allow jumping back, but maybe not forward without validation
                                        if (index < currentStep) setCurrentStep(index);
                                    }}
                                    className={cn(
                                        "text-sm font-medium pb-1 transition-colors relative",
                                        index === currentStep ? "text-blue-600" : "text-gray-500 hover:text-gray-700",
                                        index <= currentStep && "cursor-pointer",
                                        index > currentStep && "cursor-not-allowed"
                                    )}
                                >
                                    {step}
                                    {index === currentStep && (
                                        <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Close button position might need adjustment if tabs take space, but absolute top right is fine */}
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Branch Information */}
                    {currentStep === 0 && (
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Enter branch name"
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
                                <input
                                    type="text"
                                    value={formData.streetAddress}
                                    onChange={(e) => {
                                        handleChange("streetAddress", e.target.value);
                                        // Update full address as combo for now or keep separate
                                        handleChange("fullAddress", `${e.target.value}, ${formData.city}, ${formData.state}`);
                                    }}
                                    placeholder="Enter street address"
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        placeholder="Enter city"
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => handleChange("state", e.target.value)}
                                        placeholder="Enter state"
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Enter branch description"
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                />
                            </div>
                            {/* Hidden country input, default Nigeria */}
                        </div>
                    )}

                    {/* Step 2: Working Hours */}
                    {currentStep === 1 && (
                        <div className="max-w-xl mx-auto space-y-4">
                            <div className="grid grid-cols-3 gap-4 mb-2 font-medium text-sm text-gray-500 px-2">
                                <span>Day</span>
                                <span>Opens</span>
                                <span>Closes</span>
                            </div>
                            {DAYS.map((day) => (
                                <div key={day} className="grid grid-cols-3 gap-4 items-center">
                                    <span className="capitalize text-sm font-medium text-gray-700">{day}</span>
                                    <input
                                        type="time"
                                        value={workingHours[day].open || ""}
                                        onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                                        className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                    />
                                    <input
                                        type="time"
                                        value={workingHours[day].close || ""}
                                        onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                                        className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Amenities */}
                    {currentStep === 2 && (
                        <div className="max-w-xl mx-auto space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Select Amenities</h3>

                            {loadingAmenities ? (
                                <div className="text-center py-8 text-gray-500">Loading amenities...</div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {availableAmenities.map((amenity) => {
                                        const isSelected = formData.amenities.includes(amenity.id);
                                        return (
                                            <button
                                                key={amenity.id}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={cn(
                                                    "rounded-full px-4 py-2 text-sm font-medium border transition-all flex items-center gap-2",
                                                    isSelected
                                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                )}
                                            >
                                                {amenity.name}
                                                {isSelected && <X className="h-3 w-3" />}
                                                {!isSelected && <span className="h-3 w-3 block" />} {/* Spacer for layout stability */}
                                            </button>
                                        );
                                    })}
                                    {availableAmenities.length === 0 && (
                                        <p className="text-sm text-gray-500">No amenities available.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Admin & Staff */}
                    {currentStep === 3 && (
                        <div className="max-w-xl mx-auto space-y-6">
                            {formData.staff.map((staff, index) => (
                                <div key={index} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 relative">
                                    {formData.staff.length > 1 && (
                                        <button
                                            onClick={() => removeStaff(index)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={staff.fullName}
                                            onChange={(e) => handleStaffChange(index, "fullName", e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={staff.email}
                                            onChange={(e) => handleStaffChange(index, "email", e.target.value)}
                                            placeholder="email@example.com"
                                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            value={staff.role}
                                            onChange={(e) => handleStaffChange(index, "role", e.target.value as BranchStaffRole)}
                                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600 bg-white"
                                        >
                                            <option value="">Select Role</option>
                                            <option value={BranchStaffRole.ADMIN}>Admin</option>
                                            <option value={BranchStaffRole.RECEPTIONIST}>Receptionist</option>
                                            <option value={BranchStaffRole.WAITER}>Waiter</option>
                                            <option value={BranchStaffRole.CASHIER}>Cashier</option>
                                        </select>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addStaff}
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Staff
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-between bg-white">
                    <button
                        onClick={() => {
                            if (currentStep === 0) onClose();
                            else handleBack();
                        }}
                        className="rounded-md border border-gray-200 px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        {currentStep === 0 ? "Cancel" : "Back"}
                    </button>

                    <button
                        onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
                        disabled={loading}
                        className={cn(
                            "rounded-md px-6 py-2 text-sm font-medium text-white shadow-sm flex items-center gap-2",
                            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        )}
                    >
                        {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                        {currentStep === STEPS.length - 1 ? "Create Branch" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}
