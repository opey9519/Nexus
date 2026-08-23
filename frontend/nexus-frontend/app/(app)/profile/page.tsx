"use client"

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import BodyMetrics from "@/components/profile/BodyMetrics";
import ActivityLevel from "@/components/profile/ActivityLevel";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import LogoutButton from "@/components/auth/LogoutButton";
import { GetUser } from "@/lib/api/User";
import type { UserGetResponseDto } from "@/lib/Interfaces/UserInterface";

export default function ProfilePage() {
    const [user, setUser] = useState<UserGetResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const userData = await GetUser();

                if (!active) return;
                setUser(userData);
            } catch (err) {
                if (!active) return;
                setError(err instanceof Error ? err.message : "Something went wrong.");
            } finally {
                if (active) setIsLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [reloadKey]);

    function handleRetry() {
        setError(null);
        setIsLoading(true);
        setReloadKey((key) => key + 1);
    }

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                <div className ="flex justify-between items-center">
                    <h1 className="
                    text-2xl
                    font-semibold
                    text-[#F5F3FA]
                ">
                    Profile
                    </h1>

                    <LogoutButton/>
                </div>
                

                {isLoading && <LoadingState />}

                {!isLoading && error && (
                    <ErrorState message={error} onRetry={handleRetry} />
                )}

                {!isLoading && !error && user && (
                    <>
                        <ProfileHeader
                            firstName={user.firstName || user.username}
                            lastName={user.lastName || ""}
                            username={user.username}
                        />

                        <ProfileInformation
                            firstName={user.firstName || "-"}
                            lastName={user.lastName || "-"}
                            email={user.email}
                        />

                        <BodyMetrics
                            heightCm={user.height ?? 0}
                            bodyweightLbs={user.bodyweightLBS ?? 0}
                        />

                        <ActivityLevel
                            activityLevel={user.activityLevel || "Not set"}
                        />

                        {user.createdAt && (
                            <section
                                className="
                                    rounded-2xl
                                    border border-white/10
                                    bg-[#12101A]
                                    p-4
                                "
                            >
                                <p className="text-sm text-[#9A94A8]">
                                    Member Since
                                </p>

                                <p className="mt-1 font-medium text-[#F5F3FA]">
                                    {new Date(user.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        }
                                    )}
                                </p>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
