// Authentication layout page

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-[#09080F] text-[#F5F3FA]">
            {children}
        </div>
    );
}