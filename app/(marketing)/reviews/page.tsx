import { Star, Quote } from 'lucide-react'

const reviews = [
    {
        name: 'James K.',
        location: 'United States',
        rating: 5,
        title: 'Best IPTV service I\'ve ever used',
        review: 'I\'ve tried at least 5 different providers over the past 2 years. Streamtly is by far the most reliable. Zero buffering, amazing channel selection, and the custom app is better than most paid streaming services. The 4K quality on my LG OLED is stunning.',
        plan: '12 Months',
        date: 'February 2026',
    },
    {
        name: 'Sarah M.',
        location: 'United Kingdom',
        rating: 5,
        title: 'Setup was incredibly easy',
        review: 'I was nervous about setting this up on my Firestick, but the guides made it so simple. Took me literally 3 minutes. The channel selection is massive — I get every Premier League match, all the US sports, and more movies than I could ever watch.',
        plan: '6 Months',
        date: 'January 2026',
    },
    {
        name: 'Ahmed R.',
        location: 'Canada',
        rating: 5,
        title: 'Worth every penny',
        review: 'Cancelled my cable subscription ($180/month) and switched to Streamtly. I now pay a fraction of the price and get 10x the content. The Arabic and French channels are excellent, and the VOD library is always being updated with new releases.',
        plan: '12 Months',
        date: 'January 2026',
    },
    {
        name: 'Maria G.',
        location: 'Germany',
        rating: 4,
        title: 'Great service, great support',
        review: 'Had a small issue with the EPG guide not loading on my Samsung TV. Contacted support and they fixed it within 10 minutes. The channel quality is excellent and I love having access to channels from multiple countries.',
        plan: '3 Months',
        date: 'December 2025',
    },
    {
        name: 'David L.',
        location: 'Australia',
        rating: 5,
        title: 'PPV events are the best',
        review: 'Got this mainly for UFC and boxing PPV events. Every single event has been flawless — no interruptions, no lag, crystal clear quality. The fact that PPV is included in the subscription is incredible value.',
        plan: '12 Months',
        date: 'February 2026',
    },
    {
        name: 'Lisa T.',
        location: 'Netherlands',
        rating: 5,
        title: 'Goodbye Netflix, hello Streamtly',
        review: 'The VOD library alone makes this worth it. I cancelled Netflix, Disney+, and HBO Max. Streamtly has everything in one place and the two-connection plan means my kids can watch their shows while I watch mine.',
        plan: '6 Months',
        date: 'January 2026',
    },
]

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-white/10'}`}
                />
            ))}
        </div>
    )
}

export default function ReviewsPage() {
    const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            <div className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Customer <span className="gradient-text">Reviews</span>
                </h1>
                <p className="text-lg text-[#8899aa] max-w-xl mx-auto mb-8">
                    Don&apos;t just take our word for it — hear from thousands of satisfied customers worldwide.
                </p>

                {/* Average Rating */}
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" />
                        ))}
                    </div>
                    <span className="text-white font-bold text-lg">{avgRating}</span>
                    <span className="text-[#8899aa] text-sm">from {reviews.length}+ reviews</span>
                </div>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, i) => (
                    <div
                        key={i}
                        className="p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-white mb-1">{review.name}</h3>
                                <p className="text-xs text-[#8899aa]">{review.location} · {review.plan} Plan</p>
                            </div>
                            <Quote className="w-8 h-8 text-[#00d4ff]/20 flex-shrink-0" />
                        </div>
                        <StarRating rating={review.rating} />
                        <h4 className="font-semibold text-white mt-3 mb-2">{review.title}</h4>
                        <p className="text-sm text-[#8899aa] leading-relaxed">{review.review}</p>
                        <p className="text-xs text-[#555] mt-4">{review.date}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Join Them?</h2>
                <a
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00e5a0] text-[#0a0f1a] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105"
                >
                    View Plans & Get Started
                </a>
            </div>
        </div>
    )
}
