import { AuthForm } from '@/components/auth/AuthForm'

export default function SignInPage({
    searchParams,
}: {
    searchParams: { message?: string; next?: string }
}) {
    return (
        <div className="flex-1 flex items-center justify-center p-4 bg-[#0a0f1a]">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7]/5 blur-[120px] rounded-full" />
            </div>

            <AuthForm mode="sign-in" message={searchParams?.message} next={searchParams?.next} />
        </div>
    )
}
