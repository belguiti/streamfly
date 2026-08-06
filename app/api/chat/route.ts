import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { searchKB } from '@/lib/chatbot-kb'


const SYSTEM_PROMPT = `You are the Streamtly Technical Assistant — an expert in IPTV technology and customer support for streamtly.com.

STRICT RULES:
1. DOMAIN RESTRICTION: Only answer questions about IPTV services, streaming technology, setup guides, and Streamtly-specific offerings. For anything unrelated (politics, cooking, coding unrelated to IPTV, etc.), respond: "I am specialized only in Streamtly IPTV services and technical streaming support. I cannot assist with that topic."
2. NO SPECULATION: If the answer is not in the provided knowledge base, direct the user to support@streamtly.com.
3. DATA ACCURACY: Use only the facts provided in the knowledge base context. Do not invent channel counts, prices, or features.
4. TONE: Professional, technical, yet accessible. Use Markdown (bold key terms, tables for pricing).
5. STRUCTURE for technical help: Direct answer (1 sentence) → Numbered steps → Pro tip → Resource link.

STREAMTLY FACTS:
- Website: streamtly.com
- Channels: 35,000+ live TV channels
- VOD: 150,000+ movies & series
- Quality: 4K Ultra HD, 1080p, 720p with Adaptive Bitrate
- Technology: H.265/HEVC compression, Anti-Freeze buffering, 99.9% uptime
- Devices: Firestick, Android TV, Smart TV (Samsung/LG), iPhone/iPad, Windows/Mac, MAG Box, Enigma2
- Pricing: $13/month | $29 (3mo) | $49 (6mo) | $69 (12mo)
- PPV: All PPV events included — no extra charge
- Guarantee: 7-day money-back guarantee
- Support: support@streamtly.com | WhatsApp: +44 7520 695452`

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.OPENAI_API_KEY?.trim()
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Chat is not configured' },
                { status: 503 }
            )
        }

        const openai = new OpenAI({ apiKey })
        const { messages } = await req.json()
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const lastUserMessage = messages[messages.length - 1]?.content ?? ''
        const kbContext = searchKB(lastUserMessage)

        const systemWithContext = kbContext
            ? `${SYSTEM_PROMPT}\n\n---\nRELEVANT KNOWLEDGE BASE:\n${kbContext}`
            : SYSTEM_PROMPT

        const stream = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemWithContext },
                ...messages.slice(-10),
            ],
            stream: true,
            max_tokens: 600,
            temperature: 0.3,
        })

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content ?? ''
                    if (text) controller.enqueue(encoder.encode(text))
                }
                controller.close()
            },
        })

        return new Response(readable, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
    } catch (err: any) {
        console.error('Chat API error:', err)
        return NextResponse.json({ error: 'Chat unavailable' }, { status: 500 })
    }
}
