import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FloatingWidgets } from '@/components/ui/floating-widgets'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <Footer />
            <FloatingWidgets />
        </>
    )
}
