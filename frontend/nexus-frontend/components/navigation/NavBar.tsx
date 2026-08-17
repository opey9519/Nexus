"use client"

// Navigation bar used to traverse the application

import { usePathname } from "next/navigation";
import NavItem from "./NavItem";

// Contains icons
import {
    Home,
    Dumbbell,
    History,
    User,
} from "lucide-react";

export default function Navbar() {
    const pathName = usePathname();

    return (
        <nav
            className="
                fixed bottom-5 left-3 right-3 z-50
                border border-white/10
                rounded-4xl
                bg-[#09080F]/95
                backdrop-blur-xl
                pb-[env(safe-area-inset-bottom)]
            "
        >
            <div
                className="
                    mx-auto flex h-16 max-w-md
                    items-center justify-around
                    px-2
                "
            >
                {/* Home */}
                <NavItem
                    label="Home"
                    icon={Home}
                    href="/"
                    active={pathName === "/"}
                />

                {/* Workout */}
                <NavItem
                    label="Workout"
                    icon={Dumbbell}
                    href="/workout"
                    active={pathName.startsWith("/workout")}
                />

                {/* History */}
                <NavItem
                    label="History"
                    icon={History}
                    href="/history"
                    active={pathName.startsWith("/history")}
                />

                {/* User Profile */}
                <NavItem
                    label="Profile"
                    icon={User}
                    href="/profile"
                    active={pathName.startsWith("/profile")}
                />
            </div>
        </nav>
    );
}