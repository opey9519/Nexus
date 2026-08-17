'use client'

// Contains Navigation Item Component
// Used in NavBar 

import { LucideIcon } from "lucide-react";

interface NavItemProps {
    buttonName: string;
    icon: LucideIcon;
}

export default function NavItem({buttonName, icon : Icon}: NavItemProps) {
    return (
        <>
            <button
                    className="
                        flex min-w-16 flex-col
                        items-center justify-center
                        gap-1 rounded-xl
                        px-3 py-2
                        text-xs font-medium
                        text-[#9A94A8]
                        transition-colors duration-200
                        hover:text-[#F5F3FA]
                        active:scale-95
                    "
            >
                <Icon className="h-5 w-5"></Icon>
                <span>{buttonName}</span>
            </button>
        </>
    );
}