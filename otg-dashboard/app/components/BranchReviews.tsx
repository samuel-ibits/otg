"use client";

import { Star } from "lucide-react";

import type { BranchReview, BranchReviewStats, RatingDistribution } from "@/app/lib/types";

interface BranchReviewsProps {
    reviews?: BranchReview[];
    stats?: BranchReviewStats;
    distribution?: RatingDistribution;
}

export function BranchReviews({ reviews = [], stats, distribution }: BranchReviewsProps) {
    const defaultStats = { rating: 0, reviewCount: 0 };
    const currentStats = stats || defaultStats;
    const currentDistribution = distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

    return (
        <div className="space-y-8">
            <div className="flex items-start gap-12 bg-white rounded-lg">
                <div className="w-48">
                    <h2 className="text-5xl font-bold text-gray-900 mb-2">{currentStats.rating.toFixed(1)}</h2>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`h-5 w-5 ${s <= Math.round(currentStats.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">{currentStats.reviewCount} reviews</p>
                </div>

                <div className="flex-1 max-w-md space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = currentDistribution[rating.toString()] || 0;
                        const percentage = currentStats.reviewCount > 0 ? (count / currentStats.reviewCount) * 100 : 0;
                        return (
                            <div key={rating} className="flex items-center gap-4">
                                <span className="text-sm font-medium w-3">{rating}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-2 pb-4 border-b">
                {['Most relevant', 'Newest', 'Highest', 'Lowest'].map((filter, i) => (
                    <button
                        key={filter}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border ${i === 0 ? 'bg-gray-100 border-gray-100 text-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                {reviews.map((review) => (
                    <div key={review.id} className="space-y-4 pb-8 border-b last:border-0 border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-yellow-700 flex items-center justify-center text-white font-semibold overflow-hidden">
                                    {review.author.picture ? (
                                        <img src={review.author.picture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        review.author.userName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{review.author.userName}</h4>
                                    <span className="text-xs text-gray-400">{review.author.totalReviews} reviews</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex gap-0.5 justify-end mb-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`h-3 w-3 ${s <= review.rating.overall ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">
                            {review.body}
                        </p>

                        {review.media && review.media.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {review.media.map((img, i) => (
                                    <div key={i} className="aspect-video rounded-md overflow-hidden bg-gray-100">
                                        <img src={typeof img === 'string' ? img : img.url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
