import { Sidebar } from "@/app/components/Sidebar";
import { Header } from "@/app/components/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">

                <main className="flex-1 overflow-y-auto bg-white p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
