"use client";

export function PasswordView() {
    return (
        <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Password Settings</h3>
            <p>Manage your password and security settings here.</p>
        </div>
    );
}

export function InfrastructureView() {
    return (
        <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Wi-Fi Infrastructure</h3>
            <p>Manage your hardware and network configurations.</p>
        </div>
    );
}

export function AmenitiesView() {
    return (
        <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Amenities</h3>
            <p>Configure amenities available at your branch.</p>
        </div>
    );
}

export function StaffView() {
    return (
        <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Management</h3>
            <p>Add and manage staff members.</p>
        </div>
    );
}
