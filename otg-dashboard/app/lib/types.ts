/**
 * TypeScript Types and Interfaces for API Integration
 */

// ============================================
// Common Types
// ============================================

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    branchId?: string | number;
    search?: string;
    categoryId?: string | number;
    minPrice?: number;
    maxPrice?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    products: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
    details?: any;
}

// ============================================
// Router Types
// ============================================

export interface Router {
    id: string | number;
    name: string;
    password: string;
    connections: number;
    status: boolean;
    maxConnections?: number;
    ipAddress?: string;
    macAddress?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRouterDTO {
    name: string;
    password: string;
    maxConnections?: number;
    ipAddress?: string;
    macAddress?: string;
}

export interface UpdateRouterDTO extends Partial<CreateRouterDTO> {
    status?: boolean;
    connections?: number;
}

// ============================================
// Subscription Types
// ============================================

export interface Subscription {
    id: string | number;
    type: string;
    speed: string;
    duration: string;
    amount: string;
    dateAdded: string;
    status?: 'active' | 'inactive' | 'expired';
    description?: string;
}

export interface CreateSubscriptionDTO {
    type: string;
    speed: string;
    duration: string;
    amount: string;
    description?: string;
}

export interface UpdateSubscriptionDTO extends Partial<CreateSubscriptionDTO> {
    status?: 'active' | 'inactive' | 'expired';
}

// ============================================
// Product Types
// ============================================

export interface Product {
    id: string | number;
    name: string;
    description: string;
    price: string | number;
    businessId: string | number;
    branchId: string | number;
    branchAmenityId: string;
    status: 'available' | 'active' | 'inactive'; // API returns 'available', keeping others for safety
    meta: Record<string, any>; // Flexible meta field
    category?: string; // Optional as not in recent sample response but might be useful
    stock?: number;
    isDeleted?: boolean;
    rating?: number | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    media?: any[]; // Array for media if present
    branch_amenity?: {
        id: string;
        amenityName: string;
        amenityId: string;
        status: string;
    };
}

export interface CreateProductDTO {
    name: string;
    branchAmenityId?: string;
    description: string;
    price: string | number;
    meta?: Record<string, any>;
    // fields not in the example but potentially useful to keep optional
    category?: string;
    // stock?: number;
    imageUrl?: string;
    status?: 'available' | 'active' | 'inactive';
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    status?: 'active' | 'inactive';
}

// ============================================
// Order Types
// ============================================

export interface Order {
    id: string;
    orderId: string;
    customerId: number;
    businessId: number;
    branchId: number;
    subTotal: number;
    discountAmount: number;
    totalAmount: number;
    voucherId: string | null;
    voucherCode: string | null;
    amenitiesCategory: string[];
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'ongoing';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    autoRenew: boolean;
    meta: any;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    customer: {
        id: number;
        picture: string;
        userName: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
        };
    };
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: number;
    quantity: number;
    amount: number;
    totalAmount: number;
    meta: any;
    createdAt: string;
    updatedAt: string;
    product?: {
        id: number;
        name: string;
        description: string;
        price: number;
        currency: string;
        isFeatured: boolean;
        branch_amenity: {
            id: string;
            amenity: {
                id: string;
                name: string;
            };
        };
    };
}

export interface CreateOrderDTO {
    businessId: number;
    branchId: number;
    items: Array<{
        productId: number;
        quantity: number;
    }>;
    voucherId?: number;
}

export interface UpdateOrderDTO {
    status?: Order['status'];
    paymentStatus?: Order['paymentStatus'];
}

// ============================================
// Customer Types
// ============================================

export interface Customer {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    totalOrders?: number;
    totalSpent?: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt?: string;
}

export interface CreateCustomerDTO {
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {
    status?: 'active' | 'inactive';
}

// ============================================
// Branch Types
// ============================================

export interface WorkingHours {
    open: string | null;
    close: string | null;
}

export interface BranchStaff {
    fullName: string;
    email: string;
    role: 'admin' | 'receptionist' | 'cashier' | string;
}

export interface Branch {
    id: string;
    name: string;
    fullAddress: string;
    description?: string;
    streetAddress: string;
    state: string;
    country: string;
    city: string;
    working_hours: {
        monday: WorkingHours;
        tuesday: WorkingHours;
        wednesday: WorkingHours;
        thursday: WorkingHours;
        friday: WorkingHours;
        saturday: WorkingHours;
        sunday: WorkingHours;
    };
    amenities: string[];
    staff: BranchStaff[];
    status?: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    registrationDate?: string;
}

export interface BranchActivityLog {
    id: string | number;
    type: string;
    title: string;
    description?: string;
    meta?: string;
    timestamp: string;
}

export interface ChartData {
    name: string;
    value?: number;
    type?: string;
    k?: number;
}

export interface BranchDashboardStats {
    totalRevenue: number;
    activeCustomers: number;
    activeWifiSessions: number;
    revenueGrowth: number;
    customerGrowth: number;
    wifiGrowth: number;
}

export interface CreateBranchDTO {
    name: string;
    fullAddress: string;
    description?: string;
    streetAddress: string;
    state: string;
    country: string;
    city: string;
    working_hours: {
        monday: WorkingHours;
        tuesday: WorkingHours;
        wednesday: WorkingHours;
        thursday: WorkingHours;
        friday: WorkingHours;
        saturday: WorkingHours;
        sunday: WorkingHours;
    };
    amenities: string[];
    staff: BranchStaff[];
}

export interface Amenity {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

export enum BranchStaffRole {
    ADMIN = "admin",
    RECEPTIONIST = "receptionist",
    WAITER = "waiter",
    CASHIER = "cashier",
}

export interface UpdateBranchDTO extends Partial<CreateBranchDTO> {
    status?: 'active' | 'inactive';
}

export interface BranchQueryParams extends PaginationParams {
    search?: string;
    cursor?: string;
    limit?: number;
}

export interface BranchMedia {
    id: string | number;
    url: string;
    name: string;
    type?: 'image' | 'video';
}

export interface BranchWifiPlan {
    id: string | number;
    name: string;
    price: number | string;
    speed: string;
    status: string;
    duration?: string;
}

export interface BranchReviewAuthor {
    userName: string;
    picture?: string;
    totalReviews: number;
}

export interface BranchReview {
    id: string | number;
    author: BranchReviewAuthor;
    rating: {
        overall: number;
    };
    createdAt: string;
    body: string;
    media?: (string | BranchMedia)[];
}

export interface BranchReviewStats {
    rating: number;
    reviewCount: number;
}

export interface RatingDistribution {
    [key: string]: number;
}

export interface BranchReviewsData {
    reviews: BranchReview[];
    branchStats: BranchReviewStats;
    ratingDistribution: RatingDistribution;
}

// ============================================
// Analytics/Reports Types
// ============================================

export interface SalesReport {
    period: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topProducts: Array<{
        productId: string | number;
        productName: string;
        quantity: number;
        revenue: number;
    }>;
}

export interface CustomerReport {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    topCustomers: Array<{
        customerId: string | number;
        customerName: string;
        totalOrders: number;
        totalSpent: number;
    }>;
}

export interface WifiReport {
    totalRouters: number;
    activeRouters: number;
    totalConnections: number;
    subscriptionStats: {
        active: number;
        expired: number;
        revenue: number;
    };
}

// ============================================
// Authentication Types
// ============================================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string | number;
        email: string;
        name: string;
        role: string;
    };
    message?: string;
}

export interface User {
    id: string | number;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'staff';
    status: 'active' | 'inactive';
    createdAt?: string;
}
