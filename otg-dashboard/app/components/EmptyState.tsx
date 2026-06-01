import { FileText } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-gray-300" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-2 top-0 h-4 w-4 rounded-full bg-blue-100" />
                <div className="absolute -left-2 bottom-4 h-3 w-3 rounded-full bg-gray-200" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
        </div>
    );
}
