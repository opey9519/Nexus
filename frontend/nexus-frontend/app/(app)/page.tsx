"use client"

import { useEffect, useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import TodayWorkoutCard from "@/components/home/TodayWorkoutCard";
import QuickStats from "@/components/home/QuickStats";
import RecentWorkoutCard from "@/components/home/RecentWorkoutCard";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { GetUser } from "@/lib/api/User";
import { GetLifts } from "@/lib/api/Lifts";
import type { UserGetResponseDto } from "@/lib/Interfaces/UserInterface";
import {
    GroupWorkoutsByDay,
    GetTodayWorkout,
    ComputeStreak,
    GetWorkoutLabel,
    type WorkoutGroup,
} from "@/lib/workouts";

export default function HomePage() {
    const [user, setUser] = useState<UserGetResponseDto | null>(null);
    const [groups, setGroups] = useState<WorkoutGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const [userData, lifts] = await Promise.all([
                    GetUser(),
                    GetLifts()
                ]);

                if (!active) return;

                setUser(userData);
                setGroups(GroupWorkoutsByDay(lifts));
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

    if (isLoading) {
        return (
            <main className="px-4 pb-24 pt-8">
                <div className="mx-auto max-w-md">
                    <LoadingState />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="px-4 pb-24 pt-8">
                <div className="mx-auto max-w-md space-y-6">
                    <ErrorState message={error} onRetry={handleRetry} />
                </div>
            </main>
        );
    }

    const today = GetTodayWorkout(groups);
    const recent = groups[0];

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="
                mx-auto
                max-w-md
                space-y-6
            ">

                <HomeHeader
                    firstName={user?.firstName || user?.username || "there"}
                />

                <TodayWorkoutCard
                    workout={today ? {
                        id: today.id,
                        name: GetWorkoutLabel(today),
                        exerciseCount: today.exerciseCount,
                        completedSets: today.setCount,
                        totalSets: today.setCount,
                    } : undefined}
                />

                <QuickStats
                    workoutCount={groups.length}
                    streak={ComputeStreak(groups)}
                />

                {recent && (
                    <RecentWorkoutCard
                        id={recent.id}
                        name={GetWorkoutLabel(recent)}
                        date={recent.performedAt.toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                        )}
                        setCount={recent.setCount}
                    />
                )}

            </div>
        </main>
    );
}
