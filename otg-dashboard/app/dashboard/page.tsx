import { StatsCard } from "@/app/components/StatsCard";
import { RevenueChart } from "@/app/components/RevenueChart";
import { RevenueSplitChart } from "@/app/components/RevenueSplitChart";
import { OrdersTable } from "@/app/components/OrdersTable";
import { Users, Wifi, Store } from "lucide-react";
import { Header } from "../components/Header";
import { Order } from "@/app/lib/types";

const orders: Order[] = [
  {
    id: "1",
    orderId: "#OTG-98245",
    customerId: 1,
    businessId: 1,
    branchId: 1,
    subTotal: 12500,
    discountAmount: 0,
    totalAmount: 12500,
    voucherId: null,
    voucherCode: null,
    amenitiesCategory: ["Wi-Fi", "Coffee"],
    status: "completed",
    paymentStatus: "paid",
    autoRenew: false,
    meta: {},
    createdAt: "2024-01-28T09:20:00Z",
    updatedAt: "2024-01-28T09:20:00Z",
    items: [],
    customer: {
      id: 1,
      picture: "",
      userName: "@sophie",
      user: {
        id: 1,
        firstName: "Sophia",
        lastName: "Williams",
      },
    },
  },
  {
    id: "2",
    orderId: "#OTG-98246",
    customerId: 2,
    businessId: 1,
    branchId: 1,
    subTotal: 14200,
    discountAmount: 0,
    totalAmount: 14200,
    voucherId: null,
    voucherCode: null,
    amenitiesCategory: ["Wi-Fi", "Conference room"],
    status: "ongoing",
    paymentStatus: "paid",
    autoRenew: false,
    meta: {},
    createdAt: "2024-01-28T09:20:00Z",
    updatedAt: "2024-01-28T09:20:00Z",
    items: [],
    customer: {
      id: 2,
      picture: "",
      userName: "@emeka",
      user: {
        id: 2,
        firstName: "Emeka",
        lastName: "Nwasu",
      },
    },
  },
  {
    id: "3",
    orderId: "#OTG-98247",
    customerId: 3,
    businessId: 1,
    branchId: 1,
    subTotal: 15200,
    discountAmount: 0,
    totalAmount: 15200,
    voucherId: null,
    voucherCode: null,
    amenitiesCategory: ["Wi-Fi", "Food"],
    status: "completed",
    paymentStatus: "paid",
    autoRenew: false,
    meta: {},
    createdAt: "2024-01-28T09:20:00Z",
    updatedAt: "2024-01-28T09:20:00Z",
    items: [],
    customer: {
      id: 3,
      picture: "",
      userName: "@chinedu",
      user: {
        id: 3,
        firstName: "Chinedu",
        lastName: "Okafor",
      },
    },
  },
  {
    id: "4",
    orderId: "#OTG-98248",
    customerId: 4,
    businessId: 1,
    branchId: 1,
    subTotal: 10000,
    discountAmount: 0,
    totalAmount: 10000,
    voucherId: null,
    voucherCode: null,
    amenitiesCategory: ["Wi-Fi", "Coffee"],
    status: "pending",
    paymentStatus: "pending",
    autoRenew: false,
    meta: {},
    createdAt: "2024-01-28T09:20:00Z",
    updatedAt: "2024-01-28T09:20:00Z",
    items: [],
    customer: {
      id: 4,
      picture: "",
      userName: "@amina",
      user: {
        id: 4,
        firstName: "Aisha",
        lastName: "Bello",
      },
    },
  },
  {
    id: "5",
    orderId: "#OTG-98249",
    customerId: 5,
    businessId: 1,
    branchId: 1,
    subTotal: 17500,
    discountAmount: 0,
    totalAmount: 17500,
    voucherId: null,
    voucherCode: null,
    amenitiesCategory: ["Wi-Fi", "Lounge", "Food"],
    status: "completed",
    paymentStatus: "paid",
    autoRenew: false,
    meta: {},
    createdAt: "2024-01-28T09:20:00Z",
    updatedAt: "2024-01-28T09:20:00Z",
    items: [],
    customer: {
      id: 5,
      picture: "",
      userName: "@tunde",
      user: {
        id: 5,
        firstName: "Tunde",
        lastName: "Adeyemi",
      },
    },
  },
];

export default function DashboardPage() {
  return (<>
    <Header />
    <div className="space-y-6">

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        {["12 months", "30 days", "7 days", "24 hours"].map((period, i) => (
          <button
            key={period}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${i === 0
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-white hover:text-gray-900"
              }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="₦135,600,000"
          change="2.4%"
          changeType="positive"
        />
        <StatsCard
          title="Active Customers"
          value="1,234"
          icon={Users}
          change="2.4%"
          changeType="positive"
        />
        <StatsCard
          title="Active Wi-Fi Sessions"
          value="22"
          icon={Wifi}
          change="2.4%"
          changeType="positive"
        />
        {/* Placeholder for Top Branches or similar if needed, design shows 3 cards + charts below */}
        {/* Actually design shows 3 top cards, then charts. Let's stick to design. */}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RevenueSplitChart />
        </div>
      </div>

      {/* Bottom Section: Top Branches and Orders */}
      {/* Based on the screenshot, Top Branches is a list, and Orders is a table below or separate. 
          The user showed a screenshot with "Orders" table. I will add it below the layout.
      */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Keeping the Total Customers Chart as it was in the code previously if desired, 
                but maybe replace with Orders table as per new requirement? 
                The screenshot with Orders table seems to be the main focus. 
                Let's put the Orders Table here instead of Total Customers if that was a placeholder.
                However, I will put Orders Table below everything to match a typical dashboard flow 
                or replace the "Total Customers" section if it feels right. 
                Actually, let's keep the grid layout and add Orders Table as a full width component below.
            */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Total Customers</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">64</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                    2.4%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Avg. per month</p>
              </div>
            </div>
            {/* Simple Bar Chart for Total Customers */}
            <div className="flex items-end gap-2 h-32">
              {[40, 60, 45, 70, 50, 60, 80, 55, 90, 65, 85, 40].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-600 rounded-t-sm"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Top Branches by Performance
            </h3>
            <div className="space-y-4">
              {[
                { name: "CafeOne - Lekki", value: "₦135,600,000" },
                { name: "CafeOne - Ikorodu", value: "₦122,400,000" },
                { name: "CafeOne - Ikeja", value: "₦121,500,000" },
                { name: "CafeOne - VI", value: "₦115,600,000" },
                { name: "CafeOne - Ikoyi", value: "₦105,000,000" },
              ].map((branch, index) => (
                <div
                  key={branch.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-xs text-gray-900">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {branch.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {branch.value}
                      </span>
                    </div>
                  </div>
                  <Store className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Section */}
      <OrdersTable orders={orders} />
    </div></>
  );
}
