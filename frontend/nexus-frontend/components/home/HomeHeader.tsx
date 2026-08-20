interface HomeHeaderProps {
    firstName: string;
}

export default function HomeHeader({firstName} : HomeHeaderProps) {
    return (
        <>
            <header className="space-y-1">
            <p className="text-sm text-[#9A94A8]">
                Welcome back
            </p>

            <h1 className="
                text-2xl
                font-semibold
                tracking-tight
                text-[#F5F3FA]
            ">
                Good morning, {firstName}
            </h1>
        </header>
        </>
    );
}