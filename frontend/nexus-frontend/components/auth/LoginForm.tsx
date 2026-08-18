"use client"

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { LoginUser } from "@/lib/api/Auth";
import { ApiError } from "@/lib/api/Utils";

export default function LoginForm() {
    // Required to login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Page Quality of Life
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle login user
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setIsLoading(true);

        try {
            await LoginUser({
                email,
                password
            });

            // TODO:
            // Redirect to authenicated application
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message)
            } else {
                setError ("Something went wrong. Please try again.")
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Email */}
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#F5F3FA]"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="
                        h-12 w-full
                        rounded-xl
                        border border-white/10
                        bg-[#09080F]
                        px-4
                        text-[#F5F3FA]
                        outline-none
                        placeholder:text-[#625C70]
                        focus:border-[#A855F7]
                        focus:ring-1
                        focus:ring-[#A855F7]/50
                    "
                />
            </div>

            {/* Password */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-[#F5F3FA]"
                    >
                        Password
                    </label>

                    <Link
                        href="/forgot-password"
                        className="
                            text-sm
                            text-[#A855F7]
                            transition-colors
                            hover:text-[#C084FC]
                        "
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="
                            h-12 w-full
                            rounded-xl
                            border border-white/10
                            bg-[#09080F]
                            px-4 pr-12
                            text-[#F5F3FA]
                            outline-none
                            placeholder:text-[#625C70]
                            focus:border-[#A855F7]
                            focus:ring-1
                            focus:ring-[#A855F7]/50
                        "
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#625C70]
                            transition-colors
                            hover:text-[#F5F3FA]
                        "
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div
                    className="
                        rounded-xl
                        border border-red-400/20
                        bg-red-400/10
                        px-4 py-3
                        text-sm
                        text-red-300
                    "
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="
                    h-12 w-full
                    rounded-xl
                    bg-[#A855F7]
                    font-semibold
                    text-white
                    transition-all duration-200
                    hover:bg-[#C084FC]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-[#9A94A8]">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="
                        font-medium
                        text-[#A855F7]
                        hover:text-[#C084FC]
                    "
                >
                    Create one
                </Link>
            </p>
        </form>
        </>
    );
}