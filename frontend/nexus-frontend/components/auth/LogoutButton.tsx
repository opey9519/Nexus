import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoutUser } from "@/lib/api/Auth";

// Contains icons
import {
    LogOut,
} from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await LogoutUser();
        } finally {
            router.replace("/login");
            router.refresh();
        }
    }

    return (
        <>
            {/* Logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    aria-label="Log out"
                    className="
                        flex h-12 w-12 shrink-0
                        flex-col items-center justify-center gap-0.5
                        rounded-xl text-[#625C70]
                        transition-colors hover:text-[#F5F3FA]
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                >
                    <LogOut className="h-5 w-5" />
                    <span className="text-[10px] font-medium">
                        {isLoggingOut ? "..." : "Logout"}
                    </span>
                </button>
        </>
    );
}