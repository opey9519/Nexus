'use client'

// Navigation bar used to traverse the application

import NavItem from "./NavItem";

// Contains icons
import {
    Home,
    Dumbbell,
    History,
    User,
} from "lucide-react";

export default function Navbar() {
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
                    buttonName="Home"
                    icon={Home}
                />

                {/* Workout */}
                <NavItem
                    buttonName="Workout"
                    icon={Dumbbell}
                />

                {/* History */}
                <NavItem
                    buttonName="History"
                    icon={History}
                />

                {/* User Profile */}
                <NavItem
                    buttonName="Profile"
                    icon={User}
                />
            </div>
        </nav>
    );
}