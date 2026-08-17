"use client";

// Contains Navigation Item Component
// Used in NavBar

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
    label: string;
    icon: LucideIcon;
    href: string;
    active?: boolean;
}

export default function NavItem({
    label,
    icon: Icon,
    href,
    active = false,
}: NavItemProps) {
    return (
        <Link
            href={href}
            className={`
                flex min-w-16 flex-col
                items-center justify-center
                gap-1 rounded-xl
                px-3 py-2
                text-xs font-medium
                transition-all duration-200
                active:scale-95
                ${
                    active
                        ? "text-[#A855F7]"
                        : "text-[#9A94A8] hover:text-[#F5F3FA]"
                }
            `}
        >
            <Icon
                className={`
                    h-5 w-5
                    transition-transform duration-200
                    ${
                        active
                            ? "scale-110"
                            : "scale-100"
                    }
                `}
            />

            <span>{label}</span>
        </Link>
    );
}