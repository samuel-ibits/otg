"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Ticket,
    Wifi,
    Package,
    Store,
    BarChart2,
    MessageSquare,
    Settings,
    LogOut,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    User
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { authService } from "@/app/lib/services/authService";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Vouchers", href: "/dashboard/vouchers", icon: Ticket },
    { name: "Wi-Fi", href: "/dashboard/wifi", icon: Wifi },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Branches", href: "/dashboard/branches", icon: Store },
    { name: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart2 },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Get user data from auth service
        const userData = authService.getUser();
        if (userData) {
            setUser(userData);
        }
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        router.push("/");
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div
            className={cn(
                "flex h-full flex-col bg-white border-r border-gray-100 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className={cn("border-b border-gray-50", isCollapsed ? "p-2" : "p-4")}>
                <div
                    className={cn(
                        "flex items-center gap-2 rounded-xl border border-gray-100 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden",
                        isCollapsed ? "justify-center p-2 border-none shadow-none bg-transparent hover:bg-gray-100" : "justify-between p-2"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                            {/* Simple logo representation */}
                            <div className="grid grid-cols-3 gap-0.5 p-2">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-gray-900 text-sm truncate">OnTheGo Africa</span>
                                <span className="text-xs text-gray-400 truncate">Dashboard</span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors",
                                    isCollapsed ? "justify-center px-2" : "px-3",
                                    isActive
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-100 p-4 space-y-1">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-md py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors",
                        isCollapsed ? "justify-center px-2" : "px-3"
                    )}
                    title={isCollapsed ? "Settings" : undefined}
                >
                    <Settings className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors",
                        isCollapsed ? "justify-center px-2" : "px-3"
                    )}
                    title={isCollapsed ? "Log out" : undefined}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>Log out</span>}
                </button>

                <div className={cn("mt-4 flex items-center gap-3 py-2", isCollapsed ? "justify-center px-0" : "px-3")}>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 shrink-0">
                        {user ? getInitials(user.name || user.email) : <User className="h-4 w-4" />}
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-900 truncate">
                                {user?.name || user?.email || "User"}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                                {user?.email || "Loading..."}
                            </span>
                        </div>
                    )}
                </div>

                <div className="pt-2 flex justify-center">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
