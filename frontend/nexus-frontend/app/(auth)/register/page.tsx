import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <main
            className="
                flex min-h-dvh
                items-center justify-center
                px-6 py-12
            "
        >
            <div className="w-full max-w-md">

                {/* Nexus Branding */}
                <div className="mb-8 text-center">
                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[#F5F3FA]
                        "
                    >
                        NEXUS
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#9A94A8]
                        "
                    >
                        The Centralized Training Platform.
                    </p>
                </div>

                <RegisterForm />

            </div>
        </main>
    );
}