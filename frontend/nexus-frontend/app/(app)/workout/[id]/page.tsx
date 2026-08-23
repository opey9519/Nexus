"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkoutHeader from "@/components/workout/WorkoutHeader";
import WorkoutSummary from "@/components/workout/WorkoutSummary";
import ExerciseCard from "@/components/workout/ExerciseCard";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { GetLifts } from "@/lib/api/Lifts";
import {
    GroupWorkoutsByDay,
    GetWorkoutLabel,
    ExpandSets,
    type WorkoutGroup,
} from "@/lib/workouts";

// Shows a single past workout, identified by its date key (YYYY-MM-DD)

export default function WorkoutDetailPage() {
    const params = useParams<{ id: string }>();
    const workoutId = params?.id;

    const [workout, setWorkout] = useState<WorkoutGroup | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!workoutId) return;

        let active = true;

        (async () => {
            try {
                const groups = GroupWorkoutsByDay(await GetLifts());

                if (!active) return;
                setWorkout(groups.find((group) => group.id === workoutId));
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
    }, [workoutId, reloadKey]);

    function handleRetry() {
        setError(null);
        setIsLoading(true);
        setReloadKey((key) => key + 1);
    }

    return (
        <main className="px-4 pb-24 pt-8">
            <div className="mx-auto max-w-md space-y-6">

                {isLoading && <LoadingState />}

                {!isLoading && error && (
                    <ErrorState message={error} onRetry={handleRetry} />
                )}

                {!isLoading && !error && !workout && (
                    <p className="text-sm text-[#9A94A8]">
                        Workout not found.
                    </p>
                )}

                {!isLoading && !error && workout && (
                    <>
                        <WorkoutHeader
                            date={workout.performedAt.toLocaleDateString(
                                "en-US",
                                { weekday: "long", month: "long", day: "numeric" }
                            )}
                            workoutName={GetWorkoutLabel(workout)}
                        />

                        <WorkoutSummary
                            exerciseCount={workout.exerciseCount}
                            setCount={workout.setCount}
                        />

                        <div className="space-y-4">

                            {workout.lifts.map((lift) => (
                                <ExerciseCard
                                    key={lift.id}
                                    exerciseName={lift.exerciseName}
                                    sets={ExpandSets(lift)}
                                    notes={lift.notes ?? null}
                                />
                            ))}

                        </div>
                    </>
                )}

            </div>
        </main>
    );
}
