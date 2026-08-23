"use client"

import { useEffect, useState } from "react";
import HistoryHeader from "@/components/history/HistoryHeader";
import WorkoutHistoryList from "@/components/history/WorkoutHistoryList";
import EmptyHistory from "@/components/history/EmptyHistory";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { GetLifts } from "@/lib/api/Lifts";
import {
    GroupWorkoutsByDay,
    GetWorkoutLabel,
    type WorkoutGroup,
} from "@/lib/workouts";

export default function HistoryPage() {
    const [groups, setGroups] = useState<WorkoutGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const lifts = await GetLifts();

                if (!active) return;
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

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="
                mx-auto
                max-w-md
                space-y-6
            ">
                <HistoryHeader />

                {isLoading && <LoadingState />}

                {!isLoading && error && (
                    <ErrorState message={error} onRetry={handleRetry} />
                )}

                {!isLoading && !error && (
                    groups.length > 0 ? (
                        <WorkoutHistoryList
                            workouts={groups.map((group) => ({
                                id: group.id,
                                date: group.performedAt.toISOString(),
                                name: GetWorkoutLabel(group),
                                exerciseCount: group.exerciseCount,
                                setCount: group.setCount,
                                totalVolume: Math.round(group.totalVolume),
                            }))}
                        />
                    ) : (
                        <EmptyHistory />
                    )
                )}
            </div>
        </main>
    );
}
