// General Application layout for Nexus

import NavBar from "@/components/navigation/NavBar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-[#09080F] text-[#F5F3FA]">
            <main className="pb-20">
                {children}
            </main>

            <NavBar />
        </div>
    );
}