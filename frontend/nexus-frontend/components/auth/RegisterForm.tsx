"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { CreateUser, LoginUser } from "@/lib/api/Auth";
import { ApiError } from "@/lib/api/Utils";

export default function RegisterForm() {
    const router = useRouter();

    // Required to create account
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Optional for new account
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Page Quality of Life
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle register new user
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault();

            if (password !== confirmPassword) {
                setError("Passwords do not match.")
                return;
            }
    
            setError(null);
            setIsLoading(true);
    
            try {
                await CreateUser({
                   email,
                   password,
                   username,
                   firstName,
                   lastName
                });

                // Log the new user in and enter the application
                await LoginUser({ email, password });

                router.replace("/");
                router.refresh();
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
            <form
            onSubmit={handleSubmit}
            className="w-full space-y-5"
        >
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-[#F5F3FA]"
                    >
                        First name
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(event) =>
                            setFirstName(event.target.value)
                        }
                        placeholder="First"
                        autoComplete="given-name"
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

                {/* Last Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-[#F5F3FA]"
                    >
                        Last name
                    </label>

                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(event.target.value)
                        }
                        placeholder="Last"
                        autoComplete="family-name"
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
            </div>

            {/* Username */}
            <div className="space-y-2">
                <label
                    htmlFor="username"
                    className="text-sm font-medium text-[#F5F3FA]"
                >
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                    placeholder="yourusername"
                    autoComplete="username"
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
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
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
                <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#F5F3FA]"
                >
                    Password
                </label>

                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Create a password"
                        autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="space-y-2">
                <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-[#F5F3FA]"
                >
                    Confirm password
                </label>

                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your password"
                        autoComplete="new-password"
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
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
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
                            showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showConfirmPassword ? (
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
                {isLoading
                    ? "Creating account..."
                    : "Create Account"}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-[#9A94A8]">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="
                        font-medium
                        text-[#A855F7]
                        hover:text-[#C084FC]
                    "
                >
                    Sign in
                </Link>
            </p>
        </form>
        </>
    );
}