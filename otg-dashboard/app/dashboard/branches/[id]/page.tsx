"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, Store, Trash2, Power, Users, Wifi } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { BranchActionModal } from "@/app/components/BranchActionModals";
import { branchService } from "@/app/lib/services/branchService";
import { productService } from "@/app/lib/services/productService";
import type { Branch, BranchActivityLog, BranchMedia, BranchReview, BranchReviewStats, BranchWifiPlan, Product, RatingDistribution } from "@/app/lib/types";
import { OrdersTable } from "@/app/components/OrdersTable";
import { BranchProducts } from "@/app/components/BranchProducts";
import { BranchWiFi } from "@/app/components/BranchWiFi";
import { ActivityLog } from "@/app/components/ActivityLog";
import { BranchGallery } from "@/app/components/BranchGallery";
import { BranchReviews } from "@/app/components/BranchReviews";
import { BranchStats } from "@/app/components/BranchStats";

interface BranchDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BranchDetailsPage({ params }: BranchDetailsPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("Admin & Staff");
    const [modalType, setModalType] = useState<"deactivate" | "delete" | null>(null);

    // Sub-tab Data States
    const [orders, setOrders] = useState<any[]>([]);
    const [wifiPlans, setWifiPlans] = useState<BranchWifiPlan[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [activityLogs, setActivityLogs] = useState<BranchActivityLog[]>([]);
    const [media, setMedia] = useState<BranchMedia[]>([]);
    const [reviews, setReviews] = useState<BranchReview[]>([]);
    const [reviewStats, setReviewStats] = useState<BranchReviewStats | undefined>(undefined);
    const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution | undefined>(undefined);
    const [subTabLoading, setSubTabLoading] = useState(false);
    const [chartData, setChartData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    const tabs = ["Orders", "Wi-Fi Infrastructure", "Products & Amenities", "Admin & Staff", "Activity log", "Pictures", "Reviews"];

    // Fetch branch details
    useEffect(() => {
        const fetchBranch = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await branchService.getById(id);

                if (response.success && response.data) {
                    setBranch(response.data.branchInfo);
                    setChartData(response.data.chartData);
                    setStats(response.data.stats);
                } else {
                    setError(response.error || "Failed to load branch");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBranch();
        }
    }, [id]);

    // Fetch Sub-tab Data
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setSubTabLoading(true);
            try {
                if (activeTab === "Orders") {
                    const res = await branchService.getOrders(id);
                    if (res.success && res.data) setOrders(res.data?.orders);
                } else if (activeTab === "Wi-Fi Infrastructure") {
                    const res = await branchService.getWifiInfrastructure(id);
                    if (res.success && res.data) setWifiPlans(res.data?.wifiPlans);
                } else if (activeTab === "Products & Amenities") {
                    const res = await branchService.getProducts(id);
                    if (res.success && res.data) setProducts(res.data?.products || res.data?.data || []);
                } else if (activeTab === "Activity log") {
                    const res = await branchService.getActivityLogs(id);
                    if (res.success && res.data) setActivityLogs(res.data?.logs);
                } else if (activeTab === "Pictures") {
                    const res = await branchService.getMedia(id);
                    if (res.success && res.data) setMedia(res.data?.media);
                } else if (activeTab === "Reviews") {
                    const res = await branchService.getReviews(id);
                    if (res.success && res.data) {
                        setReviews(res.data.reviews);
                        setReviewStats(res.data.branchStats);
                        setRatingDistribution(res.data.ratingDistribution);
                    }
                }
                else if (activeTab === "Admin & Staff") {
                    const res = await branchService.getStaff(id);
                    if (res.success && res.data) setStaff(res.data?.staff);
                }
            } catch (error) {
                console.error("Error fetching tab data:", error);
            } finally {
                setSubTabLoading(false);
            }
        };

        fetchData();
    }, [id, activeTab]);

    const handleDelete = async () => {
        if (!branch) return;

        try {
            const response = await branchService.delete(branch.id);

            if (response.success) {
                router.push("/dashboard/branches");
            } else {
                alert(response.error || "Failed to delete branch");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete branch");
        }
    };

    const handleDeactivate = async () => {
        if (!branch) return;

        try {
            const response = await branchService.update(branch.id, {
                status: "inactive"
            });

            if (response.success) {
                setModalType(null);
                // Refresh branch data
                // Refresh branch data
                const refreshResponse = await branchService.getById(id);
                if (refreshResponse.success && refreshResponse.data) {
                    setBranch(refreshResponse.data.branchInfo);
                }
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

    const formatTime = (timeString: string | null) => {
        if (!timeString) return "Closed";
        return timeString;
    };

    const getDayWorkingHours = (day: keyof Branch['working_hours']) => {
        if (!branch?.working_hours) return "Closed";
        if (!branch.working_hours[day]) return "Closed";
        const hours = branch.working_hours[day];
        if (!hours.open || !hours.close) return "Closed";
        return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-500">Loading branch details...</p>
                </div>
            </div>
        );
    }

    if (error || !branch) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-sm text-red-600 mb-4">{error || "Branch not found"}</p>
                    <Link
                        href="/dashboard/branches"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to branches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb & Title */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/branches" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {branch.name}
                            <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${branch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {branch.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </h1>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{branch.city}, {branch.state}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setModalType("delete")}
                        className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 bg-white"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Branch
                    </button>
                    {branch.status === 'active' && (
                        <button
                            onClick={() => setModalType("deactivate")}
                            className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 shadow-sm"
                        >
                            <Power className="h-4 w-4" />
                            Deactivate Branch
                        </button>
                    )}
                </div>
            </div>

            {/* Info & Stats */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Branch Information</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <span>Full Address</span>
                            </div>
                            <p className="pl-6 text-sm font-medium text-gray-900">{branch.fullAddress}</p>
                        </div>
                        {branch.streetAddress && (
                            <div>
                                <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
                                    <MapPin className="h-4 w-4 mt-0.5" />
                                    <span>Street Address</span>
                                </div>
                                <p className="pl-6 text-sm font-medium text-gray-900">{branch.streetAddress}</p>
                            </div>
                        )}
                        <div>
                            <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <span>City, State</span>
                            </div>
                            <p className="pl-6 text-sm font-medium text-gray-900">{branch.city}, {branch.state}</p>
                        </div>
                        {branch.country && (
                            <div>
                                <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
                                    <MapPin className="h-4 w-4 mt-0.5" />
                                    <span>Country</span>
                                </div>
                                <p className="pl-6 text-sm font-medium text-gray-900">{branch.country}</p>
                            </div>
                        )}
                        <div>
                            <div className="flex items-start gap-2 text-sm text-gray-500 mb-1">
                                <Calendar className="h-4 w-4 mt-0.5" />
                                <span>Created Date</span>
                            </div>
                            <p className="pl-6 text-sm font-medium text-gray-900">{formatDate(branch.registrationDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 space-y-6">
                    {/* Stats & Charts */}
                    <BranchStats
                        revenue={stats?.totalRevenue}
                        activeCustomers={stats?.activeCustomers}
                        wifiSessions={stats?.activeWifiSessions}
                        growth={
                            {
                                revenue: stats?.revenueGrowth,
                                customers: stats?.customerGrowth,
                                wifi: stats?.wifiGrowth
                            }}
                        chartData={chartData}

                    />

                    {/* Description */}
                    {branch.description && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-sm text-gray-600">{branch.description}</p>
                        </div>
                    )}

                    {/* Working Hours */}
                    {branch.working_hours && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Working Hours
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                                        <span className="text-sm text-gray-600">{getDayWorkingHours(day)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 px-6 overflow-x-auto">
                    <div className="flex space-x-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {/* subtabs */}
                <div className="p-6">
                    {activeTab === "Admin & Staff" && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Staff Members ({staff.length || 0})
                            </h3>
                            {subTabLoading ? (
                                <p className="text-center py-8 text-gray-500">Loading staff...</p>
                            ) : staff && staff.length > 0 ? (
                                <div className="space-y-3">
                                    {staff.map((member, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">{member.fullName || member.name}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                                                {member.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">No staff members assigned</p>
                            )}
                            {/* Existing Admin & Staff content or placeholder from previous snippet */}
                            <div className="min-h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                                Admin & Staff List
                            </div>
                        </div>
                    )}
                    {activeTab === "Orders" && (
                        <div className="min-h-[300px]">
                            {subTabLoading ? <p className="text-center py-8 text-gray-500">Loading orders...</p> : <OrdersTable orders={orders} />}
                        </div>
                    )}
                    {activeTab === "Wi-Fi Infrastructure" && (
                        <div className="min-h-[300px]">
                            {subTabLoading ? <p className="text-center py-8 text-gray-500">Loading infrastructure...</p> : <BranchWiFi plans={wifiPlans} />}
                        </div>
                    )}
                    {activeTab === "Products & Amenities" && (
                        <div className="min-h-[300px]">
                            {subTabLoading ? <p className="text-center py-8 text-gray-500">Loading products...</p> : <BranchProducts products={products} />}
                        </div>
                    )}
                    {activeTab === "Activity log" && (
                        subTabLoading ? <p className="text-center py-8 text-gray-500">Loading logs...</p> : <ActivityLog logs={activityLogs} />
                    )}
                    {activeTab === "Pictures" && (
                        subTabLoading ? <p className="text-center py-8 text-gray-500">Loading images...</p> : <BranchGallery images={media} />
                    )}
                    {activeTab === "Reviews" && (
                        subTabLoading ? <p className="text-center py-8 text-gray-500">Loading reviews...</p> : <BranchReviews reviews={reviews} stats={reviewStats} distribution={ratingDistribution} />
                    )}
                </div>
            </div>

            <BranchActionModal
                isOpen={!!modalType}
                onClose={() => setModalType(null)}
                onConfirm={handleConfirmAction}
                type={modalType || "deactivate"}
                title={modalType === "delete" ? "Delete Branch" : "Deactivate Branch"}
                description={modalType === "delete"
                    ? `You're about to delete ${branch.name}. This is a permanent action and can't be undone.`
                    : `Are you sure you want to deactivate ${branch.name}? Users won't be able to access it.`
                }
                confirmText={modalType === "delete" ? "Delete Branch" : "Deactivate Branch"}
            />
        </div>
    );
}
