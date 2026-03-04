'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FAQItem {
    q: string
    a: string
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [open, setOpen] = useState<number | null>(null)

    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-white/5 bg-[#111827] overflow-hidden transition-colors hover:border-white/10"
                >
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                        aria-expanded={open === i}
                        aria-controls={`faq-answer-${i}`}
                    >
                        <span className="font-semibold text-white pr-4">{item.q}</span>
                        <ChevronDown
                            className={`w-5 h-5 text-[#00d4ff] flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        id={`faq-answer-${i}`}
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <p className="px-5 pb-5 text-[#8899aa] leading-relaxed">{item.a}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
