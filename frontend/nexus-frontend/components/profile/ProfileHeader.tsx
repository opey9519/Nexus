interface ProfilePageProps {
    firstName: string;
    lastName: string;
    username: string;
}

export default function ProfileHeader({firstName, lastName, username} : ProfilePageProps) {
    const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

    return (
        <section className="flex flex-col items-center">
            <div
                className="
                    flex h-20 w-20
                    items-center justify-center
                    rounded-full
                    bg-[#A855F7]/15
                    text-2xl font-semibold
                    text-[#A855F7]
                    ring-1 ring-[#A855F7]/30
                "
            >
                {initials}
            </div>

            <h1 className="mt-4 text-xl font-semibold text-[#F5F3FA]">
                {firstName} {lastName}
            </h1>

            <p className="mt-1 text-sm text-[#9A94A8]">
                @{username}
            </p>
        </section>
    );
}